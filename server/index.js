const http = require('http');
const express = require('express');
const mysql = require('mysql');
require('dotenv/config');

const usersRoute = require('./routes/users');

const db = mysql.createConnection({
    host                : process.env.HOST || 'localhost',
    user                : 'root',
    password            : process.env.PASSWORD,
    database            : 'activitylogger',
    multipleStatements  : true
});

function checkOrCreateDb() {
    const sql = 'CREATE DATABASE IF NOT EXISTS activitylogger;';
    db.query(sql, (err, _result) => {
        if (err) throw err;
        console.log("Checking database...");
    });
}

function checkOrCreateTables() {
    const sql = 
    `CREATE TABLE IF NOT EXISTS users(
        userID int AUTO_INCREMENT, 
        username VARCHAR(255) NOT NULL, 
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (userID));
    CREATE TABLE IF NOT EXISTS tasks(
        taskID int AUTO_INCREMENT, 
        userID int NOT NULL, 
        taskname VARCHAR(255) NOT NULL,
        PRIMARY KEY (taskID),
        FOREIGN KEY (userID) REFERENCES users(userID));
    CREATE TABLE IF NOT EXISTS taskdata(
        dataID int AUTO_INCREMENT,
        taskID int NOT NULL,
        date datetime NOT NULL,
        state tinyint NOT NULL,
        notes VARCHAR(255),
        PRIMARY KEY (dataID),
        FOREIGN KEY (taskID) REFERENCES tasks(taskID));`;
    db.query(sql, (err, _result) => {
        if (err) throw err;
    });
    console.log("Checking tables...");
}

db.connect((err) => {
    if (err) throw err;
    checkOrCreateDb();
    checkOrCreateTables();
    console.log('Database connected...');
});

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const cors = require('cors');

app.use('/users', usersRoute);
app.use(express.urlencoded({
    extended: true
}));
app.use(cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true
}));

app.get('/', (req, res) => {
    res.json({'Hello World': true});
    console.log('received')
});

server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
