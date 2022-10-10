// docker run -d -p 27017:27017 --name mongodb -v "/database/:/data/db" -e MONGO_HOST=db -e MONGO_USERNAME=root -e MONGO_PASSWORD=password  mongo
// docker run -it -d --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.9-management
package main

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gomodule/redigo/redis"
	amqp "github.com/rabbitmq/amqp091-go"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type GameJson struct {
	Gameid   int32  `json:gameid`
	Players  int32  `json:players`
	Gamename string `json:gamename`
	Winner   int32  `json:winner`
	Queue    string `json:queue`
	Datetime string
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

func GetCollection(collection string) *mongo.Collection {
	URI := os.Getenv("MONGO_URI")
	client, err := mongo.NewClient(options.Client().ApplyURI(URI))
	if err != nil {
		panic(err.Error())
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		panic(err.Error())
	}
	
	databaseName := os.Getenv("DATABASE_NAME")
	return client.Database(databaseName).Collection(collection)
}

func createLogs(data GameJson) {
	// (*w).Header().Set("Acces-Control-Allow-Origin", "*")
	colName := os.Getenv("COLLECTION_NAME")
	var coleccion = GetCollection(colName)

	coleccion.InsertOne(context.Background(), data)
}

func newPool() *redis.Pool {
	
	redisUrl := os.Getenv("REDIS_URL")
	return &redis.Pool{
		MaxIdle:   80,
		MaxActive: 12000,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp",redisUrl)
			if err != nil {
				fmt.Println(err.Error())
			}
			return c, err
		},
	}
}

type Games []Game

func UnmarshalGames(data []byte) (Games, error) {
	var r Games
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Games) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type Game struct {
	Name     string   `json:"name"`
	ID       int64    `json:"id"`
	Players  []Player `json:"players"`
	Winner   string   `json:"winner"`
	Broker   string   `json:"broker"`
	Datetime string   `json:"datetime"`
}

type Player struct {
	Name string `json:"name"`
}

var pool = newPool()

func Redis(data GameJson) {

	var plys []Player
	for i := 1; i <= int(data.Players); i++ {
		plys = append(plys, Player{Name: strconv.Itoa(int(i))})
	}

	juego := Game{
		Name:     data.Gamename,
		ID:       int64(data.Gameid),
		Players:  plys,
		Winner:   strconv.Itoa(int(data.Winner)),
		Broker:   data.Queue,
		Datetime: time.Now().Format("2006-01-02 15:04:05"),
	}

	client := pool.Get()
	defer client.Close()

	value, err := redis.String(client.Do("GET", "games"))
	if err != nil {
		juegos := Games{}
		juegos = append(juegos, juego)
		texto, _ := juegos.Marshal()
		client.Do("SET", "games", texto)
	} else {
		juegos, _ := UnmarshalGames([]byte(value))
		juegos = append(juegos, juego)
		texto, _ := juegos.Marshal()
		client.Do("SET", "games", texto)

	}

	data2, err := client.Do("GET", "games")
	if err != nil {
		fmt.Println(err.Error())
	}

	fmt.Printf("%s \n", data2)
}

type Result struct {
	Game_id   int32  `json:"gameid"`
	Players   int32  `json:"players"`
	Game_name string `json:"gamename"`
	Winner    int32  `json:"winner"`
	Queue     string `json:"queue"`
	Date_game string
}

func obtenerBaseDeDatos() (db *sql.DB, e error) {
	tidbUrl := os.Getenv("TIDB_URL")
	// Debe tener la forma usuario:contraseña@host/nombreBaseDeDatos
	db, err := sql.Open("mysql",tidbUrl)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func Insertar(r Result) (e error) {

	r.Date_game = time.Now().Format("2006-01-02 15:04:05")

	db, err := obtenerBaseDeDatos()
	if err != nil {
		return err
	}
	defer db.Close()

	// Preparamos para prevenir inyecciones SQL
	sentenciaPreparada, err := db.Prepare("INSERT INTO dataGame (game_id, players, game_name, winner, queue, date_game) VALUES(?, ?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer sentenciaPreparada.Close()
	// Ejecutar sentencia, un valor por cada '?'
	_, err = sentenciaPreparada.Exec(r.Game_id, r.Players, r.Game_name, r.Winner, r.Queue, r.Date_game)
	if err != nil {
		return err
	}
	log.Printf("Se ha Guardado en Ti-db")
	return nil
}

func main() {

	host := os.Getenv("HOST")
	conn, err := amqp.Dial("amqp://guest:guest@" + host + ":5672/")
	failOnError(err, "Error, no se puede conectar a RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Error, no se puede abrir el canal")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"task_queue", // name
		true,         // durable
		false,        // delete when unused
		false,        // exclusive
		false,        // no-wait
		nil,          // arguments
	)
	failOnError(err, "Fallo al declarar una cola")

	err = ch.Qos(
		1,     // prefetch count
		0,     // prefetch size
		false, // global
	)
	failOnError(err, "Fallo al setear QoS")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		false,  // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Fallo al registrar")

	var forever chan struct{}

	go func() {
		for d := range msgs {
			log.Printf("Mensaje recibido: %s", d.Body)
			var u = string(d.Body)
			log.Print("Parseado: ", u)

			// VARIABLE CONTENEDOR
			var Juego GameJson

			json.Unmarshal([]byte(d.Body), &Juego)

			Juego.Datetime = time.Now().Format("2006-01-02 15:04:05")

			log.Print("Parseado 2: ", Juego)

			var r Result
			err := json.Unmarshal([]byte(d.Body), &r)
			if err != nil {
				log.Fatalf("Error occured during unmarshaling. Error: %s", err.Error())
			}

			// log.Print("Tipo Json: ", Juego)
			createLogs(Juego)
			Redis(Juego)
			Insertar(r)

			dotCount := bytes.Count(d.Body, []byte("."))
			t := time.Duration(dotCount)
			time.Sleep(t * time.Second)
			log.Printf("Listo")
			d.Ack(false)
		}
	}()

	log.Printf("Esperando mensajes... ")
	<-forever
}
