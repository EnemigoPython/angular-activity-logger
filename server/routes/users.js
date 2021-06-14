const express = require('express');
const { db } = require('../db');
const router = express.Router();

function createAccount(details) {
    const result = new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO users
            (username, password)
            VALUES
            (?, ?)`,
            [
                details.username,
                details.password
            ], (err) => {
                if (err) {
                    reject(err.code);
                } else {
                    resolve({ username: details.username, error: null });
                }
            });
    });
    return result;
}

function attemptLogin(details) {
    const result = new Promise((resolve, reject) => {
        db.query(
            `SELECT *
            FROM users
            WHERE username = ?`,
            [details.username], (err, res) => {
                if (err) {
                    reject(err.code);
                } else {
                    if (res.length < 1) {
                        reject('NO_ACC');
                    } else {
                        if (res[0].password !== details.password) {
                            reject('PASS_INCORRECT');
                        } else {
                            resolve({ username: details.username, error: null });
                        }
                    }
                }
            });
    });
    return result;
}

router.get("/", async (req, res) => {
    try {
        res.json({ xd: 'hi' });
    } catch (err) {
        console.error(err);
        res.json({ error: err });
    }
});

router.post("/", async (req, res) => {
    try {
        if (req.body.newAccount) {
            res.json(await createAccount(req.body));
        } else {
            res.json(await attemptLogin(req.body));
        }
    } catch (err) {
        console.error(err);
        res.json({ username: null, error: err });
    }
});

module.exports = router;