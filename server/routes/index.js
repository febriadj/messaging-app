const router = require('express').Router();
// routes
const user = require('./user');

router.use(user);

module.exports = router;
