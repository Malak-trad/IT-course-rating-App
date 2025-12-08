// ملف admin.js
const API_BASE_URL = 'http://localhost:5000/api';
let currentAdmin = null;
let currentPage = 'dashboard';

// تهيئة لوحة التحكم
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    setupEventListeners();
    loadDashboardStats();
    loadRecentReviews();
});

// التحقق من مصادقة المسؤول
function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    
    if (!token || !adminData) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        currentAdmin = JSON.parse(adminData);
        if (currentAdmin.role !== 'admin') {
            window.location.href = 'index.html';
            return;
        }
        
        updateAdminInfo();
    } catch (error) {
        console.error('Error parsing admin data:', error);
        window.location.href = 'index.html';
    }
}

// تحديث معلومات المسؤول في الواجهة
function updateAdminInfo() {
    if (currentAdmin) {
        document.getElementById('adminName').textContent = currentAdmin.fullName;
        document.getElementById('adminRole').textContent = currentAdmin.role === 'admin' ? 'مسؤول' : 'مستخدم';
        document.getElementById('userAvatar').textContent = currentAdmin.fullName.charAt(0);
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // القائمة الجانبية
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.classList.contains('has-submenu')) {
                e.preventDefault();
                this.classList.toggle('active');
            } else {
                const page = this.dataset.page;
                if (page) {
                    switchPage(page);
                }
            }
        });
    });
    
    // زر تبديل الشريط الجانبي
    document.getElementById('toggleSidebar').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    // تسجيل الخروج
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // نموذج إضافة مستخدم
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewUser();
    });
    
    // نموذج إضافة مادة
    document.getElementById('addSubjectForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewSubject();
    });
    
    // البحث عن المستخدمين
    document.getElementById('userSearch').addEventListener('input', function() {
        debounce(loadUsers, 500)();
    });
    
    // البحث عن المواد
    document.getElementById('subjectSearch').addEventListener('input', function() {
        debounce(loadSubjects, 500)();
    });
}

// تبديل الصفحات
function switchPage(pageId) {
    // تحديث القائمة النشطة
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // إظهار الصفحة المطلوبة
    document.getElementById(pageId).classList.add('active');
    document.getElementById('pageTitle').textContent = getPageTitle(pageId);
    
    currentPage = pageId;
    
    // تحميل بيانات الصفحة
    switch (pageId) {
        case 'dashboard':
            loadDashboardStats();
            loadRecentReviews();
            break;
        case 'users':
            loadUsers();
            break;
        case 'subjects':
            loadSubjects();
            break;
        case 'pending-reviews':
            loadPendingReviews();
            break;
        case 'reported-reviews':
            loadReportedReviews();
            break;
        case 'reports':
            loadReports();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

// الحصول على عنوان الصفحة
function getPageTitle(pageId) {
    const titles = {
        'dashboard': 'لوحة التحكم',
        'users': 'إدارة المستخدمين',
        'subjects': 'إدارة المواد',
        'pending-reviews': 'التقييمات المعلقة',
        'reported-reviews': 'التقييمات المبلغ عنها',
        'reports': 'إدارة الإبلاغات',
        'analytics': 'التحليلات',
        'settings': 'الإعدادات'
    };
    
    return titles[pageId] || 'لوحة التحكم';
}

// الدوال المساعدة للـ API
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('adminToken');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
        
        if (response.status === 401) {
            // غير مصرح، تسجيل الخروج
            logout();
            return null;
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'حدث خطأ في الاتصال بالسيرفر');
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        showNotification('error', error.message);
        return null;
    }
}

// إظهار الإشعارات
function showNotification(type, message) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        text-align: center;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 500px;
        margin: 0 auto;
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    } else {
        notification.style.backgroundColor = '#3498db';
    }
    
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 5 ثوان
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    window.location.href = 'index.html';
}

// إحصائيات لوحة التحكم
async function loadDashboardStats() {
    const data = await apiRequest('/admin/stats');
    
    if (data) {
        document.getElementById('totalUsers').textContent = data.totals?.users || 0;
        document.getElementById('totalSubjects').textContent = data.totals?.subjects || 0;
        document.getElementById('totalReviews').textContent = data.totals?.reviews || 0;
        document.getElementById('totalReports').textContent = data.totals?.reports || 0;
    }
}

// التقييمات الحديثة
async function loadRecentReviews() {
    const data = await apiRequest('/reviews?limit=5&sort=-createdAt');
    
    if (data && data.reviews) {
        const tableBody = document.getElementById('recentReviewsTable');
        tableBody.innerHTML = '';
        
        data.reviews.forEach((review, index) => {
            const row = document.createElement('tr');
            
            const userName = review.user?.fullName || 'مستخدم مجهول';
            const userInitial = userName.charAt(0);
            const subjectName = review.subject?.name || 'مادة غير محددة';
            const status = review.isApproved ? 'مقبول' : 'معلق';
            const statusClass = review.isApproved ? 'active' : 'pending';
            
            const date = new Date(review.createdAt).toLocaleDateString('ar-EG');
            
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="user-avatar-small">${userInitial}</div>
                        <span>${userName}</span>
                    </div>
                </td>
                <td>${subjectName}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        ${generateStarsHTML(review.rating)}
                        <span>(${review.rating})</span>
                    </div>
                </td>
                <td><span class="status ${statusClass}">${status}</span></td>
                <td>${date}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm" onclick="viewReview('${review._id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteReview('${review._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
}

// توليد النجوم HTML
function generateStarsHTML(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star" style="color: #f39c12;"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt" style="color: #f39c12;"></i>';
        } else {
            stars += '<i class="far fa-star" style="color: #f39c12;"></i>';
        }
    }
    
    return stars;
}

// إدارة المستخدمين
let usersPage = 1;
const usersPerPage = 10;

async function loadUsers() {
    const search = document.getElementById('userSearch').value;
    
    const data = await apiRequest(`/admin/users?page=${usersPage}&limit=${usersPerPage}&search=${encodeURIComponent(search)}`);
    
    if (data && data.users) {
        const tableBody = document.getElementById('usersTable');
        tableBody.innerHTML = '';
        
        data.users.forEach((user, index) => {
            const row = document.createElement('tr');
            
            const userInitial = user.fullName.charAt(0);
            const status = user.isActive ? 'نشط' : 'غير نشط';
            const statusClass = user.isActive ? 'active' : 'inactive';
            const role = user.role === 'admin' ? 'مسؤول' : 'طالب';
            
            const date = new Date(user.createdAt).toLocaleDateString('ar-EG');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="user-avatar-small">${userInitial}</div>
                        <div>
                            <div>${user.fullName}</div>
                            <small style="color: #6c757d;">${user.studentId || 'بدون رقم'}</small>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>${user.level}</td>
                <td>${role}</td>
                <td><span class="status ${statusClass}">${status}</span></td>
                <td>${date}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm" onclick="viewUser('${user._id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="toggleUserStatus('${user._id}', ${!user.isActive})">
                            ${user.isActive ? '<i class="fas fa-ban"></i>' : '<i class="fas fa-check"></i>'}
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        document.getElementById('usersPage').textContent = usersPage;
    }
}

function nextUsersPage() {
    usersPage++;
    loadUsers();
}

function prevUsersPage() {
    if (usersPage > 1) {
        usersPage--;
        loadUsers();
    }
}

// إدارة المواد
let subjectsPage = 1;
const subjectsPerPage = 10;

async function loadSubjects() {
    const search = document.getElementById('subjectSearch').value;
    
    const data = await apiRequest(`/subjects?page=${subjectsPage}&limit=${subjectsPerPage}&search=${encodeURIComponent(search)}`);
    
    if (data && data.subjects) {
        const tableBody = document.getElementById('subjectsTable');
        tableBody.innerHTML = '';
        
        data.subjects.forEach((subject, index) => {
            const row = document.createElement('tr');
            
            const status = subject.isActive ? 'نشطة' : 'غير نشطة';
            const statusClass = subject.isActive ? 'active' : 'inactive';
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div>
                        <div>${subject.name}</div>
                        <small style="color: #6c757d;">${subject.professor}</small>
                    </div>
                </td>
                <td>${subject.code}</td>
                <td>${subject.level}</td>
                <td>${subject.semester}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        ${generateStarsHTML(subject.averageRating)}
                        <span>(${subject.averageRating.toFixed(1)})</span>
                    </div>
                </td>
                <td>${subject.totalReviews}</td>
                <td><span class="status ${statusClass}">${status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm" onclick="viewSubject('${subject._id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="editSubject('${subject._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteSubject('${subject._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        document.getElementById('subjectsPage').textContent = subjectsPage;
    }
}

function nextSubjectsPage() {
    subjectsPage++;
    loadSubjects();
}

function prevSubjectsPage() {
    if (subjectsPage > 1) {
        subjectsPage--;
        loadSubjects();
    }
}

// التقييمات المعلقة
async function loadPendingReviews() {
    const data = await apiRequest('/reviews?approved=false&limit=20');
    
    if (data && data.reviews) {
        const tableBody = document.getElementById('pendingReviewsTable');
        tableBody.innerHTML = '';
        
        data.reviews.forEach((review, index) => {
            const row = document.createElement('tr');
            
            const userName = review.user?.fullName || 'مستخدم مجهول';
            const subjectName = review.subject?.name || 'مادة غير محددة';
            const date = new Date(review.createdAt).toLocaleDateString('ar-EG');
            
            row.innerHTML = `
                <td>${userName}</td>
                <td>${subjectName}</td>
                <td>${review.title}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        ${generateStarsHTML(review.rating)}
                        <span>(${review.rating})</span>
                    </div>
                </td>
                <td>${review.difficulty}</td>
                <td>${date}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm" onclick="moderateReview('${review._id}')">
                            <i class="fas fa-gavel"></i> مراجعة
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
}

// التقييمات المبلغ عنها
async function loadReportedReviews() {
    const data = await apiRequest('/reviews?limit=20');
    
    if (data && data.reviews) {
        const tableBody = document.getElementById('reportedReviewsTable');
        tableBody.innerHTML = '';
        
        // تصفية التقييمات المبلغ عنها
        const reportedReviews = data.reviews.filter(review => review.reportsCount > 0);
        
        reportedReviews.forEach((review, index) => {
            const row = document.createElement('tr');
            
            const userName = review.user?.fullName || 'مستخدم مجهول';
            const subjectName = review.subject?.name || 'مادة غير محددة';
            const date = new Date(review.createdAt).toLocaleDateString('ar-EG');
            const lastReport = review.reports && review.reports.length > 0 
                ? new Date(review.reports[review.reports.length - 1].reportedAt).toLocaleDateString('ar-EG')
                : 'لا يوجد';
            
            row.innerHTML = `
                <td>${userName}</td>
                <td>${subjectName}</td>
                <td>${review.title}</td>
                <td>${review.reportsCount || 0}</td>
                <td>${lastReport}</td>
                <td>${date}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm" onclick="viewReviewReports('${review._id}')">
                            <i class="fas fa-flag"></i> تفاصيل
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
}

// الإبلاغات
async function loadReports() {
    const status = document.getElementById('reportStatusFilter').value;
    
    const data = await apiRequest(`/admin/reports${status ? `?status=${status}` : ''}`);
    
    if (data && data.reports) {
        const tableBody = document.getElementById('reportsTable');
        tableBody.innerHTML = '';
        
        data.reports.forEach((report, index) => {
            const row = document.createElement('tr');
            
            const reporterName = report.reporter?.fullName || 'مجهول';
            const reviewTitle = report.review?.title || 'تقييم محذوف';
            const reportDate = new Date(report.createdAt).toLocaleDateString('ar-EG');
            const resolvedDate = report.resolvedAt 
                ? new Date(report.resolvedAt).toLocaleDateString('ar-EG')
                : 'لم تحل بعد';
            
            row.innerHTML = `
                <td>${reporterName}</td>
                <td>${reviewTitle}</td>
                <td>${report.reason}</td>
                <td><span class="status ${report.status}">${report.status}</span></td>
                <td>${reportDate}</td>
                <td>${resolvedDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm" onclick="handleReport('${report._id}')">
                            <i class="fas fa-cog"></i> معالجة
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
}

// التحليلات
async function loadAnalytics() {
    // تحميل أعلى المواد تقييماً
    const data = await apiRequest('/subjects?sort=-averageRating&limit=10');
    
    if (data && data.subjects) {
        const tableBody = document.getElementById('topSubjectsTable');
        tableBody.innerHTML = '';
        
        data.subjects.forEach((subject, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${subject.name}</td>
                <td>${subject.level}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        ${generateStarsHTML(subject.averageRating)}
                        <span>(${subject.averageRating.toFixed(1)})</span>
                    </div>
                </td>
                <td>${subject.totalReviews}</td>
                <td>${subject.professor}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
}

// فتح وإغلاق النماذج
function showAddUserModal() {
    document.getElementById('addUserModal').classList.add('active');
}

function showAddSubjectModal() {
    document.getElementById('addSubjectModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// إضافة مستخدم جديد
async function addNewUser() {
    const userData = {
        fullName: document.getElementById('newUserName').value,
        email: document.getElementById('newUserEmail').value,
        password: document.getElementById('newUserPassword').value,
        level: document.getElementById('newUserLevel').value,
        role: document.getElementById('newUserRole').value
    };
    
    const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
    
    if (response) {
        showNotification('success', 'تم إضافة المستخدم بنجاح');
        closeModal('addUserModal');
        document.getElementById('addUserForm').reset();
        loadUsers();
    }
}

// إضافة مادة جديدة
async function addNewSubject() {
    const subjectData = {
        name: document.getElementById('newSubjectName').value,
        code: document.getElementById('newSubjectCode').value,
        description: document.getElementById('newSubjectDescription').value,
        level: document.getElementById('newSubjectLevel').value,
        semester: document.getElementById('newSubjectSemester').value,
        credits: parseInt(document.getElementById('newSubjectCredits').value),
        professor: document.getElementById('newSubjectProfessor').value,
        difficulty: document.getElementById('newSubjectDifficulty').value
    };
    
    const response = await apiRequest('/subjects', {
        method: 'POST',
        body: JSON.stringify(subjectData)
    });
    
    if (response) {
        showNotification('success', 'تم إضافة المادة بنجاح');
        closeModal('addSubjectModal');
        document.getElementById('addSubjectForm').reset();
        loadSubjects();
        loadDashboardStats();
    }
}

// معالجة التقييم
let currentReviewId = null;

async function moderateReview(reviewId) {
    currentReviewId = reviewId;
    
    const data = await apiRequest(`/reviews/${reviewId}`);
    
    if (data && data.review) {
        const review = data.review;
        const user = review.user;
        const subject = review.subject;
        
        document.getElementById('reviewDetails').innerHTML = `
            <div style="margin-bottom: 20px;">
                <h4>تفاصيل التقييم</h4>
                <p><strong>المستخدم:</strong> ${user?.fullName || 'مجهول'}</p>
                <p><strong>المادة:</strong> ${subject?.name || 'غير محددة'}</p>
                <p><strong>العنوان:</strong> ${review.title}</p>
                <p><strong>المحتوى:</strong> ${review.content}</p>
                <p><strong>التقييم:</strong> ${generateStarsHTML(review.rating)} (${review.rating}/5)</p>
                <p><strong>الصعوبة:</strong> ${review.difficulty}</p>
                <p><strong>التاريخ:</strong> ${new Date(review.createdAt).toLocaleDateString('ar-EG')}</p>
            </div>
        `;
        
        document.getElementById('reviewStatus').value = review.isApproved ? 'true' : 'false';
        document.getElementById('reviewFeatured').value = review.isFeatured ? 'true' : 'false';
        
        document.getElementById('reviewModal').classList.add('active');
    }
}

async function saveReviewStatus() {
    if (!currentReviewId) return;
    
    const statusData = {
        isApproved: document.getElementById('reviewStatus').value === 'true',
        isFeatured: document.getElementById('reviewFeatured').value === 'true'
    };
    
    const response = await apiRequest(`/admin/reviews/${currentReviewId}/moderate`, {
        method: 'PUT',
        body: JSON.stringify(statusData)
    });
    
    if (response) {
        showNotification('success', 'تم تحديث حالة التقييم بنجاح');
        closeModal('reviewModal');
        
        // تحديث الجداول
        loadRecentReviews();
        loadPendingReviews();
        loadReportedReviews();
    }
}

// معالجة الإبلاغ
let currentReportId = null;

async function handleReport(reportId) {
    currentReportId = reportId;
    
    const data = await apiRequest(`/admin/reports/${reportId}`);
    
    if (data && data.report) {
        const report = data.report;
        const reporter = report.reporter;
        const review = report.review;
        
        document.getElementById('reportDetails').innerHTML = `
            <div style="margin-bottom: 20px;">
                <h4>تفاصيل الإبلاغ</h4>
                <p><strong>المبلغ:</strong> ${reporter?.fullName || 'مجهول'}</p>
                <p><strong>التقييم المبلغ عنه:</strong> ${review?.title || 'تقييم محذوف'}</p>
                <p><strong>السبب:</strong> ${report.reason}</p>
                <p><strong>الوصف:</strong> ${report.description || 'لا يوجد وصف'}</p>
                <p><strong>تاريخ الإبلاغ:</strong> ${new Date(report.createdAt).toLocaleDateString('ar-EG')}</p>
            </div>
        `;
        
        document.getElementById('reportStatus').value = report.status;
        document.getElementById('reportAdminNotes').value = report.adminNotes || '';
        
        document.getElementById('reportModal').classList.add('active');
    }
}

async function saveReportStatus() {
    if (!currentReportId) return;
    
    const reportData = {
        status: document.getElementById('reportStatus').value,
        adminNotes: document.getElementById('reportAdminNotes').value
    };
    
    const response = await apiRequest(`/admin/reports/${currentReportId}/handle`, {
        method: 'PUT',
        body: JSON.stringify(reportData)
    });
    
    if (response) {
        showNotification('success', 'تم معالجة الإبلاغ بنجاح');
        closeModal('reportModal');
        loadReports();
    }
}

// دوال مساعدة
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// إضافة أنماط CSS للرسوم المتحركة
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);