const mongoose = require("mongoose");


function isValidMongoId(id) {
  if (typeof id !== 'string') {
    return false;
  }
  
  // Verificar si la longitud es correcta para un ObjectId
  if (id.length !== 24) {
    return false;
  }

  // Verificar si solo contiene caracteres hexadecimales
  return /^[0-9a-fA-F]{24}$/.test(id);
}

module.exports = isValidMongoId