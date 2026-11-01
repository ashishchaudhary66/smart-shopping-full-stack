const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authorization = req.headers.authorization;
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : null;
  const token = req.cookies?.token || bearerToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required." });
  }
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured.");
    return res.status(500).json({ success: false, message: "Authentication is temporarily unavailable." });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired session." });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return res.status(403).json({ success: false, message: "Administrator access required." });
  }
  return next();
};
