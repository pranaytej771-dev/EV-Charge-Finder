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

router.use(verifyToken);
router.get("/search", searchNearestStations);
router.get("/", getStations);
router.post("/", isAdmin, createStation);
router.put("/:id", isAdmin, updateStation);
router.delete("/:id", isAdmin, deleteStation);

export default router;
