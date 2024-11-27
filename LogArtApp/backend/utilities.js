const jwt = require ('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token){
    return res.sendStatus(401).json({ error: true, message: 'No token provided' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err){
      return res.sendStatus(403).json({ error: true, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

module.exports = { verifyToken };