import { CreateZapSchema } from "@repo/types";
import { Request, Response } from "express"
import { formatZodError } from "../helper";
import client from "@repo/db";

export const createZap = async (req: Request, res: Response): Promise<any> => {
    try {
        const body = req.body;
        console.log(body)
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
                    actions: {
                        create: validation?.data?.actions.map((x, index) => ({
                            actionId: x.availableActionId as string,
                            sortingOrder: index + 1,
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
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Failed to create a zap!",
            error: error
        })
    }
}

export const fetchZapList = async (req: Request, res: Response): Promise<any> => {
    // @ts-ignore
    const id = req.id;
    const zaps = await client.zap.findMany({
        where: {
            userId: id,
        },
        include: {
            actions: {
                include: {
                    action: true
                }
            },
            trigger: {
                include: {
                    trigger: true
                }
            },
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
            user: id,
            id: req.params.zapId
        },
        include: {
            actions: {
                include: {
                    action: true
                }
            },
            trigger: {
                include: {
                    trigger: true
                }
            }
        }
    });

    return res.status(200).json({
        message: "Zap fetched successfully",
        zap
    })
}

export const deleteZapWithId = async (req: Request, res: Response): Promise<any> => {
    try {
        // @ts-ignore
        const id = req.id;
        const zap = await client.$transaction(async tx => {
            await tx.trigger.delete({
                where: {
                    zapId: req.params.zapId
                }
            })

            await tx.action.deleteMany({
                where: {
                    zapId: req.params.zapId
                }
            })

            return await tx.zap.delete({
                where: {
                    id: req.params.zapId,
                    userId: id
                }
            })
        })

        return res.status(202).json({
            message: "Zap deleted successfully",
            deletedZap: zap
        })
    } catch(error: any) {
        console.log(error)
        res.status(401).json({
            message: "Could not delete the zap, Please try again",
            error: error.response
        })
    }
}

export const updateZapWithId = async (req: Request, res: Response): Promise<any> => {
    try {
        // @ts-ignore
        const id = req.id;
        const body = req.body;

        const zap = await client.zap.update({
            where: {
                userId: id,
                id: req.params.zapId
            }, 
            data: {
                name: body.name
            }
        })

        return res.status(201).json({
            message: "Zap updated successfully",
            updatedZap: zap
        })
    } catch(error: any) {
        res.status(401).json({
            message: "Could not update the zap, please try again",
            error: error.response
        })
    }
}
