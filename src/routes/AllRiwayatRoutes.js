const express = require("express");
const Router = express.Router();
const allRiwayatController = require("../controllers/allRiwayatController");

Router.get("/api/v1/show/all/riwayat/surat",allRiwayatController.selectAll)

module.exports = Router