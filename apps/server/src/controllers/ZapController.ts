import { CreateZapSchema } from "@repo/types";
import { Request, Response } from "express"
import { formatZodError } from "../helper";
import client from "@repo/db";

export const createZap = async (req: Request, res: Response): Promise<any> => {
    const body = req.body;
    const validation = CreateZapSchema.safeParse(body);
    // @ts-ignore
    const id: string = req.id;

    if(validation.error) { 
        return res.status(411).json({
            message: "Incorrect inputs",
            error: formatZodError(validation.error)
        })
    }

    const zapId = await client.$transaction(async tx => {
        const zap = await tx.zap.create({
            data: {
                userId: parseInt(id),
                triggerId: "",
                action: {
                    create: validation?.data?.actions.map((x, index) => ({
                        actionId: x.availableActionId,
                        sortingOrder: index,
                        metadata: x.actionMetaData
                    }))
                }
            }
        });

        const trigger = await tx.trigger.create({
            data: {
                triggerId: validation?.data?.availableTriggerId,
                zapId: zap.id,
            }
        });

        await tx.zap.update({
            where: {
                id: zap.id
            },
            data: {
                triggerId: trigger.id
            }
        });

        return zap.id;
    })

    return res.status(201).json({
        message: "Zap created successfully",
        data: {
            zapId
        }
    })

}

export const fetchZapList = async (req: Request, res: Response): Promise<any> => {
    // @ts-ignore
    const id = req.id;
    const zaps = await client.zap.findMany({
        where: {
            userId: id,
        },
        include: {
            action: true,
            trigger: true,
        }
    })

    return res.status(200).json({
        message: "Zaps fetched successsfully",
        data: {
            zaps,
            total: zaps.length
        }
    })
}

export const fetchZapWithId = async (req: Request, res: Response): Promise<any> => {
    // @ts-ignore
    const id = req.id;
    const zap = await client.zap.findFirst({
        where: {
            user: id
        },
        include: {
            action: true,
            trigger: true
        }
    });

    return res.status(200).json({
        message: "Zap fetched successfully",
        data: {
            zap
        }
    })
}
