const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const token = async (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
};

exports.login = async (req, res) => {
  const { name, password } = req.body;
  try {
    const myUser = await User.findOne({ name }).select('+password');
    if (!myUser || !(await myUser.isCorrectPassword(password)))
      return res.status(404).json("Invalid username or password");
    if (myUser.isBlocked) return res.status(403).json({ error: 'Account is blocked' });
    const accessToken = await token(myUser);
    res.status(200).json({ message: "Logged in", token: accessToken });
  } catch (e) {
    res.status(500).json({ error: "DB error" });
  }
};
