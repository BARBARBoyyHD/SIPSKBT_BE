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

    if (!user_id) {
      console.error("User ID is undefined");
      return res.status(400).json({ message: "User ID is missing or invalid" });
    }

    const { data: userSuratPengajuan, error: userSuratError } = await supabase
      .from("riwayat_pengajuan")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false }) // Assuming "created_at" is the timestamp column
      .limit(1);

    if (userSuratError) {
      console.error("Supabase query error:", userSuratError.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!userSuratPengajuan) {
      return res.status(404).json({ message: "Data not found" });
    }

    return res.status(200).json({
      message: "Data Found",
      user_id: user_id,
      data: userSuratPengajuan || null,
    });
  } catch (error) {
    console.error("Auth User Middleware Error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
