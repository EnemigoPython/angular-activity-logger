const express = require('express');
const { db } = require('../db');
const router = express.Router();

function getCurrentDataUK() {

}

function getActivities(id) {
    const result = new Promise((resolve, reject) => {
        db.query(
            `SELECT activityname AS name, DATE_FORMAT(date, '%d-%m-%Y') AS date, dataID AS id, state
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

function createActivity(data) {
    const result = new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO activities
            (userID, activityname)
            VALUES (?, ?)`,
            [
                data.id, data.name
            ], (err, res) => {
                if (err) {
                    console.error(err);
                    reject(err.code);
                } else {
                    resolve(res.insertId);
                }
            }
        )
    });
    return result;
}

async function createActivityDataIndices(id, dates) {
    dataIDs = [];
    for (let i = 0; i < dates; i++) {
        const newID = new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO activitydata
                (activityID, date, state, notes)
                VALUES (?, current_date() - ?, 0, NULL)`,
                [
                    id, i
                ], (err, res) => {
                    if (err) {
                        console.error(err);
                        reject(err.code);
                    } else {
                        resolve(res.insertId);
                    }
                }
            )
        });
        dataIDs.push(await newID);
    }
    return dataIDs;
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
        const activityID = await createActivity(req.body);
        const numberOfDates = req.body.numberOfDates;
        res.json(await createActivityDataIndices(activityID, numberOfDates));
    } catch (err) {
        console.error(err);
        res.json({ error: err });
    }
});

module.exports = router;