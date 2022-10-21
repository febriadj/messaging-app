const router = require('express').Router();
// routes
const user = require('./user');
const contact = require('./contact');
const setting = require('./setting');

router.use(user);
router.use(contact);
router.use(setting);

module.exports = router;
