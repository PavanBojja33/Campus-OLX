const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cors=require('cors');

dotenv.config()

const app=express()

app.use(cors())

app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("Mongo Error:", err.message));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));



app.get('/',(req,res) => {
    res.send("Campus OLX is running")
})



app.listen(5000,() => {
    console.log("App is running at 5000")
})