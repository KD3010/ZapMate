import kafka from "@repo/kafka";
import client from "@repo/db";
const TOPIC_NAME = "zap-events"

async function main() {
    // Creating consumer and subscribing to the zap-events topic created by transaction processor service
    const consumer = kafka.consumer({ groupId: "worker" });
    await consumer.connect();

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true});

    await consumer.run({
        // AutoCommit fetches the message from kafka and marks directly it to be processed, which we don't want
        // Only mark zap processed if the entire zap actions have been performed, or else do not remove it from kafka
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
                            actions: true
                        }
                    }
                }
            });

            const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage);

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