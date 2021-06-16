const express = require('express');
const { db } = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');

function createAccount(details) {
    const passHash = bcrypt.hashSync(details.password, 10);
    const result = new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO users
            (username, password)
            VALUES
            (?, ?)`,
            [
                details.username,
                passHash
            ], (err, res) => {
                if (err) {
                    reject(err.code);
                } else {
                    resolve({ 
                        username: details.username, 
                        error: null,
                        id: res.insertId 
                    });
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
            [
                details.username
            ], (err, res) => {
                if (err) {
                    reject(err.code);
                } else {
                    if (res.length < 1) {
                        reject('NO_ACC');
                    } else {
                        if (bcrypt.compareSync(details.password, res[0].password)) {
                            resolve({ 
                                username: details.username, 
                                error: null,
                                id: res[0].userID 
                            });
                        } else {
                            reject('PASS_INCORRECT');
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
        res.json({ 
            username: null, 
            error: err,
            id: 0 
        });
    }
});

module.exports = router;