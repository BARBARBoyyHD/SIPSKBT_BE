const express = require("express");
const Router = express.Router();
const getSingleValUserSKBT = require("../controllers/getSingleValUserSKBT");

Router.get("/api/v1/get/surat/SKBT",getSingleValUserSKBT.single)

module.exports = Router