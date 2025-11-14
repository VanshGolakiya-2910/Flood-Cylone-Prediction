const express = require("express");
const router = express.Router();
const { getCyclone } = require("../controllers/cycloneController");
const { populateCycloneStates } = require("../utils/populateStates");

router.get("/", getCyclone);
router.post("/populate-states", async (req, res) => {
  try {
    await populateCycloneStates();
    res.json({ status: "success", message: "States populated for all cyclones" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;