const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// تسجيل مستخدم جديد
router.post('/register', [
  body('fullName').notEmpty().withMessage('الاسم الكامل مطلوب'),
  body('email').isEmail().withMessage('بريد إلكتروني صالح مطلوب'),
  body('password').isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  body('level').notEmpty().withMessage('المستوى الدراسي مطلوب')
], authController.register);

// تسجيل الدخول
router.post('/login', [
  body('email').isEmail().withMessage('بريد إلكتروني صالح مطلوب'),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة')
], authController.login);

// بيانات المستخدم الحالي
router.get('/profile', auth, authController.getProfile);

// تحديث الملف الشخصي
router.put('/profile', auth, upload.single('avatar'), authController.updateProfile);

// تغيير كلمة المرور
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('كلمة المرور الحالية مطلوبة'),
  body('newPassword').isLength({ min: 6 }).withMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
], authController.changePassword);

module.exports = router;