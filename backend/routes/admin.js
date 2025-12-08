const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

// جميع الطرق تحتاج إلى صلاحية مسؤول
router.use(auth, isAdmin);

// إحصائيات النظام
router.get('/stats', adminController.getSystemStats);

// إدارة المستخدمين
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.updateUserStatus);

// إدارة التقييمات
router.put('/reviews/:id/moderate', adminController.moderateReview);

// الإبلاغات
router.get('/reports', adminController.getReports);
router.put('/reports/:id/handle', adminController.handleReport);

// تصدير البيانات
router.get('/export', adminController.exportData);

module.exports = router;