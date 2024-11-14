import express from "express";
import { AuthRouter } from "./AuthRoutes";
import { ZapRouter } from "./ZapRoutes";

const router = express.Router();
router.use("/auth", AuthRouter);
router.use("/zap", ZapRouter);

export default router;
