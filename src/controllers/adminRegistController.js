const supabase = require("../../model/db");
const moment = require("moment");
const bcrypt = require("bcrypt");
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const createdAt = moment().format("LL");

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (username.length < 8 && password.length < 8) {
      return res
        .status(400)
        .json({
          error: "Username and password must be at least 8 characters long.",
        });
    }
    const existingUser = await supabase
      .from("users_data")
      .select("username_NIP")
      .eq("username_NIP", username)
      .single();

    if (existingUser.data) {
      return res.status(400).json({ error: "Username already exists." });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("admin")
      .insert([
        {
          username: username,
          email: email,
          password: hashedPassword,
          created_at: createdAt,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    // Success response
    res.status(201).json({ message: "User registered successfully!", data });
  } catch (error) {
    // Catch unexpected errors
    res.status(500).json({ error: error.message });
  }
};
