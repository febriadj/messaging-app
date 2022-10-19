const router = require('express').Router();
const authenticate = require('../middleware/auth');

const ctrl = require('../controllers/user');

router.post('/users/register', ctrl.registerStep1);
router.post('/users/register/confirm', ctrl.registerStep2);
router.post('/users/login', ctrl.login);
router.get('/users', authenticate, ctrl.find);

module.exports = router;
