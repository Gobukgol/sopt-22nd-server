var express = require('express')
var router = express.Router()

router.use('/bookmark',require('./bookmark.js'))

module.exports = router