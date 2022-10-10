import { Rabbit } from './conf/rabbit.js';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import {Juego1, Juego2, Juego3, Juego4, Juego5} from './games/games.js'
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let ruta = path.join(__dirname, "services", "demo.proto");

let packageDefinition = protoLoader.loadSync(
    ruta,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

let demo_proto = grpc.loadPackageDefinition(packageDefinition).proto;


const Jugar = (call, callback)=>
{
  const {gameid, players} = call.request
  console.log('Mensaje recibido: ', call.request)
  let data = {gameid: gameid, players: players, gamename: '', winner: '', queue:"RabbitMQ"}
  data.winner = 0
  data.gamename = "Juego"
  switch (gameid) {
    case 1:
      data.winner = Juego1(players)
      data.gamename = 'Juego 1'
      break;
    case 2:
      data.winner = Juego2(players)
      data.gamename = 'Juego 2'
      break;
    case 3:
      data.winner = Juego3(players)
      data.gamename = 'Juego 3'
      break;
    case 4:
      data.winner = Juego4(players)
      data.gamename = 'Juego 4'
      break;
    case 5:
      data.winner = Juego5(players)
      data.gamename = 'Juego 5'
      break;
  }

  console.log('Si llega hasta aqui')
  let json = JSON.stringify(data)
  
  console.log(json)
  callback(null, {gameid:'El ganador del juego'  + gameid + ' ha sido el jugador ' + data.winner})
  Rabbit(json)
}

function main() {
  let server = new grpc.Server();
  server.addService(demo_proto.Juegos.service, {Jugar, Rabbit});
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('Servidor en el puerto 50051')
  });
}

main();