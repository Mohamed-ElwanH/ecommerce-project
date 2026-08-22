const express = require('express');
const { authenticate } = require('../middlewares/auth.middlewares');
const { authorize } = require('../middlewares/role.middlewares');
const { getAllUsers, createUser } = require('../controllers/user.controller');
const router = express.Router();

// router.use('/', authenticate)
router.get('/', authenticate,authorize('admin'), getAllUsers);
router.post('/', createUser('user'))
router.post('/admin', authenticate,authorize('admin'), createUser('admin'))

module.exports = router;