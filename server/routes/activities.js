const express = require('express');
const { db } = require('../db');
const router = express.Router();

function getActivities(id) {
    const result = new Promise((resolve, reject) => {
        db.connection.query(
            `SELECT activityname AS name, DATE_FORMAT(date, '%d/%m/%Y') AS activityDate, dataID AS id, state
            FROM activities
            JOIN activitydata ON
            activities.activityID = activitydata.activityID
            AND activities.userID = ?
            ORDER BY date`,
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

function createActivity(data) {
    const result = new Promise((resolve, reject) => {
        db.connection.query(
            `INSERT INTO activities
            (userID, activityname)
            VALUES (?, ?)`,
            [
                data.id, data.name
            ], (err, res) => {
                if (err) {
                    console.error(err.code);
                    reject(err);
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
            db.connection.query(
                `INSERT INTO activitydata
                (activityID, date, state, notes)
                VALUES (?, subdate(current_date(), ?), 0, NULL)`,
                [
                    id, i
                ], (err, res) => {
                    if (err) {
                        console.error(err.code);
                        reject(err);
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

function getActivityID(data) {
    const result = new Promise((resolve, reject) => {
        db.connection.query(
            `SELECT activityID
            FROM activities 
            WHERE activityname = ?
            AND userID = ?`,
            [
                data.name,
                data.id
            ], (err, res) => {
                if (err) {
                    console.error(err.code);
                    reject(err);
                } else {
                    resolve(res[0].activityID);
                }
            }
        )
    });
    return result;
}

async function deleteActivity(data) {
    const activityID = await getActivityID(data);
    const result = new Promise((resolve, reject) => {
        db.connection.query(
            `DELETE FROM activities
            WHERE activityID = ?`,
            [
                activityID
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

function getDateRemovedFromCurrent(days) {
    const dateRef = new Date();
    dateRef.setDate(dateRef.getDate() - days);
    return dateRef
    .toLocaleString('en-GB', {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

function getActivity(id) {
    const result = new Promise((resolve, reject) => {
        db.connection.query(
            `SELECT state, notes
            FROM activitydata
            WHERE dataID = ?`,
            [
                id
            ], (err, res) => {
                if (err) {
                    console.error(err.code);
                    reject(err);
                } else {
                    resolve(res[0]);
                }
            }
        )
    });
    return result;
}

function updateActivity(data) {
    const result = new Promise((resolve, reject) => {
        db.connection.query(
            `UPDATE activitydata
            SET state = ?, notes = ?
            WHERE dataID = ?`,
            [
                data.state, data.notes, data.id
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

router.get("/", async (req, res) => {
    try {
        res.json(await getActivities(req.query.id));
    } catch (err) {
        console.error(err.code);
        res.json({ error: err });
    }
});

router.post("/", async (req, res) => {
    try {
        const activityID = await createActivity(req.body);
        const numberOfDates = req.body.numberOfDates;
        res.json(await createActivityDataIndices(activityID, numberOfDates));
    } catch (err) {
        console.error(err.code);
        res.json({ error: err });
    }
});

router.delete("/", async (req, res) => {
    try {
        res.json(await deleteActivity(req.body));
    } catch (err) {
        console.error(err.code);
        res.json({ error: err });
    }
});

router.post("/dates", async (req, res) => {
    try {
        const dataIndices = [];
        const userID = req.body.id;
        const activityData = await getActivities(userID);
        const activityNames = new Set(activityData.map(activity => activity.name));
        for (const name of activityNames) {
            const activityID = await getActivityID({ name, id: userID });
            const dataIDs = await createActivityDataIndices(activityID, req.body.dates);
            dataIDs.forEach((id, i) => {
                dataIndices.push({
                    name,
                    activityDate: getDateRemovedFromCurrent(i),
                    id,
                    state: 0
                });
            });
        }
        // dataIndices are created newest to oldest but need to be displayed oldest to newest
        res.json(dataIndices.reverse());
    } catch (err) {
        console.error(err.code);
        res.json({ error: err });
    }
});

router.get("/id", async (req, res) => {
    try {
        res.json(await getActivity(req.query.id));
    } catch (err) {
        console.error(err.code);
        res.json({ error: err });
    }
});

router.put("/id", async (req, res) => {
    try {
        res.json(await updateActivity(req.body));
    } catch (err) {
        console.error(err.code);
        res.json({ error: err });
    }
});

module.exports = router;