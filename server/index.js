const http = require('http');
const express = require('express');
require('dotenv/config');
const { bootstrap, db } = require('./db');

const usersRoute = require('./routes/users');
const activitiesRoute = require('./routes/activities');

(async () => {
    await bootstrap();
    db.start();
})();

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
    console.log('get req');
    console.log(db.connection);
    if (!db.connection) {
        db.resetConnection();
    }
    res.sendFile('index.html', {root: distPath});
});

server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
