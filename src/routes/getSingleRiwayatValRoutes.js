const express = require("express");
const Router = express.Router();
const getSingleRiwayatValController = require("../controllers/getSingleRiwayatValController");

Router.get("/api/v1/surat/riwayat/:validasi_id",getSingleRiwayatValController.single)

module.exports = Router