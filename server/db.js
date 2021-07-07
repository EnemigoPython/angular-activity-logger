const mysql = require('mysql');

function bootstrap() {
    return new Promise((resolve, reject) => {
        const init = mysql.createConnection({
            host                : process.env.HOST || 'localhost',
            user                : process.env.USER || 'root',
            password            : process.env.PASSWORD
        });
        
        const sql = 'CREATE DATABASE IF NOT EXISTS activitylogger;';
        init.query(sql, (err, _result) => {
            if (err) reject(err);
            console.log("Checking database...");
            resolve();
        });
        init.end();
    });
}

const db = mysql.createConnection({
    host                : process.env.HOST || 'localhost',
    user                : process.env.USER || 'root',
    password            : process.env.PASSWORD,
    database            : 'activitylogger',
    multipleStatements  : true
});

module.exports = { bootstrap, db };