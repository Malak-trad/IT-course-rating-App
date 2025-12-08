const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم المادة مطلوب'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'رمز المادة مطلوب'],
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    required: [true, 'وصف المادة مطلوب']
  },
  level: {
    type: String,
    enum: ['ليسنس 1', 'ليسنس 2', 'ليسنس 3', 'ماستر 1', 'ماستر 2'],
    required: [true, 'المستوى الدراسي مطلوب']
  },
  semester: {
    type: String,
    enum: ['الأول', 'الثاني'],
    required: [true, 'الفصل الدراسي مطلوب']
  },
  credits: {
    type: Number,
    required: [true, 'عدد الوحدات مطلوب'],
    min: 1,
    max: 6
  },
  professor: {
    type: String,
    required: [true, 'اسم الأستاذ مطلوب']
  },
  department: {
    type: String,
    default: 'الإعلام الآلي'
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['سهلة', 'متوسطة', 'صعبة', 'صعبة جداً'],
    default: 'متوسطة'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// تحديث الوقت عند التعديل
subjectSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Subject', subjectSchema);