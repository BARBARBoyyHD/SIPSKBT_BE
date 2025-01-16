const express = require("express");
const Router = express.Router();
const updateRiwayatValidasi = require("../controllers/updateRiwayatValidasi");

Router.put("/api/v1/validate/berkas/:validasi_id",updateRiwayatValidasi.put)

module.exports = Router