const express = require("express");
const Router = express.Router();
const pengajuanController = require("../controllers/pengajuanController");

Router.post("/api/v1/post/pengajuan",pengajuanController.post)

module.exports = Router