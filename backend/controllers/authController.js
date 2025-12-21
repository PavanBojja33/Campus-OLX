const User=require("../models/user");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');


exports.register = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }


    if (!email.endsWith('.ac.in')) {
        return res.status(400).json({ message: "Use college email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        department,
        verificationToken
    });

    const verifyLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    await sendEmail(
        email,
        "Verify your Campus OLX account",
        `<p>Click to verify:</p><a href="${verifyLink}">${verifyLink}</a>`
    );

    res.status(201).json({
        message: "Registration successful. Check email to verify account."
    })
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
  
};

exports.login = async (req,res) => {
    const {email,password} =req.body;

    const user=await User.findOne({email});
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    if (!user.verified) {
        return res.status(401).json({ message: "Please verify your email first" });
    }



    const token = jwt.sign(
        { id : user._id},

        process.env.JWT_SECRET,

        {expiresIn : "1d"}
    )

    res.json({token});
}

exports.verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({
            verificationToken: req.params.token
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        if (user.verified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        user.verified = true;

        user.verificationToken = null;

        await user.save();

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Email verification failed" });
    }
};
