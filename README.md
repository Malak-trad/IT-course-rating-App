#  Educational system evaluation

![جامعة الجزائر](https://img.shields.io/badge/جامعة-الجزائر-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-success)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

## 📋 Project Definition
Name of the project: Educational system evaluation
Type: Application Web Full-Stack (MERN Stack)
Domaine: Education / E-learning
Public License: Students in Informatique (Licence 1, License 2, License 3, Master 1,Master 2)
Language: English(Interface and content)
Resolution problem: Difficult students discover available resources and experience with their
university students.


## ✨ المميزات الرئيسية

### 👥 للمستخدمين (الطلاب)
- ✅ التسجيل وإنشاء حساب شخصي
- ✅ تسجيل الدخول بأمان
- ✅ تصفح المواد حسب المستوى الدراسي
- ✅ إضافة تقييمات بالنجوم
- ✅ كتابة مراجعات نصية للمصادر
- ✅ الإعجاب بالتقييمات الأخرى
- ✅ الإبلاغ عن المحتوى غير المناسب

### 👨‍💼 للمسؤولين
- ✅ لوحة تحكم متكاملة
- ✅ إدارة المستخدمين (تفعيل/تعطيل/حذف)
- ✅ إدارة المواد الدراسية
- ✅ مراجعة التقييمات المعلقة
- ✅ معالجة الإبلاغات
- ✅ إحصائيات وتحليلات مفصلة
- ✅ تصدير البيانات

## 🏗️ البنية التقنية

### Backend
- **Node.js** مع **Express.js**
- **MongoDB** لقاعدة البيانات
- **JWT** للمصادقة
- **BCrypt** لتشفير كلمات المرور
- **Mongoose** لـ ODM
- **Multer** لرفع الملفات
- **CORS** و **Helmet** للأمان

### Frontend
- **HTML5** و **CSS3** مع تصميم عربي متجاوب
- **JavaScript** Vanilla (بدون frameworks)
- **Font Awesome** للأيقونات
- **Google Fonts** (Cairo)

### DevOps
- **Docker** و **Docker Compose**
- **Nginx** كـ Reverse Proxy
- **Mongo Express** لإدارة قاعدة البيانات
- **Jenkins** للـ CI/CD (اختياري)

## 🚀 كيفية التشغيل

### الطريقة 1: باستخدام Docker (مستحسن)

```bash
# 1. استنساخ المشروع
git clone https://github.com/Malak-trad/IT-course-rating-App.git
cd IT-course-rating-App

# 2. نسخ ملف البيئة
cp .env.example .env

# 3. تشغيل المشروع
docker-compose up -d

# 4. فتح المتصفح
# FRONTEND: http://localhost
# BACKEND: http://localhost:5000
# لوحة التحكم: http://localhost/admin-dashboard.html
#  MongoDB: http://localhost:8081 (admin/admin123)