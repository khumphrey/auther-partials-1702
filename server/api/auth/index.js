const router = require('express').Router();

router.use('/me', require('./me'));

router.use('/google', require('./google'));

module.exports = router;
