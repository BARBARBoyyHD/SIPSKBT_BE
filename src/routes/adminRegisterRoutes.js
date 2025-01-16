const express = require("express");
const Router = express.Router();
const adminRegistController = require("../controllers/adminRegistController");

Router.post("/api/v1/register/admin",adminRegistController.register)

module.exports = Router