const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const subjectController = require('../controllers/subjectController');
const { auth, isAdmin } = require('../middleware/auth');

// الحصول على جميع المواد (للجميع)
router.get('/', subjectController.getAllSubjects);

// البحث في المواد (للجميع)
router.get('/search', subjectController.searchSubjects);

// الحصول على مادة واحدة (للجميع)
router.get('/:id', subjectController.getSubject);

// إحصائيات المواد (للجميع)
router.get('/stats/subjects', subjectController.getSubjectsStats);

// إنشاء مادة جديدة (للمسؤول فقط)
router.post('/', [
  auth,
  isAdmin,
  body('name').notEmpty().withMessage('اسم المادة مطلوب'),
  body('code').notEmpty().withMessage('رمز المادة مطلوب'),
  body('description').notEmpty().withMessage('وصف المادة مطلوب'),
  body('level').notEmpty().withMessage('المستوى الدراسي مطلوب'),
  body('semester').notEmpty().withMessage('الفصل الدراسي مطلوب'),
  body('credits').isInt({ min: 1, max: 6 }).withMessage('عدد الوحدات يجب أن يكون بين 1 و 6'),
  body('professor').notEmpty().withMessage('اسم الأستاذ مطلوب')
], subjectController.createSubject);

// تحديث مادة (للمسؤول فقط)
router.put('/:id', [
  auth,
  isAdmin,
  body('name').optional().notEmpty().withMessage('اسم المادة مطلوب'),
  body('code').optional().notEmpty().withMessage('رمز المادة مطلوب'),
  body('description').optional().notEmpty().withMessage('وصف المادة مطلوب')
], subjectController.updateSubject);

// حذف مادة (للمسؤول فقط)
router.delete('/:id', [auth, isAdmin], subjectController.deleteSubject);

module.exports = router;