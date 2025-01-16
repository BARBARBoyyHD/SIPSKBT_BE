const supabase = require("../../../model/db")

exports.selectAll = async(req,res)=>{
    try {
        const { data, error } = await supabase
        .from("riwayat_validasi")
        .select("*")
        .eq("status", "proses");
        // If there's an error, return it to the client
        if (error) {
          console.error("Error fetching data:", error.message);
          return res.status(400).json({ error: error.message });
        }
    
        // If no data is found, return an empty array
        if (!data || data.length === 0) {
          return res.status(200).json({ message: "No data found.", data: [] });
        }
    
        // Return the fetched data to the client
        res.status(200).json({
          message: "Data fetched successfully!",
          data: data,
        });
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error Bro !"
        })
    }
}