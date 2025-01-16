const supabase = require("../../model/db");

exports.single = async (req, res) => {
  try {
    const { pengajuan_id } = req.params;

    const { data:pengajuanData, error } = await supabase
      .from("pengajuan")
      .select("*")
      .eq("pengajuan_id", pengajuan_id)
      .single();
    // If there's an error, return it to the client
    if (!pengajuanData || pengajuanData.length === 0) {
      return res.status(200).json({ message: "No data found.", data: [] });
    }
    if (error) {
      console.error("Error fetching data:", error.message);
      return res.status(400).json({ error: error.message });
    }

    const user_id = pengajuanData.user_id
 
    const {data:userData,error:userDataError} = await supabase
    .from("users_data")
    .select("username_NIP,email,nama_lengkap,pangkatGol,jabatan,prngkt_daerah,noHpWa")
    .eq("user_id",user_id)
    .single()
    // If no data is found, return an empty array
  

    // Return the fetched data to the client
    res.status(200).json({
      message: "Data fetched successfully!",
      data: pengajuanData,
      user_info : userData
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error Bro !",
    });
  }
};
