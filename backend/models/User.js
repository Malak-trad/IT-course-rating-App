const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [100, 'Name is too long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function(v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true
  },
  level: {
    type: String,
    enum: ['License 1', 'License 2', 'License 3', 'Master 1', 'Master 2'],
    required: [true, 'Academic level is required']
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
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
  timestamps: false // We're manually managing updatedAt
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt when modifying
userSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Generate automatic student ID
userSchema.pre('save', function(next) {
  if (this.role === 'student' && !this.studentId) {
    const year = new Date().getFullYear().toString().slice(-2);
    const levelMap = {
      'License 1': 'L1',
      'License 2': 'L2',
      'License 3': 'L3',
      'Master 1': 'M1',
      'Master 2': 'M2'
    };
    const levelCode = levelMap[this.level] || 'XX';
    const random = Math.floor(100 + Math.random() * 900);
    this.studentId = `STU${year}${levelCode}${random}`;
  }
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Safely update profile
userSchema.methods.updateProfile = async function(updateData) {
  const allowedFields = ['fullName', 'level', 'avatar'];
  const updates = {};
  
  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = updateData[key];
    }
  });
  
  Object.assign(this, updates);
  return await this.save();
};

// Return safe object without sensitive information
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Update last login timestamp
userSchema.statics.updateLastLogin = async function(userId) {
  return await this.findByIdAndUpdate(
    userId,
    { lastLogin: Date.now() },
    { new: true }
  );
};

// Add indexes for performance optimization
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ studentId: 1 }, { sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ level: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);