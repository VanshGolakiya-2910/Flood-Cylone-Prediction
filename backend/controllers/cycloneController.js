// backend/controllers/cycloneController.js
import Cyclone from "../models/Cyclone.js";

// Get latest cyclone
export const getCyclone = async (req, res) => {
  try {
    const cyclone = await Cyclone.findOne().sort({ updatedAt: -1 });
    if (!cyclone) {
      return res.status(404).json({ status: "error", message: "No cyclone data found" });
    }
    res.json({ status: "success", data: cyclone });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
