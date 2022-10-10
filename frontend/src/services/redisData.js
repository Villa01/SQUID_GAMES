
import { connect } from 'socket.io-client';


const url = process.env.REDIS_URL;

// const url = 'http://localhost:5000/'
const getLast10 = () => {
    return new Promise((resolve) => {

        const socket = connect(url);
        socket.emit('redis:last');
        socket.on('redis:last', data => {
            socket.disconnect();
            resolve(data);
        });
    });
}

const getTopPlayers = () => {
    return new Promise((resolve) => {

        const socket = connect(url);
        socket.emit('redis:top');
        socket.on('redis:top', data => {
            socket.disconnect();
            resolve(data);
        });
    });
}

const getPlayer = (player) => {
    return new Promise((resolve) => {

        const socket = connect(url);
        socket.emit('redis:player', { player });
        socket.on('redis:player', data => {
            console.log(data)
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