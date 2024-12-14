const mongoose = require("mongoose");

function isValidMongoId(id) {
  if (typeof id !== "string") {
    return false;
  }
  if (id.length !== 24) {
    return false;
  }
  return /^[0-9a-fA-F]{24}$/.test(id);
}

module.exports = isValidMongoId;
