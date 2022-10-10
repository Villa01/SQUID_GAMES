// Aqui se realiza la conexion con Rabbit
import amqp from 'amqplib/callback_api.js';

const host = process.env.HOST

export const Rabbit = (data) =>{
    amqp.connect(`amqp://guest:guest@${host}:5672/`, function(error0, connection) {
      if (error0) {
          throw error0;
      }
      connection.createChannel(function(error1, channel) {
          if (error1) {
              throw error1;
          }
          let queue = 'task_queue';
  
          channel.assertQueue(queue, {
              durable: true
          });
          channel.sendToQueue(queue, Buffer.from(data), {
              persistent: true
          });
          console.log("Datos enviados:", data);
      });
      setTimeout(function() {
          connection.close();
          // process.exit(0);
      }, 500);
  });
  }