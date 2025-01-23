#!/usr/bin/env node
import { mqChannel } from "../mq";
import type { EnvelopeObject } from "./types";

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/send_message" && request.method === "POST") {
      try {
        const body: EnvelopeObject<string> = await request?.json();

        if (!body.queue || !body.message) {
          return new Response("Envelope without queue or message", {
            status: 400,
          });
        }

        mqChannel.assertQueue(body.queue, {
          durable: false,
        });
        mqChannel.sendToQueue(body.queue, Buffer.from(body.message));

        return new Response("Message sent!");
      } catch (e) {
        return new Response(`Error sending message: ${e}`, { status: 500 });
      }
    }

    return new Response("Welcome to Bun!");
  },
});

console.log(`Listening on localhost:${server.port}`);
