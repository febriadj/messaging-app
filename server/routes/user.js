const router = require('express').Router();
const ctrl = require('../controllers/user');

router.post('/users/preregister', ctrl.preregister);
router.post('/users/register', ctrl.register);
router.post('/users/login', ctrl.login);

module.exports = router;
