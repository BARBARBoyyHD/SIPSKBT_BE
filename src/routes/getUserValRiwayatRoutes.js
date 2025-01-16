const express = require("express");
const Router = express.Router();
const getUserValRiwayatController = require("../controllers/getUserValRiwayatController");

Router.get("/api/v1/get/surat/riwayat/val/user",getUserValRiwayatController.get)

module.exports = Router