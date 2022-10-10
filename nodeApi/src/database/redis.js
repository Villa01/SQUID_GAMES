
const { Client } = require('redis-om')


const url = process.env.REDIS_URL;

const redisClient = new Client();

const createRedisClient = async () => {
    console.log('Creating redis client')
    await redisClient.open(url);
}

const getJSON = async (key) => {

    if (!redisClient.isOpen()) {
        await createRedisClient();
    }
    try {
        let resp = await redisClient.execute(['GET', key]);
        let data = JSON.parse(resp);
        return data;
    } catch (error) {
        return [];
    } finally {
        await redisClient.close();
    }
}

const getPlayer = async (player) => {

    let result = await getJSON('games');

    // Not getting data from db
    if( !result ) return {};
    
    // Not getting any result of the searching
    if (result.length < 1) return {};

    // Get the games where the player has played. 
    let games = result.filter(({players}) => {
        return players.some( p => p.name === player)
    });

    // Any matching game
    if ( games.length < 1) return {};

    return games.slice(-1)[0];

}

module.exports = {
    createRedisClient,
    getJSON,
    getPlayer
}