const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'المادة مطلوبة']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'المستخدم مطلوب']
  },
  rating: {
    type: Number,
    required: [true, 'التقييم مطلوب'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'عنوان التقييم مطلوب'],
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: [true, 'محتوى التقييم مطلوب'],
    trim: true
  },
  resources: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['سهلة', 'متوسطة', 'صعبة', 'صعبة جداً'],
    required: [true, 'مستوى الصعوبة مطلوب']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  reports: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reportsCount: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// تحديث الوقت عند التعديل
reviewSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// تحديث متوسط تقييم المادة عند إضافة/تعديل/حذف تقييم
reviewSchema.post('save', async function() {
  await this.constructor.updateSubjectRating(this.subject);
});

reviewSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    await doc.constructor.updateSubjectRating(doc.subject);
  }
});

reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await doc.constructor.updateSubjectRating(doc.subject);
  }
});

// دالة لتحديث متوسط تقييم المادة
reviewSchema.statics.updateSubjectRating = async function(subjectId) {
  const Subject = mongoose.model('Subject');
  
  const stats = await this.aggregate([
    { $match: { subject: subjectId, isApproved: true } },
    {
      $group: {
        _id: '$subject',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Subject.findByIdAndUpdate(subjectId, {
      averageRating: parseFloat(stats[0].averageRating.toFixed(1)),
      totalReviews: stats[0].totalReviews
    });
  } else {
    await Subject.findByIdAndUpdate(subjectId, {
      averageRating: 0,
      totalReviews: 0
    });
  }
};

module.exports = mongoose.model('Review', reviewSchema);