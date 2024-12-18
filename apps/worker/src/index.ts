import kafka from "@repo/kafka";
import client from "@repo/db";
const TOPIC_NAME = "zap-events";
import { sendEmailWithTextBody } from "@repo/email";

async function main() {
    // Creating consumer and subscribing to the zap-events topic created by transaction processor service
    const consumer = kafka.consumer({ groupId: "worker" });
    await consumer.connect();

    const producer = kafka.producer();
    await producer.connect();

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: false});

    await consumer.run({
        // AutoCommit fetches the message from kafka and marks directly it to be processed, which we don't want
        // Only mark zap processed if the entire zap actions have been performed, or else do not remove it from kafka
        autoCommit: false,
        eachMessage: async ({topic, partition, message}) => {
            if(!message?.value?.toString())
                return;

            const { zapRunId, stage } = JSON.parse(message?.value?.toString());

            const zapRunDetails = await client.zapRun.findFirst({
                where: {
                    id: zapRunId
                },
                include: {
                    zap: {
                        include: {
                            actions: {
                                include: {
                                    action: true
                                }
                            }
                        }
                    }
                }
            });

            const lastStage = zapRunDetails?.zap?.actions?.length || 1;
            const currentAction = zapRunDetails?.zap?.actions?.find(a => a.sortingOrder === stage)

            if(!currentAction) {
                console.log("Current Action not found")
                return;
            }

            // Send Email Logic
            if(currentAction?.action?.type === "Email") {
                console.log("Sending Email")
                console.log(currentAction?.metadata, zapRunDetails?.metadata)
                // @ts-ignore
                sendEmailWithTextBody(zapRunDetails?.metadata?.email, currentAction?.metadata?.subject, currentAction?.metadata?.body)
            }

            // Send Solana Logic
            if(currentAction?.action?.type === "Solana") {
                console.log("Sending Solana")
            }

            if(stage !== lastStage) {
                console.log("Pushing back to the kafka");
                producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                        value: JSON.stringify({zapRunId: zapRunId, stage: stage+1})
                    }]
                })
            }

            console.log("Action execution successfull");
            await consumer.commitOffsets([{
                topic: topic,
                partition: partition,
                offset: (parseInt(message.offset) + 1).toString()
            }])
        }
    })
}

main();