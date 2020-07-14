const mongoose = require("mongoose");
const WalletSchema = mongoose.Schema({
  shopId: {
    type: String,
    required: false
  },
  distributorId: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  wallet_amount: {
    type: Number,
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
module.exports = mongoose.model("wallet", WalletSchema);