const express = require('express');
const db = require('../db');
const router = express.Router();

async function createAccount(details) {
    const result = db.query(
        `INSERT INTO users
        (username, password)
        VALUES
        (?, ?)`,
        [
            details.username,
            details.password
        ]
    );
    if (!result.affectedRows) throw new Error("Database error");
    return details;
}

router.get("/", async (req, res) => {
    try {
        res.json({xd: 'hi'});
    } catch (err) {
        res.json({ message: err });
    }
});

router.post("/", async (req, res) => {
    try {
        res.json(await createAccount(req.body));
    }
    catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;