require('dotenv').config(); // Dotenv eka load karanna
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// User Schema (Database Structure)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// POST /login Endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Database eken check kirima
    const user = await User.findOne({ email, password });

    if (user) {
      // Login Success
      res.status(200).json({ message: "Login Successful" });
    } else {
      // Invalid Credentials
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Server eka run kirima
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Manual data ekak danna widiya (Meka ekaparak run karala passe ain karanna)

// const seedUser = async () => {
//   const newUser = new User({ email: "test@gmail.com", password: "123" });
//   await newUser.save();
//   console.log("Manual User Created!");
// };
// seedUser();

// මේ පේළිය අන්තිමට එකතු කරන්න (app.listen එක වෙනුවට)
module.exports = app;
