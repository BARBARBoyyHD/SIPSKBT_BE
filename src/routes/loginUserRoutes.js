const express = require("express");
const Router = express.Router();
const loginUserController = require("../controllers/loginUserController");

Router.post("/api/v1/login/user",loginUserController.login)

module.exports = Router