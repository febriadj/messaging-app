const router = require('express').Router();
const authenticate = require('../middleware/auth');
const ctrl = require('../controllers/profile');

router.get('/profiles', authenticate, ctrl.find);
router.put('/profiles', authenticate, ctrl.edit);

module.exports = router;
