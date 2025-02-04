import amqp from "amqplib/callback_api";

let mqChannel: amqp.Channel;
let connection: amqp.Connection;

function connect() {
  amqp.connect("amqp://localhost", function (error0, conn) {
    if (error0) {
      console.error("Failed to connect to RabbitMQ", error0);
      setTimeout(connect, 5 * 1000); // Tenta reconectar após 5 segundos
      return;
    }
    connection = conn;

    connection.on("error", function (err) {
      console.error("RabbitMQ connection error", err);
      setTimeout(connect, 5 * 1000); // Tenta reconectar após 5 segundos
    });

    connection.on("close", function () {
      console.error("RabbitMQ connection closed");
      setTimeout(connect, 5 * 1000); // Tenta reconectar após 5 segundos
    });

    connection.createChannel(function (error1, ch) {
      if (error1) {
        console.error("Failed to create RabbitMQ channel", error1);
        setTimeout(connect, 5 * 1000); // Tenta reconectar após 5 segundos
        return;
      }

      mqChannel = ch;

      mqChannel.on("error", function (err) {
        console.error("RabbitMQ channel error", err);
      });

      mqChannel.on("close", function () {
        console.error("RabbitMQ channel closed");
        setTimeout(connect, 5 * 1000); // Tenta reconectar após 5 segundos
      });

      console.log("RabbitMQ channel created");
    });
  });
}

connect();

export { mqChannel };
