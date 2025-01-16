const supabase = require("../../model/db");

exports.single = async (req, res) => {
  try {
    const { validasi_id } = req.params;

    // Validate validasi_id
    if (!validasi_id) {
      return res.status(400).json({ message: "validasi_id is required" });
    }

    // Query the database
    const { data: validasiData, error: validasiDataError } = await supabase
      .from("riwayat_validasi")
      .select("*")
      .eq("validasi_id", validasi_id)
      .single(); // Use maybeSingle() to handle zero or one row

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
