const express = require("express");
const Router = express.Router();
const showPengajuanController = require("../controllers/showPengajuanController");

Router.get("/api/v1/show/all/pengajuan",showPengajuanController.selectAll)

module.exports = Router