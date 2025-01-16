const express = require("express");
const Router = express.Router();
const getUserInfoJWTController = require("../controllers/getUserInfoJWTController");

Router.get("/api/v1/get/user/info/JWT",getUserInfoJWTController.get)

module.exports = Router