const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'education-rating-secret');
    const user = await User.findOne({ _id: decoded.userId, isActive: true });
    
    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'الرجاء تسجيل الدخول للوصول إلى هذه الصفحة' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'غير مسموح لك بالوصول إلى هذه الصفحة' });
  }
};

module.exports = { auth, isAdmin };