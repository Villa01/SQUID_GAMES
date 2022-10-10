# Squid Games Distributed System
Generic distributed architecture system that samples real-time statistics using Kubernetes and service mesh such as Linkerd and other Cloud Native technologies. A service mesh will be used to split the traffic. 

## Architecture
![image](https://user-images.githubusercontent.com/68957047/194927610-3bffa178-6df4-4a55-9814-ef67fb290b70.png)

## Go Traffic Generator
This application is written in Go, using Goroutines and channels. The syntax
of the CLI will be:
```
rungame --gamename "1 | Game1 ; 2 | Game2" --players 30 --rungames 30000 --concurrence 10 --timeout 3m
```
This is the functionality:
* __gamename__: has the description of the games, using the format GAME_NUMBER |
GAME_NAME
* __players__: number of players for each game
* __rungames__: number of times to run the games
* __concurrence__ : simultaneous request to the API to run the games
timeout If the remaining time is greater than this value, the command will stop.
### Example:
The functionality of the traffic generator is to generate endpoints during the time it is running defined by
the time. It is running defined by rungames or by the timeout. For example when running the following timeout.

```
rungame 
  --gamename "1 Random | 2 Roulette | 5 Last " 
  --players 30
  --rungames 30000 
  --concurrence 10 
  --timeout 3m 
```
The following would happen:
```
--gamename "1 Random | 2 Roulette | 5 Last" 
```
This part of the command means that I am going to use the game 1, 2 and 5 that I have implemented in the gRPC server.
```
--players 30
``` 
This part of the command means which is the maximum number of players I can have per game, in this example we could have up to 30 players. 
```
--rungames 30000
```
This means that a maximum of 30000 endpoints will be generated to be executed.
```
--concurrence 10

``` 
By means of the go routines it is going to have simultaneously 10 calls to the apis with the endpoints that are generated.
```
--timeout 3m
```
The traffic generator will run for 3 minutes and after these 3 minutes, it will stop.

### Endpoint generation:
To generate the endpoints we use the information of the command that was executed in the cli.
For this case we are going to use the games 1, 2 and 5 and a maximum of 30 players and a maximum of 30 players, so we could generate combinations such as.
the following:
```
193.60.11.13.nip.io/game/1/gamename/Random/players/12
193.60.11.13.nip.io/game/1/gamename/Random/players/25
193.60.11.13.nip.io/game/game/2/gamename/Ruleta/players/14
193.60.11.13.nip.io/game/1/gamename/Random/players/4 193.60.11.13.nip.io/game/1/gamename/Random/players/4
193.60.11.13.nip.io/game/5/gamename/Last/players/30
```
Once an endpoint is generated, a request is made to the server, and once the api receives the information using gRPC, this information is passed to the gRCP Server to execute the algorithm of the game and find the winner. The winner is found and once the game is finished the information is passed to the queue, either Kafka or RabbitMQ. Information is passed to the queue either Kafka, RabbitMQ to be consumed by the gRCP Worker. The Go Worker, which will be in charge of saving the information into the databases.
