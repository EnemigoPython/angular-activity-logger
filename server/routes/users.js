const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        res.json({xd: 'hi'});
    } catch (err) {
        res.json({ message: err });
    }
});

router.post("/", async (req, res) => {
    try {
        res.json({});
    }
    catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;