const express = require('express');
const { db } = require('../db');
const router = express.Router();

function getActivities(id) {
    const result = new Promise((resolve, reject) => {
        db.query(
            `SELECT activityname AS name, date, dataID AS id, state
            FROM activities
            JOIN activitydata ON
            activities.activityID = activitydata.activityID
            AND activities.userID = ?
            ORDER BY date`,
            [
                id
            ], (err, res) => {
                if (err) {
                    console.error(err);
                    reject(err.code);
                } else {
                    resolve(res);
                }
            }
        )
    });
    return result;
}

function createActivity(title) {
    const result = new Promise((resolve, reject) => {
        resolve();
    });
    return result;
}

router.get("/", async (req, res) => {
    try {
        res.json(await getActivities(req.query.id));
    } catch (err) {
        console.error(err);
        res.json({ error: err });
    }
});

router.post("/", async (req, res) => {
    try {
        res.json(await createActivity(req.body));
    } catch (err) {
        console.error(err);
        res.json({ error: err });
    }
});

module.exports = router;