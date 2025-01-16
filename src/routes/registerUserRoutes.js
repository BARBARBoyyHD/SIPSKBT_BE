const express = require("express");
const Router = express.Router();
const registerController = require("../controllers/registerUserController");

Router.post("/api/v1/register/user",registerController.register)

module.exports = Router