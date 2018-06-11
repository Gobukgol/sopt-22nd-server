var express = require('express');
var router = express.Router();

router.get('/sign',require('./sign/index.js'))
router.get('/board',require('./board/index.js'))
router.get('/comment',require('./comment/index.js'))
router.get('/bookmark',require('./bookmark/index.js'))

module.exports = router;
