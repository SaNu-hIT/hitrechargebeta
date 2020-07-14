const mongoose = require("mongoose");
const PlansSchema = mongoose.Schema({
  Price: {
    type: String,
    required: false
  },
  Description: {
    type: String,
    required: false
  },
  Validity: {
    type: String,
    required: false
  },
  Talktime: {
    type: String,
    required: false
  },
  Plan_type: {
    type: String,
    required: false
  },
  operator: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});
module.exports = mongoose.model("plans", PlansSchema);