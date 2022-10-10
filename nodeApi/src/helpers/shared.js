
const getPlayersArray = (players) => {
    let p = [];
    for (let index = 1; index <= players; index++) {
        p.push({ name: `${index}` })
    }

    return p;
}

const registersToGames = ( data ) => {
    data = data.map( (register) => registerToGame(register))

    return data;
}

const registerToGame = ( {id, players, game_name, winner, queue, date_game} ) => {
    return {
        name: game_name, 
        id, 
        players: getPlayersArray(players), 
        winner: `${winner}`,
        broker: queue,
        datetime: `${date_game}`
    }
}


module.exports = {
    getPlayersArray,
    registersToGames,
    registerToGame
}