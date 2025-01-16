const express = require("express");
const Router = express.Router();
const adminLoginController = require("../controllers/adminLoginController");

Router.post("/api/v2/login/admin",adminLoginController.login)

module.exports = Router