const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// استيراد الروابط
const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subjects');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');

// تهيئة التطبيق
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// قواعد API
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// صفحة البداية
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Education Rating System API' });
});

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/education_rating')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// بدء الخادم
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});