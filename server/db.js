const mysql = require('mysql');

function bootstrap() {
    return new Promise(res => {
        const init = mysql.createConnection({
            host                : process.env.HOST || 'localhost',
            user                : 'root',
            password            : process.env.PASSWORD,
            multipleStatements  : true
        });
        
        const sql = 'CREATE DATABASE IF NOT EXISTS activitylogger;';
        init.query(sql, (err, _result) => {
            if (err) throw err;
            console.log("Checking database...");
        });
        init.end()
        res();
    });
}

const db = mysql.createConnection({
    host                : process.env.HOST || 'localhost',
    user                : 'root',
    password            : process.env.PASSWORD,
    database            : 'activitylogger',
    multipleStatements  : true
});

module.exports = { bootstrap, db };