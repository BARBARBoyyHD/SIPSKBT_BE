const supabase = require("../../model/db");
const jwt = require("jsonwebtoken");
exports.single = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(403).json({
      message: "Token required",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging
    req.user = decoded;

    const user_id = req.user.id; // Access `id` from the token payload
    // Validate validasi_id

    // Query the database
    const { data: validasiData, error: validasiDataError } = await supabase
      .from("riwayat_pengajuan")
      .select("*")
      .eq("user_id", user_id)
      .single() // Use maybeSingle() to handle zero or one row
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
