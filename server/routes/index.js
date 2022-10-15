const router = require('express').Router();
// routes
const user = require('./user');
const contact = require('./contact');

router.use(user);
router.use(contact);

module.exports = router;
