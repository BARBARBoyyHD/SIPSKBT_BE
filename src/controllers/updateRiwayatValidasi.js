const supabase = require("../../model/db");
const jwt = require("jsonwebtoken");

exports.put = async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    console.error("from authuser : No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging
    req.user = decoded;

    const admin_id = req.user.id; // Access `id` from the token payload
    const nama_admin = req.user.full_name;

    // Parse and validate validasi_id
    console.log("req.params.validasi_id (raw):", req.params.validasi_id); // Debugging
    const validasi_id = parseInt(req.params.validasi_id, 10);
    console.log("validasi_id (parsed):", validasi_id); // Debugging

    if (isNaN(validasi_id)) {
      return res.status(400).json({ error: "Invalid validasi_id." });
    }

    const { status, ver_Adfo, val_kasuadum, val_sekre, perse_inspek } = req.body;

    // Debugging: Log request data
    console.log("validasi_id:", validasi_id);
    console.log("status:", status);
    console.log("ver_Adfo:", ver_Adfo);
    console.log("val_kasuadum:", val_kasuadum);
    console.log("val_sekre:", val_sekre);
    console.log("perse_inspek:", perse_inspek);

    // Check for required fields
    if (!validasi_id || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update riwayat_validasi
    const { data: riwayatData, error: riwayatError } = await supabase
      .from("riwayat_validasi")
      .update({
        nama_admin,
        status: status,
        ver_Adfo: ver_Adfo,
        val_kasuadum: val_kasuadum,
        val_sekre: val_sekre,
        perse_inspek: perse_inspek,
      })
      .eq("validasi_id", validasi_id)
      .select()
      .single();

    // Handle Supabase error
    if (riwayatError) {
      console.error("Error updating riwayat_validasi:", riwayatError);
      return res.status(500).json({ message: "Failed to update riwayat_validasi" });
    }

    // Success response
    return res.status(200).json({ message: "Update successful", data: riwayatData });

  } catch (error) {
    // Handle JWT errors
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    // Handle other errors
    console.error("Internal Server Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};