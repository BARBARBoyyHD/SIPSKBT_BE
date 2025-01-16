const express = require("express");
const Router = express.Router();
const getUserPengajuan = require("../controllers/getUserPengajuan");

Router.get("/api/v1/get/surat/pengajuan/user",getUserPengajuan.get)

module.exports = Router