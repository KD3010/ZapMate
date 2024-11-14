import { Router } from "express";
import { authMiddleware } from "../middlewares";
import { fetchAvailableTriggers } from "../controllers/TriggerController";

const router = Router();

router.get("/trigger", authMiddleware, fetchAvailableTriggers);

export const TriggerRouter = router;