const express = require("express");
const Router = express.Router();
const showValAdminController = require("../../controllers/admin/showValAdminController");

Router.get("/api/v2/show/all/riwayat/validasi",showValAdminController.selectAll)

module.exports = Router