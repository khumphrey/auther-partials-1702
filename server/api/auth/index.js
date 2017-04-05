const router = require('express').Router();

router.use('/me', require('./me'));

module.exports = router;
