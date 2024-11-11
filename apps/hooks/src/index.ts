import express, { Request, Response } from 'express';
import client from "@repo/db";

const app = express();

app.post("/hooks/:userId/:zapId", async (req: Request, res: Response) => {
    const { userId, zapId } = req.params;

    // Verify user using userId

    await client.$transaction(async tx => {
        const newZapRun = await tx.zapRun.create({
            data: {
                zapId: zapId as string,
                metadata: {}
            }
        })

        await tx.zapRunOutbox.create({
            data: {
                zapRunId: newZapRun.id
            }
        })
    })
})

app.listen(8000, () => {
    console.log("Hooks running on port 8000");
})