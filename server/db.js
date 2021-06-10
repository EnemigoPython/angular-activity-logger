const mysql = require('mysql');

const db = mysql.createConnection({
    host                : process.env.HOST || 'localhost',
    user                : 'root',
    password            : process.env.PASSWORD,
    database            : 'activitylogger',
    multipleStatements  : true
});

module.exports = db;