require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser")

const authUser = require("./src/middleware/authUser")
const csrfValidate = require("./src/middleware/csrfValidate")
const refresTokenvalidate = require("./src/middleware/refreshTokenValidate")

const upload = multer({
  storage: multer.memoryStorage(),
}).fields([
  { name: "SPTSP", maxCount: 1 }, // SPTSP file
  { name: "SKCPNS", maxCount: 1 }, // SKCPNS file
  { name: "SKPNS", maxCount: 1 }, // SKPNS file
  { name: "SKPT", maxCount: 1 }, // SKPT file
  { name: "SPT", maxCount: 1 }, // SPT file
  { name: "SKPP", maxCount: 1 }, // SKPP file
  { name: "SPTDP", maxCount: 1 }, // SPTDP file
]);
const allowedOrigins = ['https://sipskbt-sulsel.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
const validateSurat = multer({
  storage: multer.memoryStorage(), // Store the file in memory
}).single("surat_disetujui"); // Accept a single file with the field name "surat_disetujui"

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.json("API is running");
});
app.get("/api/v1/surat/pengajuan/:pengajuan_id",require("./src/routes/getSinglePengajuanRoutes"))
app.get("/api/v1/show/all/pengajuan",require("./src/routes/showPengajuanRoutes"))
app.get("/api/v1/show/all/riwayat/surat",require("./src/routes/AllRiwayatRoutes"))
app.get("/api/v1/get/surat/pengajuan/user",require("./src/routes/getUserPengajuanRoutes"))
app.get("/api/v1/single/riwayat/surat/:riwayat_id",require("./src/routes/getSingleRiwayatRoutes"))
app.get("/api/v1/surat/riwayat/:validasi_id",require("./src/routes/getSingleRiwayatValRoutes"))
app.get("/api/v1/get/surat/riwayat/val/user",require("./src/routes/getUserValRiwayatRoutes"))
app.get("/api/v2/show/all/riwayat/validasi",require("./src/routes/admin/showValAdminRoutes"))
app.get("/api/v1/get/user/info/JWT",require("./src/routes/getUserInfoJWTRoutes"))
app.get("/api/v1/get/surat/SKBT",require("./src/routes/getSingleValUserSKBTRoutes"))

app.post("/api/v1/register/user", require("./src/routes/registerUserRoutes"));
app.post("/api/v1/register/admin", require("./src/routes/adminRegisterRoutes"));
app.post(
  "/api/v1/post/pengajuan",
  upload,
  require("./src/routes/pengajuanRoutes")
);

app.post("/api/v1/login/user",require("./src/routes/loginUserRoutes"))
app.post("/api/v2/login/admin",require("./src/routes/adminLoginRoutes"))

app.put("/api/v1/validate/surat/:riwayat_id",validateSurat,require("./src/routes/adminValidateRoutes"));
app.put("/api/v1/validate/berkas/:validasi_id",require("./src/routes/updateRiwayatValidasiRoutes"))


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
