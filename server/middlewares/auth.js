const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.userId).lean();
      if (!user) {
        return res.json({success: false, message: 'unauthorized access!'});
      }
      const HeaderUser = user;
      delete HeaderUser.password;
      //console.log(HeaderUser);
      req.user = HeaderUser;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.json({success: false, message: 'unauthorized access!'});
      }
      if (error.name === 'TokenExpiredError') {
        return res.json({
          success: false,
          message: 'session expired try sign in!',
        });
      }

      res.res.json({success: false, message: 'Internal server error!'});
    }
  } else {
    res.json({success: false, message: 'unauthorized access!'});
  }
};
