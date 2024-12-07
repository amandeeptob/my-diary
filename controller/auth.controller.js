const jwt = require('jsonwebtoken')

function authenticate(req,_,next){
    const token = req.cookies?.token;
    let user=null
    // if (!token) {
    //   return res.status(401).json({ error: 'Invalid user' ,isAuthenticated: false});
    // }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      // user = {error: 'Invalid user',isAuthenticated:false}
      if (err) {
        // return res.status(403).json({ error: 'Invalid user',isAuthenticated: false });
        console.log('unable to verify')
        next()
      }
      // Attach the decoded token to the request object
      user = decodedToken;
      req.user=user
      next()
    });
    
}

module.exports=authenticate;