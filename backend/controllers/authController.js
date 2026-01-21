const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const sendEmail = require("../utils/sendEmail");

/* ================= REGISTER ================= */
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, department } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });

//   if (existingUser) {
//     if (existingUser.verified) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//   // user exists but NOT verified → resend email
//   const token = crypto.randomBytes(32).toString("hex");
//   existingUser.verificationToken = token;
//   await existingUser.save();

//   const verifyLink = `http://localhost:5000/api/auth/verify/${token}`;

//   await sendEmail(
//     email,
//     "Verify your Campus OLX account",
//     `
//       <h3>Campus OLX Email Verification</h3>
//       <p>You already registered. Please verify your account:</p>
//       <a href="${verifyLink}">${verifyLink}</a>
//     `
//   );

//   return res.status(200).json({
//     message: "Verification email resent. Please check your inbox.",
//   });
// }


//     const hashedPassword = await bcrypt.hash(password, 10);

//     const verificationToken = crypto.randomBytes(32).toString("hex");

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       department,
//       verified: false,
//       verificationToken,
//     });

//     const verifyLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;

//     console.log("Sending verification email to:", email);

//     await sendEmail(
//       email,
//       "Verify your Campus OLX account",
//       `
//         <h3>Campus OLX Email Verification</h3>
//         <p>Click the link below to verify your account:</p>
//         <a href="${verifyLink}">${verifyLink}</a>
//       `
//     );

//     console.log("Email sent successfully");

//     res.status(201).json({
//       message: "Registration successful. Check your email to verify account.",
//     });
//   } catch (error) {
//     console.error("REGISTER ERROR:", error);
//     res.status(500).json({ message: "Registration failed" });
//   }
// };

exports.register = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      department
    });

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};


/* ================= VERIFY EMAIL ================= */
// exports.verifyEmail = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       verificationToken: req.params.token,
//     });

//     if (!user) {
//       return res.redirect("http://localhost:5173/login?verified=false");
//     }

//     user.verified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     return res.redirect("http://localhost:5173/login?verified=true");
//   } catch (err) {
//     return res.redirect("http://localhost:5173/login?verified=false");
//   }
// };


// /* ================= RESEND VERIFICATION ================= */
// exports.resendVerification = async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   if (user.verified) {
//     return res.status(400).json({ message: "Email already verified" });
//   }

//   const token = crypto.randomBytes(32).toString("hex");
//   user.verificationToken = token;
//   await user.save();

//   const link = `http://localhost:5000/api/auth/verify/${token}`;

//   await sendEmail(
//     email,
//     "Verify your Campus OLX account",
//     `<p>Click the link below to verify your account:</p>
//      <a href="${link}">${link}</a>`
//   );

//   res.json({ message: "Verification email resent" });
// };



/* ================= LOGIN ================= */
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     if (!user.verified) {
//       return res
//         .status(401)
//         .json({ message: "Please verify your email first" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({ token });
//   } catch (error) {
//     console.error("LOGIN ERROR:", error);
//     res.status(500).json({ message: "Login failed" });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};
