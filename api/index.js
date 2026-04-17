require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration - ඔයාගේ Frontend URL එක මෙතන තියෙනවා
app.use(cors({
    origin: ["https://login-app-host-frontned.vercel.app"],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
}));

// MongoDB Connection with Timeout Options
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) return;
        
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB Connected Successfullydd!");
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
    }
};

// User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Routes
app.get("/", (req, res) => res.send("Server is running..."));

app.post('/login', async (req, res) => {
    await connectDB();
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ message: "Login Successful" });
        } else {
            res.status(401).json({ message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error", details: error.message });
    }
});

// Local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;