const supabase = require("../../model/db");

exports.single = async (req, res) => {
  try {
    const { riwayat_id } = req.params;

    // Validate riwayat_id
    if (!riwayat_id) {
      return res.status(400).json({ message: "riwayat_id is required" });
    }

    // Query the database
    const { data: riwayatData, error: riwayatDataError } = await supabase
      .from("riwayat_pengajuan")
      .select("*")
      .eq("riwayat_id", riwayat_id)
       // Use maybeSingle() to handle zero or one row

    // Handle query errors
    if (riwayatDataError) {
      console.error("Supabase query error:", riwayatDataError.message);
      return res.status(500).json({ message: "Database query failed" });
    }

    // Handle no data found
    if (!riwayatData) {
      return res.status(404).json({ message: "Riwayat not found" });
    }

    // Return the data
    return res.status(200).json({
      message: "Your Riwayat Found",
      data: riwayatData,
    });
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
