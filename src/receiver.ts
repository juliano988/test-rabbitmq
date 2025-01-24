#!/usr/bin/env node

import { mqChannel } from "../mq";
import { parseArgs } from "util";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    queue: {
      type: "string",
      default: "test",
    },
    delayMs: {
      type: "string",
      default: "0",
    },
  },
  strict: true,
  allowPositionals: true,
});

console.log(
  'Listen the queue: "',
  values.queue,
  '" with delay: ',
  values.delayMs
);

// Implements a delay to wait for the RabbitMQ channel to be ready
do {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      if (!mqChannel) {
        console.log("Waiting for RabbitMQ channel...");
      }
      resolve();
    }, 1 * 1000);
  });
} while (!mqChannel);

// To precess one message at time
mqChannel.prefetch(1);

try {
  mqChannel.consume(
    values.queue,
    function (message) {
      // Simulate message processing delay
      setTimeout(() => {
        console.log(
          "Received message: ",
          message?.content.toString(),
          "time: ",
          new Date().toLocaleTimeString()
        );

        if (message) {
          // Acknowledge the message after processing
          mqChannel.ack(message);
        }
      }, Number(values.delayMs));
    },
    {
      noAck: false,
    },
    (err, ok) => {
      if (err) {
        console.error("Error consuming the queue: ", err);
      } else {
        console.log("Consuming the queue: ", ok.consumerTag);
      }
    }
  );
} catch (e) {
  console.error("Error consuming the queue: ", e);
}
