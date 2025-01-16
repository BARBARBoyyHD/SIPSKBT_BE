require("dotenv").config();
const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
  // Get the token from the cookies
  const token = req.cookies?.accessToken;

  // Check if the token is provided
  if (!token) {
    console.error("from autuser : No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth User Middleware Error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authUser;