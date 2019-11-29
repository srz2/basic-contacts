const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('Path: ' + __dirname + '/index.html');
    res.sendFile(__dirname + '/index.html')
;});

module.exports = router;
