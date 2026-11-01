const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name?.trim() || !email?.trim() || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Name, email and password are required." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Password does not match." });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ success: false, message: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "User",
      isDeleted: false,
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "User cannot be registered. Please try again later." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || user.isDeleted) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");
      return res.status(500).json({ success: false, message: "Authentication is temporarily unavailable." });
    }
    const payload = { email: user.email, _id: user._id, role: user.role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
    const options = {
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };
    return res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User logged in successfully.",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.logout = async (req, res) => {
  return res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  }).status(200).json({ success: true, message: "User logged out successfully." });
};
