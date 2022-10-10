const { getLastN, getAll, getGameByPlayer } = require("../database/tidb");
const getWinners = require('../helpers/topPlayers')
const {registersToGames, registerToGame} = require('../helpers/shared');


module.exports = (io, socket) => {

    const last10Games = async () => {
        let result = [];
        try {
            let data = await getLastN(10);
            result = registersToGames(data);
        } catch (error) {
            console.error(error);
        } finally {
            socket.emit('tidb:last10', result);
        }
    }

    const topPlayers = async () => {
        let top = [];
        try {
            let r = await getAll();
            if( r ) {
                top = getWinners(r);
            }      
        } catch( error ) {
            console.error(error.message);
        } finally {
            socket.emit('tidb:top', top);
        }
    }

    const playerInfo = async({player}) => {
        let game = {};
        try {

            register = await getGameByPlayer(player);
            game = registerToGame(register);

        } catch( error ) {
            console.error(error.message);
        } finally {
            socket.emit('tidb:player', game);
        }
    }

    socket.on('tidb:last', last10Games)
    socket.on('tidb:top', topPlayers)
    socket.on('tidb:player', playerInfo)
}