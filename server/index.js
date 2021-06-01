const http = require('http');
const express = require('express');

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
