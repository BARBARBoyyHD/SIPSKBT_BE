const supabase = require("../../model/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); 

const generateAccessToken = (userData) => {
  return jwt.sign(
    {
      id: userData.admin_id,
      username: userData.username,
      full_name: userData.nama_admin,
    },
    process.env.SUPABASE_JWT_SECRET,
    { expiresIn: "1h" } // Access token expires in 15 minutes
  );
};

// Function to generate refresh token
const generateRefreshToken = (userData) => {
  return jwt.sign(
    {
      id: userData.admin_id,
      username: userData.username,
      full_name: userData.nama_admin,
    },
    process.env.SUPABASE_JWT_SECRET,
    { expiresIn: "7d" } // Refresh token expires in 7 days
  );
};

// Function to generate CSRF token
const CSRFToken = () => {
  return crypto.randomBytes(20).toString("hex");
};
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { data: user, error } = await supabase
      .from("admin")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      console.error("Error fetching user:", error.message);
      return res.status(400).json({ error: error.message });
    }
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const csrfToken = CSRFToken();

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .cookie("CSRF-TOKEN", csrfToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    return res.status(200).json({
      message: "Login successful!",
      accessToken,
      refreshToken,
      csrfToken,
      user: {
        id: user.admin_id,
        username: user.username,
        full_name: user.nama_admin,
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ error: "An unexpected error occurred.", details: error.message });
  }
};
