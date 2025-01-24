# test-rabbitmq

To install dependencies:

```bash
bun install
```

To run:

```bash
docker compose up
bun run start
bun run start:receiver
```

To access management portal:

[Management portal](http://127.0.0.1:15672)

- user: guest
- password: guest

To fire a message:

```bash
curl --location --request POST 'localhost:3000/send_message' \
--header 'Content-Type: application/json' \
--header 'Cache-Control: no-cache' \
--header 'Accept: */*' \
--header 'Accept-Encoding: gzip,deflate' \
--header 'Connection: keep-alive' \
--data-raw '{
  "queue": "test",
  "message": "Mensagem de teste!"
}'
```

This project was created using `bun init` in bun v1.1.43. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
