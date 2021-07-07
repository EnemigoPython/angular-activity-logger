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
        if (err) {
            if (!err.code === 'PROTOCOL_CONNECTION_LOST') throw err;
            setTimeout(startDB, 2000);
        }
        console.log('Database connected...');
    });

    db.on('error', (err) => {
        if (!err.code === 'PROTOCOL_CONNECTION_LOST') throw err;
        setTimeout(startDB, 2000);
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
    db.query(sql, (err, _result) => {
        if (err) throw err;
        console.log("Checking tables...");
    });
}

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const path = require('path');

app.use(express.urlencoded({
    extended: true
}));

const distPath = path.join(__dirname, '..', '/client/dist/client');
app.use(express.static(distPath));

app.use(cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "DELETE", "PUT"]
}));

app.use(express.json());

app.use('/users', usersRoute);
app.use('/activities', activitiesRoute);

app.get('/*', (req, res) => {
    res.sendFile('index.html', {root: distPath});
});

server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
