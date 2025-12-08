const Review = require('../models/Review');
const Subject = require('../models/Subject');
const { validationResult } = require('express-validator');

// الحصول على جميع التقييمات
exports.getAllReviews = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      subject,
      level,
      approved = true
    } = req.query;
    
    const query = {};
    
    if (subject) query.subject = subject;
    if (level) {
      const subjects = await Subject.find({ level, isActive: true }).select('_id');
      query.subject = { $in: subjects.map(s => s._id) };
    }
    if (approved !== 'all') {
      query.isApproved = approved === 'true';
    }
    
    const reviews = await Review.find(query)
      .populate('subject', 'name code level')
      .populate('user', 'fullName level avatar')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Review.countDocuments(query);
    
    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// إنشاء تقييم جديد
exports.createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { subject, rating, title, content, difficulty } = req.body;
    
    // التحقق من وجود المادة
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(404).json({ error: 'المادة غير موجودة' });
    }
    
    // التحقق من عدم وجود تقييم سابق لنفس المستخدم لنفس المادة
    const existingReview = await Review.findOne({ 
      subject, 
      user: req.user._id 
    });
    
    if (existingReview) {
      return res.status(400).json({ 
        error: 'لقد قمت بتقييم هذه المادة مسبقاً',
        review: existingReview 
      });
    }
    
    // إنشاء التقييم
    const review = new Review({
      ...req.body,
      user: req.user._id,
      resources: req.body.resources ? req.body.resources.split(',').map(r => r.trim()) : []
    });
    
    await review.save();
    
    // تحميل البيانات المرتبطة
    await review.populate('subject', 'name code level');
    await review.populate('user', 'fullName level avatar');
    
    res.status(201).json({
      message: 'تم إضافة التقييم بنجاح',
      review
    });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// تحديث تقييم
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'التقييم غير موجود' });
    }
    
    // التحقق من أن المستخدم هو صاحب التقييم
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'غير مسموح لك بتعديل هذا التقييم' });
    }
    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['rating', 'title', 'content', 'resources', 'difficulty'];
    
    updates.forEach(update => review[update] = req.body[update]);
    
    if (req.body.resources) {
      review.resources = req.body.resources.split(',').map(r => r.trim());
    }
    
    await review.save();
    
    res.json({
      message: 'تم تحديث التقييم بنجاح',
      review
    });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// حذف تقييم
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'التقييم غير موجود' });
    }
    
    // التحقق من أن المستخدم هو صاحب التقييم أو مسؤول
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'غير مسموح لك بحذف هذا التقييم' });
    }
    
    await review.deleteOne();
    
    res.json({ message: 'تم حذف التقييم بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// إعجاب بتقييم
exports.likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'التقييم غير موجود' });
    }
    
    // التحقق من عدم الإعجاب مسبقاً
    const alreadyLiked = review.likes.includes(req.user._id);
    
    if (alreadyLiked) {
      // إزالة الإعجاب
      review.likes = review.likes.filter(
        like => like.toString() !== req.user._id.toString()
      );
      review.likesCount = review.likes.length;
      await review.save();
      
      res.json({ 
        message: 'تم إزالة الإعجاب',
        liked: false,
        likesCount: review.likesCount 
      });
    } else {
      // إضافة إعجاب
      review.likes.push(req.user._id);
      review.likesCount = review.likes.length;
      await review.save();
      
      res.json({ 
        message: 'تم الإعجاب بالتقييم',
        liked: true,
        likesCount: review.likesCount 
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// الإبلاغ عن تقييم
exports.reportReview = async (req, res) => {
  try {
    const { reason, description } = req.body;
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'التقييم غير موجود' });
    }
    
    // التحقق من عدم الإبلاغ مسبقاً
    const alreadyReported = review.reports.some(
      report => report.user.toString() === req.user._id.toString()
    );
    
    if (alreadyReported) {
      return res.status(400).json({ error: 'لقد أبلغت عن هذا التقييم مسبقاً' });
    }
    
    // إضافة الإبلاغ
    review.reports.push({
      user: req.user._id,
      reason,
      reportedAt: Date.now()
    });
    review.reportsCount = review.reports.length;
    await review.save();
    
    res.json({ 
      message: 'تم الإبلاغ عن التقييم بنجاح',
      reportsCount: review.reportsCount 
    });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};