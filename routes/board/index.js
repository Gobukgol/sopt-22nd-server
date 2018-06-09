var express = require('express');
var router = express.Router();

router.use('/board','./board.js');

module.exports = router