import kafka from "@repo/kafka";
import client from "@repo/db";

async function main() {
    const producer = kafka.producer();

    await producer.connect();

    while(1) {
        const pendingRows = await client.zapRunOutbox.findMany({
            where: {
                zapRun: {
                    zap: {
                        isActive: true
                    }
                }
            },
            take: 10
        });

        pendingRows.forEach(r => {
            producer.send({
                topic: "zap-events",
                messages: pendingRows.map(r => ({
                    value: r.zapRunId
                }))
            })
        });

        await client.zapRunOutbox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map(r => r.id)
                }
            }
        })
    }
}

main();