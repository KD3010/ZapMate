import client from "@repo/db";
import type { Response, Request } from "express";

export const fetchAvailableActions = async (req: Request, res: Response):Promise<any> => {
    const availableActions = await client.availableActions.findMany();

    return res.status(200).json({
        message: "Fetched available actions",
        availableActions
    })
}