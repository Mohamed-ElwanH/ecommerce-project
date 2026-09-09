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
