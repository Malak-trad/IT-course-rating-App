const User = require('../models/User');
const Subject = require('../models/Subject');
const Review = require('../models/Review');
const Report = require('../models/Report');

// إحصائيات النظام
exports.getSystemStats = async (req, res) => {
  try {
    // إحصائيات المستخدمين
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } }
        }
      }
    ]);
    
    // إحصائيات المواد
    const subjectStats = await Subject.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } }
        }
      }
    ]);
    
    // إحصائيات التقييمات
    const reviewStats = await Review.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] } },
          featured: { $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] } },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
    
    // إحصائيات التقييمات حسب الشهر
    const monthlyReviews = await Review.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);
    
    res.json({
      users: userStats,
      subjects: subjectStats,
      reviews: reviewStats[0] || { total: 0, approved: 0, featured: 0, averageRating: 0 },
      monthlyReviews,
      totals: {
        users: await User.countDocuments(),
        subjects: await Subject.countDocuments(),
        reviews: await Review.countDocuments(),
        reports: await Report.countDocuments()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'error' });
  }
};

// إدارة المستخدمين
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive, search } = req.query;
    
    const query = {};
    
    if (role) query.role = role;
    if (isActive) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'error' });
  }
};

// تحديث حالة المستخدم
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, role } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (isActive !== undefined) user.isActive = isActive;
    if (role) user.role = role;
    
    await user.save();
    
    res.json({
      message: 'User status update successful',
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'error' });
  }
};

// إدارة التقييمات
exports.moderateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, isFeatured } = req.body;
    
    const review = await Review.findById(id)
      .populate('user', 'fullName email')
      .populate('subject', 'name code');
    
    if (!review) {
      return res.status(404).json({ error: 'التقييم غير موجود' });
    }
    
    if (isApproved !== undefined) review.isApproved = isApproved;
    if (isFeatured !== undefined) review.isFeatured = isFeatured;
    
    await review.save();
    
    res.json({
      message: 'User status update successful',
      review
    });
  } catch (error) {
    res.status(500).json({ error: 'error' });
  }
};

// الإبلاغات
exports.getReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    
    const reports = await Report.find(query)
      .populate('review')
      .populate('reporter', 'fullName email')
      .populate('resolvedBy', 'fullName')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Report.countDocuments(query);
    
    res.json({
      reports,
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

// معالجة الإبلاغ
exports.handleReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    const report = await Report.findById(id)
      .populate('review')
      .populate('reporter', 'fullName email');
    
    if (!report) {
      return res.status(404).json({ error: 'الإبلاغ غير موجود' });
    }
    
    report.status = status;
    report.adminNotes = adminNotes;
    report.resolvedAt = Date.now();
    report.resolvedBy = req.user._id;
    
    // إذا تم قبول الإبلاغ، تعطيل التقييم
    if (status === 'accepte' && report.review) {
      report.review.isApproved = false;
      await report.review.save();
    }
    
    await report.save();
    
    res.json({
      message: 'The report was successfully processed.',
      report
    });
  } catch (error) {
    res.status(500).json({ error: 'error' });
  }
};

// تصدير البيانات
exports.exportData = async (req, res) => {
  try {
    const { type } = req.query;
    
    let data;
    
    switch (type) {
      case 'users':
        data = await User.find().select('-password');
        break;
      case 'subjects':
        data = await Subject.find();
        break;
      case 'reviews':
        data = await Review.find()
          .populate('user', 'fullName email')
          .populate('subject', 'name code');
        break;
      default:
        return res.status(400).json({ error: 'Invalid data type' });
    }
    
    res.json({
      type,
      count: data.length,
      data,
      exportedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'error' });
  }
};