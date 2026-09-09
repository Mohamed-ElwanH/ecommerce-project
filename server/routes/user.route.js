const express = require('express');
const { authenticate } = require('../middlewares/auth.middlewares');
const { authorize } = require('../middlewares/role.middlewares');
const {
  getAllUsers,
  createUser,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require('../controllers/user.controller');
const router = express.Router();

router.get('/', authenticate, authorize('admin'), getAllUsers);
router.post('/', createUser('user'));
router.post('/admin', authenticate, authorize('admin'), createUser('admin'));
router.post('/me/addresses', authenticate, addAddress);
router.put('/me/addresses/:addressId', authenticate, updateAddress);
router.delete('/me/addresses/:addressId', authenticate, deleteAddress);
router.put('/me/addresses/:addressId/default', authenticate, setDefaultAddress);

module.exports = router;