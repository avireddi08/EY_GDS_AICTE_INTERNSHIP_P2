import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

//SIGNUP Route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: "All fields are required!" });

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ message: "User already exists!" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  await newUser.save();

    //Generate JWT Token
    const token = jwt.sign({ id: newUser._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    //Send response with token
    res.status(201).json({
      message: "User registered successfully",
      token: token,
      user: { id: newUser._id, username: newUser.username}
    });

});

//SIGNIN Route
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Invalid username or password!" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid username or password!" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: "Sign-in successful", token });
});

export default router; 