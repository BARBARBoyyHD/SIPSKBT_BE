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
    req.user = decoded
    const user_id = req.user.id

    const {data:usersData,error} = await supabase
    .from("users_data")
    .select("username_NIP,email,nama_lengkap,pangkatGol,jabatan,prngkt_daerah,noHpWa,foto_profile")
    .eq("user_id",user_id)
    .single()

    return res.status(200).json({
        message:"Your Info Found",
        data:usersData
    })

  } catch (error) {
    return res.status(500).json({ message: "COBA CEK SERVER NYA BRO !" });
  }
};
