package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

type Juego struct {
	Game_id int `json:"game_id"`
	Players int `json:"players"`
}

type Comando struct {
	games       map[string]string
	players     string
	rungames    string
	concurrence string
	timeout     string
}

func nombre(namegame string) map[string]string {

	juegos := strings.Split(namegame, ";")
	var ids map[string]string
	ids = make(map[string]string)
	for _, id := range juegos {
		i := strings.Split(id, "|")
		a := i[0]
		name := i[1]

		ids[a] = name
	}
	return ids
}

func analizador() Comando {
	fmt.Println("Generador de Trafico con Go")
	// args := os.Args[0:]
	var args = [12]string{"a", "rungame", "--namegame", "1 | Game1", "--players", "30", "--rungames", "300000", "--concurrence", "100", "--timeout", "0.2m"}

	var entrada Comando

	if args[1] == "rungame" {
		for a := 2; a < len(args); a = a + 2 {
			if args[a] == "--namegame" {
				a := args[a+1]
				b := strings.Replace(a, " ", "", -1)
				nombres := nombre(b)
				entrada.games = nombres
				// fmt.Println(nombres)
			} else if args[a] == "--players" {
				players := args[a+1]
				entrada.players = players
				// fmt.Println(players)
			} else if args[a] == "--rungames" {
				roungs := args[a+1]
				entrada.rungames = roungs
				// fmt.Println(roungs)
			} else if args[a] == "--concurrence" {
				concurrence := args[a+1]
				entrada.concurrence = concurrence
				// fmt.Println(concurrence)
			} else if args[a] == "--timeout" {
				timeout := args[a+1]
				entrada.timeout = timeout
				// fmt.Println(timeout)
			} else {
				fmt.Println("Se ha proporcionado un comando incorrecto, intentalo de nuevo")
			}
		}
	} else {
		fmt.Printf("Se ha proporcionado un comando incorrecto, intentelo de nuevo")
	}
	fmt.Println(entrada)
	return entrada
	// rungame --namegame "1 | Game1 ; 2 | Game 2" --players 30 --rungames 30 --concurrence 10 --timeout 3m
}
func main() {

	// ch := make(chan string)

	comando := analizador()

	wg := &sync.WaitGroup{}
	m := &sync.RWMutex{}
	// wg2 := &sync.WaitGroup{}

	concurrence, err := strconv.Atoi(comando.concurrence)

	if err != nil {
		fmt.Printf("No se puede convertir este numero")
	}

	rungames, err := strconv.Atoi(comando.rungames)
	clone := rungames
	if err != nil {
		fmt.Printf("No se puede convertir este numero")
	}

	minutes := strings.TrimRight(comando.timeout, "m")

	fmt.Println("Tiempo: ", minutes)
	minutes_int, err := strconv.ParseFloat(minutes, 64)
	if err != nil {
		fmt.Printf("No se puede convertir este numero")
	}
	minutes_int *= 60
	fmt.Println("Tiempo: (sec)", minutes_int)

	timeinit := time.Now().Add(time.Second * time.Duration(minutes_int))

	for key := range comando.games {
		for rungames > 0 {
			timefin := time.Now()
			if timeinit.After(timefin) {
				wg.Add(concurrence)
				// wg2.Add(concurrence)
				go showGoroutine(key, comando.players, wg, m)
				// go showGoroutine2(key, comando.players, wg2)
			} else {
				fmt.Println("Tiempo 1: ", timeinit)
				fmt.Println("Tiempo 2: ", timefin)
				fmt.Print("Timeout alcanzado, qchau")
				os.Exit(3)
			}
			rungames--
			// fmt.Println(rungames)
		}
		rungames = clone
	}

	wg.Wait()
	// wg2.Wait()
}

func showGoroutine(id_juego string, jugadores string, wg *sync.WaitGroup, m *sync.RWMutex) {

	//clienteHttp := &http.Client{}
	m.RLock()
	id_juego2, err := strconv.Atoi(id_juego)
	if err != nil {
		fmt.Printf("Error al convertir")
	}

	jugadores2, err := strconv.Atoi(jugadores)
	if err != nil {
		fmt.Printf("Error al convertir")
	}

	juego := Juego{
		Game_id: id_juego2,
		Players: jugadores2,
	}

	juegoComoJson, err := json.Marshal(juego)

	if err != nil {
		fmt.Printf("Error en : %v", err)
	}

	// fmt.Println("Datos a enviar a rabbit:", bytes.NewBuffer(juegoComoJson))

	//ruta 1
	clienteHttp2 := &http.Client{}
	url2 := "http://localhost:3000/Jugar" // Esto me lo debe de pasar Deivid

	peticion2, err := http.NewRequest("POST", url2, bytes.NewBuffer(juegoComoJson))
	if err != nil {
		fmt.Printf("Error en el POST a : %v", err)

	}
	peticion2.Header.Add("Content-Type", "application/json")
	respuesta2, err := clienteHttp2.Do(peticion2)

	if err != nil {
		fmt.Printf("Error en : %v", err)
	}
	defer respuesta2.Body.Close()
	m.RUnlock()

	time.Sleep(400 * time.Millisecond)
	wg.Done()
}

func showGoroutine2(id_juego string, jugadores string, wg *sync.WaitGroup) {

	//clienteHttp := &http.Client{}
	id_juego2, err := strconv.Atoi(id_juego)
	if err != nil {
		fmt.Printf("Error al convertir")
	}

	jugadores2, err := strconv.Atoi(jugadores)
	if err != nil {
		fmt.Printf("Error al convertir")
	}

	juego := Juego{
		Game_id: id_juego2,
		Players: jugadores2,
	}

	juegoComoJson, err := json.Marshal(juego)
	if err != nil {
		// Maneja el error de acuerdo a tu situación
		fmt.Printf("Error codificando usuario como JSON: %v", err)
	}

	// fmt.Println("Datos a enviar a kafka:", bytes.NewBuffer(juegoComoJson))

	//ruta 2
	clienteHttp2 := &http.Client{}
	url2 := "http://kafka.34.121.30.144.nip.io/juego"

	peticion2, err := http.NewRequest("POST", url2, bytes.NewBuffer(juegoComoJson))
	if err != nil {
		// Maneja el error de acuerdo a tu situación
		fmt.Printf("Error creando petición: %v", err)

	}

	// Podemos agregar encabezados
	peticion2.Header.Add("Content-Type", "application/json")
	respuesta2, err2 := clienteHttp2.Do(peticion2)

	if err2 != nil {
		// Maneja el error de acuerdo a tu situación
		fmt.Printf("Error haciendo petición: %v", err2)
	}
	// No olvides cerrar el cuerpo al terminar

	defer respuesta2.Body.Close()

	time.Sleep(time.Millisecond)
	wg.Done()
}
