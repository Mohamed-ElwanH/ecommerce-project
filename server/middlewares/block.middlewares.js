exports.preventBlocked = (req, res, next) => {
  if (req.user?.isBlocked) {
    return res.status(403).json({ error: "Account is blocked from ordering" });
  }
  next();
};
