const router = require('express').Router();
// routes
const user = require('./user');
const contact = require('./contact');
const setting = require('./setting');
const profile = require('./profile');

router.use(user);
router.use(contact);
router.use(setting);
router.use(profile);

module.exports = router;
