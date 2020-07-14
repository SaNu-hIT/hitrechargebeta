const mongoose = require("mongoose");
const DistributorSchema = mongoose.Schema({
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
  phoneId: {
    type: String,
    required: false
  },
  commision: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});
// export model user with UserSchema
module.exports = mongoose.model("distributor", DistributorSchema);