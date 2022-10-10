/**
 * 
 * @typedef {Object} register
 * @property {Number} idGame - Identificator of the game in the database
 * @property {Number} id - Identificator of the game globally
 * @property {String} name - Name of a game
 * @property {String} player1 - Name of the first player of a game
 * @property {String} player2 - Name of the second player of a game
 * @property {String} winner - Name of the winner player of a game
 */

/**
 * @typedef {Object} winner
 * @property {String} name - Name of the player
 * @property {Number} wins - number of wins of this player
 */

/**
 * Get the winners of each game and the number of games won. 
 * @param {register[]} registers - Array of registers

 * @returns {winner[]} array of winners with their wins
 */
module.exports = (registers) => {
    
    let players = {};
    
    registers.forEach(({ winner }) => {
        if (!players[winner]) {
            players[winner] = 1
        } else {
            players[winner] += 1;
        }
    });

    let top = Object.keys(players).map(key => {
        return {
            name: key,
            wins: players[key]
        }
    })
    top.sort((a, b) => {
        if (a.wins > b.wins) {
            return -1;
        }
        if (a.wins < b.wins) {
            return 1;
        }
        return 0;
    });
    return top;
}


