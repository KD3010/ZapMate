import { Router } from "express";
import { ZapController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = Router();

router.post("/", authMiddleware, ZapController.createZap)
router.get("/", authMiddleware, ZapController.fetchZapList)
router.get("/:zapId", authMiddleware, ZapController.fetchZapWithId)

export { router as ZapRouter }
