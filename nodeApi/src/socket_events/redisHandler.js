const { getJSON, getPlayer } = require("../database/redis");
const getWinners = require('../helpers/topPlayers')

module.exports = (io, socket) => {

    const last10Games = async () => {
        let result = [];
        try {

            let r = await getJSON('games');
            if ( r ) {
                result = r.slice(-10)
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            socket.emit('redis:last', result);
        }

    }

    const topPlayers = async () => {
        let top = [];
        try {
            let r = await getJSON('games');
            if (r) {
                top = getWinners(r);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            socket.emit('redis:top', top);
        }
    }

    const gameByPlayer = async ({player = ''}) => {
        const currentPlayer = await getPlayer(player);
        socket.emit('redis:player', currentPlayer);
    }

    socket.on('redis:last', last10Games)
    socket.on('redis:top', topPlayers)
    socket.on('redis:player', gameByPlayer)
}
