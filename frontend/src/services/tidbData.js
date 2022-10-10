
import { connect } from 'socket.io-client';


const url = process.env.REDIS_URL;

const getLast10 = () => {
    return new Promise((resolve) => {
        const socket = connect(url);
        socket.emit('tidb:last');
        socket.on('tidb:last10', data => {
            socket.disconnect();
            resolve(data);
        });
    });
}

const getTopPlayers = () => {
    return new Promise((resolve) => {

        const socket = connect(url);
        socket.emit('tidb:top');
        socket.on('tidb:top', data => {
            socket.disconnect();
            resolve(data);
        });
    });
}

const getPlayer = (player) => {
    return new Promise((resolve) => {

        const socket = connect(url);
        socket.emit('tidb:player', { player });
        socket.on('tidb:player', data => {

            socket.disconnect();
            resolve(data);
        })
    });
}


export {
    getLast10,
    getTopPlayers,
    getPlayer
}