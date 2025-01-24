#!/usr/bin/env node
import { mqChannel } from "../mq";
import type { EnvelopeObject } from "./types";

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/send_message" && request.method === "POST") {
      try {
        const { queue, message }: EnvelopeObject<string> =
          await request?.json();

        if (!queue || !message) {
          return new Response("Envelope without queue or message", {
            status: 400,
          });
        }

        mqChannel.assertQueue(queue, {
          durable: false,
        });
        mqChannel.sendToQueue(queue, Buffer.from(message));

        return new Response("Message sent!");
      } catch (e) {
        return new Response(`Error sending message: ${e}`, { status: 500 });
      }
    }

    return new Response("Welcome to Bun!");
  },
});

console.log(`Listening on localhost:${server.port}`);
