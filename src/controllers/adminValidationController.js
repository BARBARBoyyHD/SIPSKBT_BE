const supabase = require("../../model/db");
const moment = require("moment");
const jwt = require("jsonwebtoken");
// Function to generate the public URL of a file
async function getFile(path) {
  const { data } = supabase.storage.from("user-file").getPublicUrl(path);
  return data.publicUrl || null;
}

exports.validate = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    console.error("from authuser : No token provided");
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging
    req.user = decoded;

    const admin_id = req.user.id;
    // Extract riwayat_id from the URL and convert it to a number
    const riwayat_id = parseInt(req.params.riwayat_id, 10);
    if (isNaN(riwayat_id)) {
      return res.status(400).json({ error: "Invalid riwayat_id." });
    }

    // Extract fields from the request body
    const { nama_admin, status } = req.body;

    // Convert admin_id to a number
    

    // Log uploaded file and other fields for debugging
    console.log("riwayat_id:", riwayat_id);
    
    console.log("nama_admin:", nama_admin);
    console.log("status:", status);
    console.log("Uploaded file:", req.file);

    // Validate required fields
    if (!admin_id || !status) {
      return res.status(400).json({ error: "All fields are required." });
    }

  

    const file = req.file;
    const filePath = `4uelha_1/surat_disetujui/${riwayat_id}/${file.originalname}`; // Include 4uelha_1 folder

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("user-file")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError.message);
      return res.status(400).json({ error: uploadError.message });
    }

    // Generate the public URL
    const fileUrl = await getFile(filePath);
    if (!fileUrl) {
      return res
        .status(400)
        .json({ error: "File URL could not be generated." });
    }

    // Update the record in the database
    const { data: updatedData, error: updateError } = await supabase
      .from("riwayat_pengajuan") // Replace with your table name
      .update({
        status: status,
        admin_id: admin_id, // Use the converted admin_id
        nama_admin: nama_admin,
        surat_disetujui: fileUrl, // Update the `surat_disetujui` field with the file URL
      })
      .eq("riwayat_id", riwayat_id) // Match the record by riwayat_id
      .select()
      .single();

    if (updateError) {
      console.error("Error updating record:", updateError.message);
      return res.status(400).json({ error: updateError.message });
    }

    // Return success response
    res.status(200).json({
      message: "Surat disetujui updated successfully!",
      data: updatedData,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res
      .status(500)
      .json({ error: "An unexpected error occurred.", details: error.message });
  }
};
