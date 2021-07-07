const express = require('express');
const { db } = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');

function getID(account) {
    const result = new Promise((resolve, reject) => {
        db.query(
            `SELECT (userID)
            FROM users
            WHERE username = ?`,
            [
                account
            ], (err, res) => {
                if (!res) {
                    reject("NO_ACCOUNT");
                    return;
                }
                if (err) {
                    reject(err);
                } else {
                    resolve(res[0].userID);
                }
            }
        )
    });
    return result;
}

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
                    reject(err);
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
                    reject(err);
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

function getUserStats(id) {
    const dateRes = new Promise((resolve, reject) => {
        db.query(
            `SELECT 
                DATE_FORMAT(MIN(date), '%d/%m/%Y') AS joinDate, 
                (MAX(date) - MIN(date)) + 1 AS totalDays
            FROM activitydata 
            JOIN activities
            WHERE userID = ?`,
            [
                id
            ], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res[0]);
                }
            });
    });
    const countRes = new Promise((resolve, reject) => {
        db.query(
            `SELECT 
                COUNT(DISTINCT(dataID)) AS completed 
            FROM activitydata
            JOIN activities 
            WHERE state = 100 
            AND userID = ?`,
            [
                id
            ], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res[0]);
                }
            });
    });
    const totalRes = new Promise((resolve, reject) => {
        db.query(
            `SELECT 
                COUNT(DISTINCT(dataID)) AS totalReported 
            FROM activitydata
            JOIN activities 
            WHERE NOT state = 0 
            AND userID = ?`,
            [
                id
            ], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res[0]);
                }
            });
    });
    const result = Promise.all([dateRes, countRes, totalRes]);
    return result;
}

function deleteUser(id) {
    const result = new Promise((resolve, reject) => {
        db.query(
            `DELETE FROM users
            WHERE userID = ?`,
            [
                id
            ], (err, res) => {
                if (err) {
                    console.error(err.code);
                    reject(err);
                } else {
                    resolve(res);
                }
            }
        )
    });
    return result;
}

router.get("/id", async (req, res) => {
    try {
        res.json(await getID(req.query.user));
    } catch (err) {
        console.error(err.code);
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
        console.error(err.code);
        res.json({ 
            username: null, 
            error: err,
            id: 0 
        });
    }
});

router.get("/stats", async (req, res) => {
    try {
        const userStats = await getUserStats(req.query.id);
        newStats = userStats.reduce((i, total) => {
            return {...total, ...i};
        });
        const completePercent = Math.round((newStats.completed / newStats.totalReported) * 100);
        res.json({ 
            date: newStats.joinDate, 
            days: newStats.totalDays,
            completed: newStats.completed,
            percent: completePercent 
        });
    } catch (err) {
        res.json(err);
    }
});

router.delete("/", async (req, res) => {
    try {
        res.json(await deleteUser(req.body.id));
    } catch (err) {
        console.error(err.code);
        res.json({ error: err });
    }
});

module.exports = router;