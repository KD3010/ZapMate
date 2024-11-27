import client from "@repo/db";
import type { Request, Response } from "express";

export const fetchAvailableTriggers = async (req: Request, res: Response): Promise<any> => {
    const avialableTriggers = await client.availableTriggers.findMany();

    return res.status(200).json({
        message: "Fetched available triggers",
        avialableTriggers
    })
}