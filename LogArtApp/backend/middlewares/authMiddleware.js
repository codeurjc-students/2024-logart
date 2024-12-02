const jwt = require ('jsonwebtoken');
const BlacklistedToken = require('../models/blacklist.model');
const { accessTokenSecret } = require('../config/environment');

async function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token){
    return res.status(401).json({ error: true, message: 'Necesitas estar logueado para realizar esta acción' });
  }
  try {
  const blacklistedToken = await BlacklistedToken.findOne({ token });
  if (blacklistedToken) {
    return res.status(401).json({ error: true, message: 'Su token ha está en la lista negra, por favor inicie sesión nuevamente' });
  
  }
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err){
      return res.status(403).json({ error: true, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}
catch (error) {
  console.error(error);
  return res.status(500).json({ error: true, message: 'Internal server error' });
}
}

module.exports = { verifyToken };