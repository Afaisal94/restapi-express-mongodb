const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "SecretKey1234";

// Import User Model
const User = require("../models/User");

// Register
const registerUser = async (req, res) => {
  // if email exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json({
      status: res.statusCode,
      message: "Email Already used !",
    });

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  // Create user
  try {
    const saveUser = await user.save();
    res.json(saveUser);
  } catch (err) {
    res.status(400).json({
      status: res.statusCode,
      message: "Failed to create a new user",
    });
  }
};

// Login
const loginUser = async (req, res) => {
  // check email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({
      status: res.statusCode,
      message: "Your Email is Wrong!",
    });

  // check password
  const validPwd = await bcrypt.compare(req.body.password, user.password);
  if (!validPwd)
    return res.status(400).json({
      status: res.statusCode,
      message: "Your Password is Wrong!",
    });

  // Create token with JWT
  const token = jwt.sign({ _id: user._id }, SECRET_KEY);
  res.header("auth-token", token).json({
    token: token,
    user: user,
  });
};

module.exports = {
  registerUser,
  loginUser,
};
