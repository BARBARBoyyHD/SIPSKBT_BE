const express = require("express");
const Router = express.Router();
const adminValidationController = require("../controllers/adminValidationController");

Router.put("/api/v1/validate/surat/:riwayat_id",adminValidationController.validate)

module.exports = Router