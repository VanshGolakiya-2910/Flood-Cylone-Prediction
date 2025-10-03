const express = require("express");
const router = express.Router();
const { getFloods } = require("../controllers/floodController");

router.get("/", getFloods);


module.exports = router;