const express = require("express");
const router = express.Router();
const { getFloods } = require("../controllers/floodController");
const { populateFloodStates } = require("../utils/populateStates");

router.get("/", getFloods);
router.post("/populate-states", async (req, res) => {
  try {
    await populateFloodStates();
    res.json({ status: "success", message: "States populated for all floods" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;