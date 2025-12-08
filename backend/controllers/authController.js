const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// إنشاء JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'education-rating-secret',
    { expiresIn: '7d' }
  );
};

// تسجيل مستخدم جديد
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, level } = req.body;

    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'البريد الإلكتروني موجود مسبقاً' });
    }

    // إنشاء المستخدم
    const user = new User({
      fullName,
      email,
      password,
      level,
      role: 'student'
    });

    await user.save();

    // إنشاء Token
    const token = generateToken(user._id);

    // تحديث آخر تسجيل دخول
    user.lastLogin = Date.now();
    await user.save();

    // إزالة كلمة المرور من كائن المستخدم قبل الإرسال
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      token,
      user: {
        id: userWithoutPassword._id,
        fullName: userWithoutPassword.fullName,
        email: userWithoutPassword.email,
        studentId: userWithoutPassword.studentId,
        level: userWithoutPassword.level,
        role: userWithoutPassword.role,
        avatar: userWithoutPassword.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // البحث عن المستخدم
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    // إنشاء Token
    const token = generateToken(user._id);

    // تحديث آخر تسجيل دخول
    user.lastLogin = Date.now();
    await user.save();

    // إزالة كلمة المرور من كائن المستخدم قبل الإرسال
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: userWithoutPassword._id,
        fullName: userWithoutPassword.fullName,
        email: userWithoutPassword.email,
        studentId: userWithoutPassword.studentId,
        level: userWithoutPassword.level,
        role: userWithoutPassword.role,
        avatar: userWithoutPassword.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// بيانات المستخدم الحالي
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate({
        path: 'reviews',
        options: { sort: { createdAt: -1 }, limit: 5 }
      });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// تحديث الملف الشخصي
exports.updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['fullName', 'level', 'avatar'];
    if (updates.includes('email') || updates.includes('password')) {
      return res.status(400).json({ error: 'لا يمكن تحديث البريد الإلكتروني أو كلمة المرور من هذا المسار' });
    }
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'تحديث غير مسموح به' });
    }

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();

    res.json({
      message: 'تم تحديث الملف الشخصي بنجاح',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// تغيير كلمة المرور
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // التحقق من كلمة المرور الحالية
    const isPasswordValid = await req.user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'كلمة المرور الحالية غير صحيحة' });
    }

    // تحديث كلمة المرور
    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};