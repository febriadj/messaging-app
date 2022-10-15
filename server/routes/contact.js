const router = require('express').Router();
const authenticate = require('../middleware/auth');
const ctrl = require('../controllers/contact');

router.post('/contacts', authenticate, ctrl.insert);

module.exports = router;
