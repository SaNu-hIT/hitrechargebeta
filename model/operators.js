const mongoose = require("mongoose");
const OperatorsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  operatorId: {
    type: String,
    required: true
  },
  logoUrls: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});
// export model user with UserSchema
module.exports = mongoose.model("operators", OperatorsSchema);