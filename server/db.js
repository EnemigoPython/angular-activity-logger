const mysql = require('mysql');

function bootstrap() {
    // this code might be problematic in prod and causing admin issues - don't run it in prod
    if (process.env.HOST) return;
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
    database            : process.env.DATABASE || 'activitylogger',
    multipleStatements  : true
});

module.exports = { bootstrap, db };