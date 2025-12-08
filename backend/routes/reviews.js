const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

// الحصول على جميع التقييمات (للجميع)
router.get('/', reviewController.getAllReviews);

// إنشاء تقييم جديد (للمستخدمين المسجلين)
router.post('/', [
  auth,
  body('subject').notEmpty().withMessage('المادة مطلوبة'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('التقييم يجب أن يكون بين 1 و 5'),
  body('title').notEmpty().withMessage('عنوان التقييم مطلوب'),
  body('content').notEmpty().withMessage('محتوى التقييم مطلوب'),
  body('difficulty').notEmpty().withMessage('مستوى الصعوبة مطلوب')
], reviewController.createReview);

// تحديث تقييم (لصاحب التقييم)
router.put('/:id', [
  auth,
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('title').optional().notEmpty(),
  body('content').optional().notEmpty()
], reviewController.updateReview);

// حذف تقييم (لصاحب التقييم أو المسؤول)
router.delete('/:id', auth, reviewController.deleteReview);

// إعجاب بتقييم (للمستخدمين المسجلين)
router.post('/:id/like', auth, reviewController.likeReview);

// الإبلاغ عن تقييم (للمستخدمين المسجلين)
router.post('/:id/report', [
  auth,
  body('reason').notEmpty().withMessage('سبب الإبلاغ مطلوب')
], reviewController.reportReview);

module.exports = router;