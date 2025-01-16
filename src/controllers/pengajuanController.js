const supabase = require("../../model/db");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
// Define allowed MIME types
const allowedMimeTypes = [
  "image/png", // PNG images
  "image/jpeg", // JPEG images
  "image/gif", // GIF images
  "application/pdf", // PDF files
  "application/msword", // .doc files
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx files
];

// Function to check if the MIME type is allowed
function isAllowedMimeType(mimetype) {
  return allowedMimeTypes.includes(mimetype);
}

// Function to generate the public URL of a file
async function getFile(path) {
  const { data } = supabase.storage.from("user-file").getPublicUrl(path);
  return data.publicUrl || null;
}

exports.post = async (req, res) => {
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

    const { maksud_per, instansi_tujuan, noHpkepalaOPD } = req.body;
    const createdAt = moment().format("LL");

    // Log uploaded files for debugging
    console.log("Uploaded files:", req.files);

    // Validate required fields
    if (!user_id || !instansi_tujuan || !noHpkepalaOPD) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Upload files to Supabase Storage and get their URLs
    const fileUrls = {};

    for (const field of [
      "SPTSP",
      "SKCPNS",
      "SKPNS",
      "SKPT",
      "SPT",
      "SKPP",
      "SPTDP",
    ]) {
      if (req.files[field] && req.files[field][0]) {
        const file = req.files[field][0];

        // Validate MIME type
        if (!isAllowedMimeType(file.mimetype)) {
          return res
            .status(400)
            .json({ error: `File type for ${field} is not allowed.` });
        }

        // Validate file size (50 MB limit)
        const maxFileSize = 50 * 1024 * 1024; // 50 MB
        if (file.size > maxFileSize) {
          return res
            .status(400)
            .json({ error: `File size for ${field} exceeds the 50 MB limit.` });
        }

        const uniqueIdentifier = uuidv4(); // Generate a unique identifier
        const filePath = `4uelha_1/${user_id}/${field}_${uniqueIdentifier}_${file.originalname}`;

        // Upload the file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("user-file")
          .upload(filePath, file.buffer, {
            contentType: file.mimetype, // Set the content type dynamically
          });

        if (uploadError) {
          console.error(`Error uploading ${field}:`, uploadError.message);
          return res.status(400).json({ error: uploadError.message });
        }

        // Generate the public URL
        const fileUrl = await getFile(filePath);
        if (!fileUrl) {
          return res
            .status(400)
            .json({ error: `File URL for ${field} could not be generated.` });
        }

        fileUrls[field] = fileUrl;
      }
    }

    // Insert into `pengajuan` table
    const { data: pengajuanData, error: pengajuanError } = await supabase
      .from("pengajuan")
      .insert([
        {
          user_id,
          maksud_per: maksud_per,
          instansi_tujuan,
          noHpkepalaOPD,
          created_at: createdAt,
          SPTSP: fileUrls.SPTSP || null,
          SKCPNS: fileUrls.SKCPNS || null,
          SKPNS: fileUrls.SKPNS || null,
          SKPT: fileUrls.SKPT || null,
          SPT: fileUrls.SPT || null,
          SKPP: fileUrls.SKPP || null,
          SPTDP: fileUrls.SPTDP || null,
        },
      ])
      .select()
      .single();

    if (pengajuanError) {
      console.error("Error inserting into pengajuan:", pengajuanError.message);
      return res.status(400).json({ error: pengajuanError.message });
    }

    // Extract the pengajuan_id from the inserted record
    const { pengajuan_id } = pengajuanData;

    // Insert into `riwayat_pengajuan` table and retrieve the riwayat_id
    const { data: riwayatData, error: riwayatError } = await supabase
      .from("riwayat_pengajuan")
      .insert([
        {
          pengajuan_id,
          user_id,
          status: "proses",
          created_at: createdAt,
        },
      ])
      .select("riwayat_id") // Explicitly select the riwayat_id column
      .single(); // Assuming you expect a single record

    if (riwayatError) {
      console.error(
        "Error inserting into riwayat_pengajuan:",
        riwayatError.message
      );
      return res.status(400).json({ error: riwayatError.message });
    }

    // Extract the riwayat_id from the inserted record
    const { riwayat_id } = riwayatData;

    // Now insert into `riwayat_validasi` using the retrieved riwayat_id
    const { data: validasiData, error: validasiError } = await supabase
      .from("riwayat_validasi")
      .insert([
        {
          riwayat_id, // Use the riwayat_id from riwayat_pengajuan
          pengajuan_id,
          user_id,
          status:"proses",
          created_at: createdAt,
        },
      ]);

    if (validasiError) {
      console.error("Error inserting into riwayat_validasi:", validasiError.message);
      return res.status(400).json({ error: validasiError.message });
    }

    // Return success response
    res.status(201).json({
      message: "Pengajuan created successfully!",
      pengajuan: pengajuanData,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res
      .status(500)
      .json({ error: "An unexpected error occurred.", details: error.message });
  }
};
