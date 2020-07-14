const mongoose = require("mongoose");
const RechargeSchema = mongoose.Schema({
  operatorId: {
    type: String,
    required: false
  },
  operatorName: {
    type: String,
    required: false
  },
  shopId: {
    type: String,
    required: false
  },
  discount: {
    type: String,
    required: false
  },
  amount: {
    type: String,
    required: false
  },
  customIdentifier: {
    type: String,
    required: false
  },
  recipientPhone: {
    type: String,
    required: false
  },
  recipientCountryCode: {
    type: String,
    required: false
  },
  recipientNumber: {
    type: String,
    required: false
  },
  senderPhone: {
    type: String,
    required: false
  },
  senderCountryCode: {
    type: String,
    required: false
  },
  senderNumber: {
    type: String,
    required: false
  },
  logoUrl: {
    type: String,
    required: false
  },
  success: {
    type: Boolean,
    required: false
  },
  transactionId: {
    type: String,
    required: false
  },
  distributorId: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now()
  }
});
// export model user with UserSchema
module.exports = mongoose.model("recharge", RechargeSchema);