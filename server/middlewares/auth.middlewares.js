const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const myUser = await User.findById(decoded.id).select("-password");
    if (myUser) {
      req.user = myUser;
      return next();
    }
    return res.status(401).json({ error: "Invalid token" });
  } catch (e) {
    console.log(e);
    return res.status(401).json({ error: "Invalid token" });
  }
};
