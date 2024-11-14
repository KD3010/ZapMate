import kafka from "@repo/kafka";
import client from "@repo/db";
const TOPIC_NAME = "zap-events"

async function main() {
    const consumer = kafka.consumer({ groupId: "worker" });
    await consumer.connect();

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true});

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({topic, partition, message}) => {
            if(!message.value?.toString()) {
                return;
            }

            const parsedValue = JSON.parse(message.value?.toString());
            const zapRunId = parsedValue.zapRunId;
            const stage = parsedValue.stage;

            const zapRunDetails = await client.zapRun.findFirst({
                where: {
                    id: zapRunId
                },
                include: {
                    zap: {
                        include: {
                            action: true
                        }
                    }
                }
            });

            const currentAction = zapRunDetails?.zap.action.find(x => x.sortingOrder === stage);

            if(!currentAction) {
                console.log("Current Action not found!");
                return;
            }

            // Perform the current action

            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition: partition,
                offset: (parseInt(message.offset) + 1).toString()
            }])
        }
    })
}

main();