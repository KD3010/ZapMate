import express from "express";
import { AuthRouter } from "./AuthRoutes";
import { ZapRouter } from "./ZapRoutes";
import { TriggerRouter } from "./TriggerRoutes";
import { ActionsRouter } from "./ActionsRouter";

const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/zaps", ZapRouter);
router.use("/triggers", TriggerRouter);
router.use("/actions", ActionsRouter);

export default router;
