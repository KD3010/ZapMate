import type { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as unknown as string;

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        // @ts-ignore
        req.id = payload.id;
        next();
    } catch(e) {
        res.status(403).json({
            message: "You are not logged in"
        })
        return;
    }
}