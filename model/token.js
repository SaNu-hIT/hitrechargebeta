const mongoose = require("mongoose");
const TokenSchema = mongoose.Schema({
  access_token: {
    type: String,
    required: false
  },
  access_id: {
    type: String,
    required: false
  },
  scope: {
    type: String,
    required: false
  },
  expires_in: {
    type: String,
    required: false
  },
  token_type: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});
// export model user with UserSchema
module.exports = mongoose.model("token", TokenSchema);
