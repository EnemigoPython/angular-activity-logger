const http = require('http');
const express = require('express');
require('dotenv/config');
const { bootstrap, db } = require('./db');

const usersRoute = require('./routes/users');
const activitiesRoute = require('./routes/activities');

(async () => {
    await bootstrap();
    startDB();
    checkOrCreateTables();
})();

function startDB() {
    db.connect((err) => {
        if (err) throw err;
        console.log('Database connected...');
    });
}

function checkOrCreateTables() {
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
        FOREIGN KEY (userID) REFERENCES users(userID));
    CREATE TABLE IF NOT EXISTS activitydata(
        dataID int AUTO_INCREMENT,
        activityID int NOT NULL,
        date date NOT NULL,
        state tinyint NOT NULL,
        notes VARCHAR(255),
        PRIMARY KEY (dataID),
        FOREIGN KEY (activityID) REFERENCES activities(activityID));`;
    db.query(sql, (err, _result) => {
        if (err) throw err;
        console.log("Checking tables...");
    });
}

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const cors = require('cors');

app.use(express.urlencoded({
    extended: true
}));

app.use(cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "DELETE"],
}));

app.use(express.json());

app.use('/users', usersRoute);
app.use('/activities', activitiesRoute);

app.get('/', (req, res) => {
    res.json({'Hello World': true});
    console.log('received');
});

server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
