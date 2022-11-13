const router = require('express').Router();
const authenticate = require('../middleware/auth');
const ctrl = require('../controllers/group');

router.get('/groups/participants/name', authenticate, ctrl.participantsName);

module.exports = router;
