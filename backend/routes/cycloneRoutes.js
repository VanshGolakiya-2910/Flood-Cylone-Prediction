const express = require("express");
const router = express.Router();
const { getCyclone } = require("../controllers/cycloneController");

router.get("/", getCyclone);

module.exports = router;