require("dotenv").config();
const supabase = require("../../model/db");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Import crypto for CSRFToken
const bcrypt = require("bcrypt")

// Function to generate access token
const generateAccessToken = (userData) => {
  return jwt.sign(
    { id: userData.user_id, username: userData.username_NIP, full_name: userData.nama_lengkap },
    process.env.SUPABASE_JWT_SECRET,
    { expiresIn: "1h" } // Access token expires in 15 minutes
  );
};

// Function to generate refresh token
const generateRefreshToken = (userData) => {
  return jwt.sign(
    { id: userData.user_id, username: userData.username_NIP, full_name: userData.nama_lengkap },
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

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Fetch user data from the database
    const { data: user, error } = await supabase
      .from("users_data")
      .select("*")
      .eq("username_NIP", username)
      .single();

    // Handle errors
    if (error) {
      console.error("Error fetching user:", error.message);
      return res.status(400).json({ error: error.message });
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const validPasswod = await bcrypt.compare(
        password,
        user.password
    )

    // Verify password (assuming password is stored as plaintext for now)
    if (!validPasswod) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const csrfToken = CSRFToken();

    res
    .cookie("accessToken",accessToken,{
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    }) .cookie("refreshToken", refreshToken, {
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

    // Return success response with tokens and user data
    return res.status(200).json({
      message: "Login successful!",
      accessToken,
      refreshToken,
      csrfToken,
      user: {
        id: user.user_id,
        username: user.username_NIP,
        full_name: user.nama_lengkap,
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "An unexpected error occurred.", details: error.message });
  }
};