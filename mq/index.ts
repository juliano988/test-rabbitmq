import amqp from "amqplib/callback_api";

let mqChannel: amqp.Channel;

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, ch) {
    if (error1) {
      throw error1;
    }
    mqChannel = ch;
    console.log("RabbitMQ channel created");
  });
});

export { mqChannel };
