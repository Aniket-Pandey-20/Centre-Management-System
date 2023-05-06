import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  return jwt.sign({ user_id: user.rh_id ? user.rh_id : user.user_id, 
                  type: user.is_admin ?'admin':(user.rh_id ? 'rh':'user'),
                  username:user.rh_username ? user.rh_username: user.username}, 
  "mySecretKey", {expiresIn: "30m",});
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ user_id: user.rh_id ? user.rh_id : user.user_id, 
                  type: user.is_admin ?'admin':(user.rh_id ? 'rh':'user'),
                  username:user.rh_username ? user.rh_username: user.username},
  "myRefreshSecretKey", {expiresIn: "2h",});
};

export const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "mySecretKey", (err, user) => {
      if (err) {
        return res.status(401).json(err = {
          name: 'TokenExpiredError',
          message: 'jwt expired'
        });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(403).json("You are not authenticated!");
  }
};
