// تهيئة قاعدة البيانات وإنشاء مستخدم مسؤول افتراضي
db = db.getSiblingDB('education_rating');

// إنشاء المجموعات
db.createCollection('users');
db.createCollection('subjects');
db.createCollection('reviews');
db.createCollection('reports');

// إنشاء فهارس للمستخدمين
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ studentId: 1 }, { unique: true, sparse: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });
db.users.createIndex({ createdAt: -1 });

// إنشاء فهارس للمواد
db.subjects.createIndex({ code: 1 }, { unique: true });
db.subjects.createIndex({ level: 1 });
db.subjects.createIndex({ semester: 1 });
db.subjects.createIndex({ averageRating: -1 });
db.subjects.createIndex({ isActive: 1 });

// إنشاء فهارس للتقييمات
db.reviews.createIndex({ subject: 1 });
db.reviews.createIndex({ user: 1 });
db.reviews.createIndex({ rating: 1 });
db.reviews.createIndex({ isApproved: 1 });
db.reviews.createIndex({ isFeatured: 1 });
db.reviews.createIndex({ createdAt: -1 });
db.reviews.createIndex({ subject: 1, user: 1 }, { unique: true });

// إنشاء فهارس للإبلاغات
db.reports.createIndex({ review: 1 });
db.reports.createIndex({ reporter: 1 });
db.reports.createIndex({ status: 1 });
db.reports.createIndex({ createdAt: -1 });

// إضافة مستخدم مسؤول افتراضي (كلمة المرور: Admin123)
db.users.insertOne({
    fullName: "المسؤول الرئيسي",
    email: "admin@edu-rating.com",
    password: "$2a$10$Xx6z7j5pPp9q9r8s7t6u5v4w3x2y1z0A.BcDeFgHiJkLmNoPqRsTuVwXyZ",
    studentId: "ADMIN001",
    level: "ماستر 2",
    role: "admin",
    avatar: "",
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
});

// إضافة مواد افتراضية
const subjects = [
    {
        name: "خوارزميات وهياكل البيانات",
        code: "INF101",
        description: "مادة تدرس الخوارزميات الأساسية وهياكل البيانات مثل المصفوفات، القوائم المتسلسلة، المكدس، الطابور، والأشجار.",
        level: "ليسنس 2",
        semester: "الأول",
        credits: 4,
        professor: "د. أحمد زيدان",
        department: "الإعلام الآلي",
        averageRating: 4.5,
        totalReviews: 24,
        difficulty: "متوسطة",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "قواعد البيانات",
        code: "INF102",
        description: "مادة تقدم مفاهيم قواعد البيانات العلائقية، لغة SQL، التصميم المنطقي والفيزيائي للقواعد.",
        level: "ليسنس 2",
        semester: "الثاني",
        credits: 3,
        professor: "د. سارة محمد",
        department: "الإعلام الآلي",
        averageRating: 4.2,
        totalReviews: 18,
        difficulty: "متوسطة",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "الذكاء الاصطناعي",
        code: "INF401",
        description: "مادة متقدمة تغطي مفاهيم الذكاء الاصطناعي، التعلم الآلي، الشبكات العصبية، ومعالجة اللغات الطبيعية.",
        level: "ماستر 1",
        semester: "الأول",
        credits: 5,
        professor: "د. محمد العلمي",
        department: "الإعلام الآلي",
        averageRating: 4.8,
        totalReviews: 12,
        difficulty: "صعبة",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "شبكات الحاسوب",
        code: "INF301",
        description: "مادة تدرس أساسيات شبكات الحاسوب، بروتوكولات الاتصال، TCP/IP، وأمن الشبكات.",
        level: "ليسنس 3",
        semester: "الأول",
        credits: 4,
        professor: "د. يوسف القاسمي",
        department: "الإعلام الآلي",
        averageRating: 3.9,
        totalReviews: 15,
        difficulty: "متوسطة",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "تطوير تطبيقات الويب",
        code: "INF302",
        description: "مادة تركز على تطوير تطبيقات الويب باستخدام HTML، CSS، JavaScript، ولغات الخادم مثل PHP.",
        level: "ليسنس 3",
        semester: "الثاني",
        credits: 4,
        professor: "د. فاطمة الزهراء",
        department: "الإعلام الآلي",
        averageRating: 4.7,
        totalReviews: 22,
        difficulty: "متوسطة",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

db.subjects.insertMany(subjects);

print("✅ تمت تهيئة قاعدة البيانات بنجاح!");