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

class Database {
    connection = mysql.createConnection({
        host                : process.env.HOST || 'localhost',
        user                : process.env.USER || 'root',
        password            : process.env.PASSWORD,
        database            : process.env.DATABASE || 'activitylogger',
        multipleStatements  : true
    });

    start() {
        this.connection.connect((err) => {
            if (err) {
                if (!err.code === 'PROTOCOL_CONNECTION_LOST') throw err;
            }
            console.log('Database connected...');
            this.checkOrCreateTables();
        });
    
        this.connection.on('error', (err) => {
            if (!err.code === 'PROTOCOL_CONNECTION_LOST') throw err;
            this.connection.destroy();
            this.resetConnection();
            setTimeout(this.start, 2000);
        });
    }

    checkOrCreateTables() {
        const sql = 
        `CREATE TABLE IF NOT EXISTS users(
            userID int AUTO_INCREMENT, 
            username VARCHAR(255) NOT NULL UNIQUE, 
            password VARCHAR(255) NOT NULL,
            PRIMARY KEY (userID));
        CREATE TABLE IF NOT EXISTS activities(
            activityID int AUTO_INCREMENT, 
            userID int NOT NULL, 
            activityname VARCHAR(255) NOT NULL,
            PRIMARY KEY (activityID),
            FOREIGN KEY (userID) REFERENCES users(userID)
            ON DELETE CASCADE);
        CREATE TABLE IF NOT EXISTS activitydata(
            dataID int AUTO_INCREMENT,
            activityID int NOT NULL,
            date date NOT NULL,
            state tinyint NOT NULL,
            notes VARCHAR(255),
            PRIMARY KEY (dataID),
            FOREIGN KEY (activityID) REFERENCES activities(activityID)
            ON DELETE CASCADE);`;
        this.connection.query(sql, (err, _result) => {
            if (err) throw err;
            console.log("Checking tables...");
        });
    }

    resetConnection() {
        console.log('Resetting connection...')
        this.connection = mysql.createConnection({
            host                : process.env.HOST || 'localhost',
            user                : process.env.USER || 'root',
            password            : process.env.PASSWORD,
            database            : process.env.DATABASE || 'activitylogger',
            multipleStatements  : true
        });
    }
}

const db = new Database();

module.exports = { bootstrap, db };