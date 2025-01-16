const supabase = require("../../model/db");
const jwt = require("jsonwebtoken");

exports.get = async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    console.error("from authuser : No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging
    req.user = decoded;

    const user_id = req.user.id; // Access `id` from the token payload

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    // Query the database
    const { data: validasiData, error: validasiDataError } = await supabase
      .from("riwayat_validasi")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false }) // Assuming "created_at" is the timestamp column
      .limit(1);

    // Handle query errors
    if (validasiDataError) {
      console.error("Supabase query error:", validasiDataError.message);
      return res.status(500).json({ message: "Database query failed" });
    }

    // Handle no data found
    if (!validasiData) {
      return res.status(404).json({ message: "Riwayat not found" });
    }

    // Return the data
    return res.status(200).json({
      message: "Your Riwayat Found",
      data: validasiData,
    });
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
