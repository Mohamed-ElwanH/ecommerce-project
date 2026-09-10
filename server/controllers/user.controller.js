const User = require('../models/user.model');

exports.getAllUsers =  async (req, res) => {
  try{
  const myUsers = await User.find();
  res.status(200).json({message:'users list',data:myUsers});}
  catch(e){
    res.status(500).json({error: e.message})
  }
}
exports.createUser = (role)=>{return async (req, res) => {
    const {name, email, password, gender} = req.body;
    const myUser = await User.create({name, email, password, role, gender});
    res.status(201).json({message:'user created',data:myUser});
}}

// user.controller.js additions
exports.addAddress = async (req, res) => {
  try {
    const { title, street, city, area, building, floor, apartment, notes, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    if (isDefault) user.addresses.forEach(a => a.isDefault = false);
    user.addresses.push({ title, street, city, area, building, floor, apartment, notes, isDefault });
    await user.save();
    res.status(201).json({ message: "Address added", data: user.addresses });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ error: "Address not found" });
    Object.assign(address, req.body);
    await user.save();
    res.status(200).json({ message: "Address updated", data: address });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ error: "Address not found" });
    address.deleteOne();
    await user.save();
    res.status(200).json({ message: "Address removed", data: user.addresses });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    const target = user.addresses.id(addressId);
    if (!target) return res.status(404).json({ error: "Address not found" });
    user.addresses.forEach(a => a.isDefault = false);
    target.isDefault = true;
    await user.save();
    res.status(200).json({ message: "Default address set", data: user.addresses });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json({ message: 'Current user', data: req.user });
};

//fetch the logged-in user's saved addresses (the auth middleware
//already loads the full user document onto req.user)
exports.getMyAddresses = async (req, res) => {
  res.status(200).json({ message: 'My addresses', data: req.user.addresses });
};

//admin block/unblock toggle (isBlocked is enforced by preventBlocked on orders)
exports.setUserBlocked = async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const myUser = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: !!isBlocked },
      { new: true },
    );
    if (!myUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({
      message: isBlocked ? 'User blocked' : 'User unblocked',
      data: myUser,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
