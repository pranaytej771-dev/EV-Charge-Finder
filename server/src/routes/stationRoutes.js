import { Router } from "express";
import {
  createStation,
  deleteStation,
  getStations,
  searchNearestStations,
  updateStation
} from "../controllers/stationController.js";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/search", searchNearestStations);
router.get("/", getStations);
router.post("/", verifyToken, isAdmin, createStation);
router.put("/:id", verifyToken, isAdmin, updateStation);
router.delete("/:id", verifyToken, isAdmin, deleteStation);

export default router;
