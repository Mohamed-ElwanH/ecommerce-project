const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    addresses: [
      {
        title: { type: String, required: true }, // "Home", "Work"
        street: { type: String, required: true },
        city: { type: String, required: true },
        area: { type: String },
        building: { type: String },
        floor: { type: String },
        apartment: { type: String },
        notes: { type: String }, // optional instructions
        isDefault:{type:Boolean}
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.isCorrectPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
