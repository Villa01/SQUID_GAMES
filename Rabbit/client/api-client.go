package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/Pallinder/go-randomdata"
	"github.com/gorilla/mux"
	pb "github.com/racarlosdavid/demo-gRPC/services"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type GameJson struct {
	Game_id int32 `json:"game_id"`
	Players int32 `json:"players"`
}

func Inicio(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hola mundo de Golan!\nEstoy desde api-client.go"))
}

var nombre_api = "default"

func Jugar(w http.ResponseWriter, r *http.Request) {

	// VARIABLE CONTENEDOR
	var Juego GameJson

	// Captura del Host
	host := os.Getenv("HOST")

	// ASIGNACION DE VALORES
	err := json.NewDecoder(r.Body).Decode(&Juego)
	if err != nil {
		log.Fatalf("No se puede leer la informacion ingresada %v", err)
	}

	log.Print("Mensaje recibido:", Juego)

	// CONEXION CON EL SERVIDOR GRPC DE NODE JS
	// 34.67.51.63
	conn, err := grpc.Dial(host+":50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewJuegosClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	reply, err := c.Jugar(ctx, &pb.JuegosRequest{
		Gameid:  Juego.Game_id,
		Players: Juego.Players,
	})
	if err != nil {
		log.Fatalf("No se puede ingresar la informacion: %v", err)
	}

	// RESPUESTA DEL SERVIDOR

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	log.Print("Si llega aqui :3")

	var res = "Respuesta del server " + strconv.Itoa(int(reply.GetGameid()))

	json.NewEncoder(w).Encode(struct {
		Mensaje string `json: "mensaje"`
		Server  string `json:"server"`
	}{Mensaje: res, Server: nombre_api})

}

func main() {
	nombre_api = randomdata.SillyName()
	router := mux.NewRouter().StrictSlash(false)
	router.HandleFunc("/", Inicio)
	router.HandleFunc("/Jugar", Jugar)
	log.Println("Listening at port 8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
