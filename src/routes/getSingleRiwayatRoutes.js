const express = require("express");
const Router = express.Router();
const getSingleRiwayatController = require("../controllers/getSingleRiwayatController");

Router.get("/api/v1/single/riwayat/surat/:riwayat_id",getSingleRiwayatController.single)

module.exports = Router