const mongoose = require("mongoose");
const ShopWalletSchema = mongoose.Schema({
  shopId: {
    type: String,
    required: false
  },
  amount: {
    type: Number,
    required: false
  },
  phone: {
    type: Number,
    required: false
  },
  distributorId: {
    type: String,
    required: false
  },
  wallet_balance: {
    type: Number,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});
// export model user with UserSchema
module.exports = mongoose.model("shopwallet", ShopWalletSchema);