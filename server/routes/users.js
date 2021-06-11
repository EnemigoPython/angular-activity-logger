const express = require('express');
const { db } = require('../db');
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
        ], (err, res) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return { message: err.code }
                }
            } else {
                return details;
            };
        });
    return details;
}

router.get("/", async (req, res) => {
    try {
        res.json({xd: 'hi'});
    } catch (err) {
        console.error(err);
        res.json({ message: err });
    }
});

router.post("/", async (req, res) => {
    try {
        res.json(await createAccount(req.body));
    }
    catch (err) {
        console.error(err);
        res.json({ message: err });
    }
});

module.exports = router;