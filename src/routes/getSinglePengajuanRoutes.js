const express = require("express");
const Router = express.Router();
const getSinglePengajuanController = require("../controllers/getSinglePengajuanController");

Router.get("/api/v1/surat/pengajuan/:pengajuan_id",getSinglePengajuanController.single)

module.exports = Router