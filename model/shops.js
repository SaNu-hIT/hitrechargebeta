const mongoose = require("mongoose");
const ShopSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  wallet_balance: {
    type: String,
    required: false
  },
  wallet_balance: {
    type: String,
    required: false
  },
  phoneId: {
    type: String,
    required: false
  },
  commision: {
    type: String,
    required: false
  },
  pincode: {
    type: String,
    required: false
  },
  distributorId: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});
// export model user with UserSchema
module.exports = mongoose.model("shops", ShopSchema);