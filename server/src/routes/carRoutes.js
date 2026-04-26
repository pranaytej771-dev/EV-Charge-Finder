import { Router } from "express";
import { getCarById, getCars } from "../controllers/carController.js";

const router = Router();

router.get("/", getCars);
router.get("/:id", getCarById);

export default router;
