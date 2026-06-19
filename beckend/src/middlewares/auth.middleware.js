const jwt = require('jsonwebtoken');

async function authArtist(req, res, next){
    const token = req.cookies.token;

    if(!token)return res.status(401).json({message: 'Token not provided'});

    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if(decoded.role !== 'artist') return res.status(403).json({message: 'you dont have access to this resource'});
      
      req.user = decoded;

      next();
    } catch(error){
        console.log(error);
        return res.status(401).json({ message: 'Unauthorized'});
    }
}

module.exports = { authArtist };