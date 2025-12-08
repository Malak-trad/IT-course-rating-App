const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');

// الحصول على تقييمات المستخدم
router.get('/reviews', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('subject', 'name code level')
      .sort('-createdAt');
    
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
});

// الحصول على معلومات مستخدم مع تقييماته
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    
    const reviews = await Review.find({ user: user._id, isApproved: true })
      .populate('subject', 'name code level')
      .sort('-createdAt')
      .limit(10);
    
    const reviewStats = await Review.aggregate([
      { $match: { user: user._id, isApproved: true } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          totalLikes: { $sum: '$likesCount' }
        }
      }
    ]);
    
    res.json({
      user,
      reviews,
      stats: reviewStats[0] || { totalReviews: 0, averageRating: 0, totalLikes: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
});

module.exports = router;