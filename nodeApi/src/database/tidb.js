

let mysql = require('mysql');

const pool = mysql.createPool({  
    connectionLimit : 10,
    host: process.env.TIDB_IP,
    port: process.env.TIDB_PORT,
    database: process.env.TIDB_DATABASE,
    user: process.env.TIDB_USER,
    password: ''
});


const getLastN = (n) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM dataGame order by date_game DESC LIMIT ?;', [n], (err, results) => {
            if( err ) {
                console.error(err)
                return reject(err);
            }
            return resolve(results);
        });
    });
    
}

const getAll = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM dataGame;', (err, results) => {
            if( err ) {
                console.error(err)
                return reject(err);
            }
            return resolve(results);
        });
    });
    
}

const getGameByPlayer = (player) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM dataGame 
        WHERE players >= ?
        order BY date_game 
        DESC LIMIT 1;`
        pool.query(query, [player] , (err, results) => {
            if( err ) {
                console.error(err)
                return reject(err);
            }
            if(results.length < 1) {
                return resolve({})
            }
            return resolve(results[0]);
        });
    });
    
}


module.exports = {
    pool,
    getLastN,
    getAll,
    getGameByPlayer
}