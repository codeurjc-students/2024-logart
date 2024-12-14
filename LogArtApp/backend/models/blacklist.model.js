const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blacklistedTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const BlacklistedToken = mongoose.model(
  "BlacklistedToken",
  blacklistedTokenSchema
);

module.exports = BlacklistedToken;
