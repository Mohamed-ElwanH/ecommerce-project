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
  getMyAddresses,
  setUserBlocked,
} = require('../controllers/user.controller');
const router = express.Router();

router.get('/', authenticate, authorize('admin'), getAllUsers);
router.get('/me/addresses', authenticate, getMyAddresses);
router.post('/', createUser('user'));
router.post('/admin', authenticate, authorize('admin'), createUser('admin'));
router.post('/me/addresses', authenticate, addAddress);
router.put('/me/addresses/:addressId', authenticate, updateAddress);
router.put('/me/addresses/:addressId/default', authenticate, setDefaultAddress);
router.put('/:id/block', authenticate, authorize('admin'), setUserBlocked);
router.delete('/me/addresses/:addressId', authenticate, deleteAddress);

module.exports = router;