const Testimonial = require("../models/testimonial.model");

exports.createTist = async (req, res) => {
  try {
    const { name, message } = req.body;

    const tist = await Testimonial.create({ name: name, message: message });
    res.status(201).json({ message: "Tistimonial created", data: tist });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.getAllTist = async (req, res) => {
  try {
    const tist = await Testimonial.find();
    res.status(200).json({ message: "testimonials", data: tist });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.approveTist = async (req, res) => {
  try {
    const tistId = req.params.id;
    const tist = await Testimonial.findByIdAndUpdate(
      tistId,
      {
        isApproved: true,
      },
      { new: true },
    );
    if (!tist) return res.status(404).json({ error: "Testimonial not found" });
    res.status(200).json({ message: "Testimonial approved", data: tist });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.getApprovedTist = async (req, res) => {
  try {
    const tist = await Testimonial.find({ isApproved: true });
    res.status(200).json({ message: "Approved Testimonials", data: tist });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.hideTist = async (req, res) => {
  try {
    const tistId = req.params.id;
    const tist = await Testimonial.findByIdAndUpdate(
      tistId,
      { isApproved: false },
      { new: true },
    );
    if (!tist) return res.status(404).json({ error: "Testimonial not found" });
    res.status(200).json({ message: "Testimonial hidden", data: tist });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.deleteTist = async (req, res) => {
  try {
    const tistId = req.params.id;
    const tist = await Testimonial.findByIdAndDelete(tistId);
    if (!tist) return res.status(404).json({ error: "Testimonial not found" });
    res.status(200).json({ message: "Testimonial deleted", data: tist });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
