const Subject = require('../models/Subject');
const Review = require('../models/Review');
const { validationResult } = require('express-validator');

// الحصول على جميع المواد
exports.getAllSubjects = async (req, res) => {
  try {
    const { level, semester, page = 1, limit = 10, sort = '-averageRating' } = req.query;
    
    const query = { isActive: true };
    
    if (level) query.level = level;
    if (semester) query.semester = semester;
    
    const subjects = await Subject.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Subject.countDocuments(query);
    
    res.json({
      subjects,
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

// الحصول على مادة واحدة
exports.getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ error: 'المادة غير موجودة' });
    }
    
    // الحصول على التقييمات
    const reviews = await Review.find({ subject: subject._id, isApproved: true })
      .populate('user', 'fullName level avatar')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({ subject, reviews });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// إنشاء مادة جديدة (للمسؤول)
exports.createSubject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const subject = new Subject(req.body);
    await subject.save();
    
    res.status(201).json({
      message: 'تم إنشاء المادة بنجاح',
      subject
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'رمز المادة موجود مسبقاً' });
    }
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// تحديث مادة
exports.updateSubject = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'level', 'semester', 'credits', 'professor', 'difficulty', 'isActive'];
    
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ error: 'المادة غير موجودة' });
    }
    
    updates.forEach(update => subject[update] = req.body[update]);
    await subject.save();
    
    res.json({
      message: 'تم تحديث المادة بنجاح',
      subject
    });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// حذف مادة
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ error: 'المادة غير موجودة' });
    }
    
    // حذف جميع التقييمات المرتبطة
    await Review.deleteMany({ subject: subject._id });
    
    await subject.deleteOne();
    
    res.json({ message: 'تم حذف المادة بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// البحث في المواد
exports.searchSubjects = async (req, res) => {
  try {
    const { q, level, semester } = req.query;
    
    const query = { isActive: true };
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { code: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { professor: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (level) query.level = level;
    if (semester) query.semester = semester;
    
    const subjects = await Subject.find(query)
      .sort('-averageRating')
      .limit(20);
    
    res.json({ subjects });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};

// إحصائيات المواد
exports.getSubjectsStats = async (req, res) => {
  try {
    const stats = await Subject.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$level',
          totalSubjects: { $sum: 1 },
          avgRating: { $avg: '$averageRating' },
          totalReviews: { $sum: '$totalReviews' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const totalStats = await Subject.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalSubjects: { $sum: 1 },
          avgRating: { $avg: '$averageRating' },
          totalReviews: { $sum: '$totalReviews' }
        }
      }
    ]);
    
    res.json({
      byLevel: stats,
      total: totalStats[0] || { totalSubjects: 0, avgRating: 0, totalReviews: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
};