// backend/controllers/floodController.js
import Flood from "../models/Flood.js";

// Get all floods
export const getFloods = async (req, res) => {
  try {
    const floods = await Flood.find().sort({ riskLevel: -1 });
    res.json({ status: "success", data: floods });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
