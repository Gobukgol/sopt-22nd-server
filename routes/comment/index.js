var express = require('express')
var router = express.Router()

router.use('/list',require('./list.js'))
router.use('/',require('./comment.js'))

module.exports = router