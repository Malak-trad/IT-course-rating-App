// script.js - Updated for University of Algiers Curriculum
document.addEventListener('DOMContentLoaded', function() {
    // University curriculum subject data (according to LMD system)
    const subjectsData = [
        // License 1 - Semester 1
        {
            id: 1,
            name: "Introduction to Programming",
            level: "L1",
            semester: "S1",
            specialization: "Common",
            description: "Basic programming concepts using Python. Variables, loops, conditionals, functions, and simple algorithms.",
            credits: 6,
            rating: 4.2,
            reviewsCount: 45,
            difficulty: "easy",
            professor: "Dr. Ahmed Boudiaf"
        },
        {
            id: 2,
            name: "Mathematics for Computer Science I",
            level: "L1",
            semester: "S1",
            specialization: "Common",
            description: "Linear algebra, sets, logic, and mathematical foundations for computer science.",
            credits: 6,
            rating: 3.8,
            reviewsCount: 38,
            difficulty: "medium",
            professor: "Prof. Karima Ziani"
        },
        {
            id: 3,
            name: "Digital Systems",
            level: "L1",
            semester: "S1",
            specialization: "Common",
            description: "Introduction to digital logic, Boolean algebra, combinational and sequential circuits.",
            credits: 5,
            rating: 4.0,
            reviewsCount: 32,
            difficulty: "medium",
            professor: "Dr. Omar Cherif"
        },
        // License 1 - Semester 2
        {
            id: 4,
            name: "Object-Oriented Programming",
            level: "L1",
            semester: "S2",
            specialization: "Common",
            description: "Java programming with OOP concepts: classes, objects, inheritance, polymorphism, and interfaces.",
            credits: 6,
            rating: 4.5,
            reviewsCount: 42,
            difficulty: "medium",
            professor: "Dr. Samira Mekki"
        },
        {
            id: 5,
            name: "Data Structures",
            level: "L1",
            semester: "S2",
            specialization: "Common",
            description: "Arrays, linked lists, stacks, queues, trees, and basic algorithms for data manipulation.",
            credits: 6,
            rating: 4.3,
            reviewsCount: 40,
            difficulty: "medium",
            professor: "Prof. Mustapha Benaissa"
        },
        // License 2 - Semester 3
        {
            id: 6,
            name: "Algorithms and Complexity",
            level: "L2",
            semester: "S3",
            specialization: "Common",
            description: "Algorithm design techniques, complexity analysis, sorting, searching, and graph algorithms.",
            credits: 6,
            rating: 4.7,
            reviewsCount: 36,
            difficulty: "hard",
            professor: "Dr. Leila Saadi"
        },
        {
            id: 7,
            name: "Database Systems I",
            level: "L2",
            semester: "S3",
            specialization: "Common",
            description: "Relational databases, ER modeling, SQL, normalization, and transaction management.",
            credits: 5,
            rating: 4.4,
            reviewsCount: 39,
            difficulty: "medium",
            professor: "Prof. Rachid Hamidi"
        },
        // License 2 - Semester 4
        {
            id: 8,
            name: "Computer Architecture",
            level: "L2",
            semester: "S4",
            specialization: "Common",
            description: "CPU design, memory hierarchy, I/O systems, assembly language, and performance evaluation.",
            credits: 5,
            rating: 4.1,
            reviewsCount: 33,
            difficulty: "hard",
            professor: "Dr. Yacine Bouhadada"
        },
        {
            id: 9,
            name: "Operating Systems",
            level: "L2",
            semester: "S4",
            specialization: "Common",
            description: "Process management, memory management, file systems, and concurrency.",
            credits: 5,
            rating: 4.6,
            reviewsCount: 37,
            difficulty: "hard",
            professor: "Prof. Salima Hacene"
        },
        // License 3 - Semester 5 (Common Core)
        {
            id: 10,
            name: "Software Engineering",
            level: "L3",
            semester: "S5",
            specialization: "Common",
            description: "Software development lifecycle, requirements analysis, design patterns, and project management.",
            credits: 6,
            rating: 4.5,
            reviewsCount: 28,
            difficulty: "medium",
            professor: "Dr. Farid Boudjema"
        },
        // License 3 - Semester 5 (Software Engineering Specialization)
        {
            id: 11,
            name: "Web Application Development",
            level: "L3",
            semester: "S5",
            specialization: "SE",
            description: "Full-stack web development with HTML/CSS, JavaScript, React, Node.js, and REST APIs.",
            credits: 5,
            rating: 4.8,
            reviewsCount: 25,
            difficulty: "medium",
            professor: "Dr. Nadia Kherroubi"
        },
        // License 3 - Semester 5 (Artificial Intelligence Specialization)
        {
            id: 12,
            name: "Introduction to Artificial Intelligence",
            level: "L3",
            semester: "S5",
            specialization: "AI",
            description: "AI fundamentals, search algorithms, knowledge representation, and expert systems.",
            credits: 5,
            rating: 4.9,
            reviewsCount: 22,
            difficulty: "hard",
            professor: "Prof. Amina Chaouki"
        },
        // License 3 - Semester 6
        {
            id: 13,
            name: "Final Year Project",
            level: "L3",
            semester: "S6",
            specialization: "Common",
            description: "Capstone project demonstrating comprehensive knowledge and skills acquired during the license program.",
            credits: 10,
            rating: 4.7,
            reviewsCount: 30,
            difficulty: "very-hard",
            professor: "Various Supervisors"
        },
        // Master 1 - Semester 1
        {
            id: 14,
            name: "Advanced Algorithms",
            level: "M1",
            semester: "S1",
            specialization: "Common",
            description: "Advanced algorithm design, parallel algorithms, NP-completeness, and approximation algorithms.",
            credits: 6,
            rating: 4.8,
            reviewsCount: 18,
            difficulty: "very-hard",
            professor: "Dr. Kamel Smail"
        },
        {
            id: 15,
            name: "Machine Learning",
            level: "M1",
            semester: "S1",
            specialization: "AI",
            description: "Supervised and unsupervised learning, neural networks, evaluation methods, and practical applications.",
            credits: 6,
            rating: 4.9,
            reviewsCount: 20,
            difficulty: "very-hard",
            professor: "Prof. Sarah Menacer"
        },
        // Master 1 - Semester 2
        {
            id: 16,
            name: "Distributed Systems",
            level: "M1",
            semester: "S2",
            specialization: "CN",
            description: "Distributed architectures, consistency models, replication, and fault tolerance.",
            credits: 6,
            rating: 4.6,
            reviewsCount: 15,
            difficulty: "hard",
            professor: "Dr. Bilal Tari"
        },
        // Master 2 - Semester 3
        {
            id: 17,
            name: "Deep Learning",
            level: "M2",
            semester: "S3",
            specialization: "AI",
            description: "Deep neural networks, CNN, RNN, transformers, and applications in computer vision and NLP.",
            credits: 6,
            rating: 5.0,
            reviewsCount: 12,
            difficulty: "very-hard",
            professor: "Prof. Hassan Zerrouki"
        },
        {
            id: 18,
            name: "Big Data Analytics",
            level: "M2",
            semester: "S3",
            specialization: "DS",
            description: "Hadoop, Spark, data streaming, NoSQL databases, and large-scale data processing techniques.",
            credits: 6,
            rating: 4.7,
            reviewsCount: 14,
            difficulty: "very-hard",
            professor: "Dr. Fatima Boudraa"
        },
        // Master 2 - Semester 4
        {
            id: 19,
            name: "Master Thesis",
            level: "M2",
            semester: "S4",
            specialization: "Common",
            description: "Research project contributing original knowledge to the field of computer science.",
            credits: 30,
            rating: 4.8,
            reviewsCount: 10,
            difficulty: "very-hard",
            professor: "Thesis Supervisor"
        }
    ];

    // Sample review data
    const reviewsData = [
        {
            id: 1,
            subjectId: 6,
            subjectName: "Algorithms and Complexity",
            userName: "Mohamed K.",
            userLevel: "L3",
            specialization: "SE",
            title: "Challenging but essential course",
            text: "This course is fundamental for any computer scientist. The material is dense but well-structured. I recommend practicing problems daily and forming study groups. The final exam was tough but fair.",
            rating: 5,
            resources: "Introduction to Algorithms (CLRS), MIT OpenCourseWare videos, LeetCode for practice",
            professorRating: 4,
            difficulty: "hard",
            date: "2024-01-15",
            weeklyHours: 6
        },
        {
            id: 2,
            subjectId: 11,
            subjectName: "Web Application Development",
            userName: "Sarah M.",
            userLevel: "L3",
            specialization: "SE",
            title: "Excellent practical course",
            text: "Very hands-on with modern technologies. The project component was particularly valuable. We built a full e-commerce site using MERN stack. The professor provided great feedback throughout.",
            rating: 5,
            resources: "MDN Web Docs, React documentation, freeCodeCamp tutorials",
            professorRating: 5,
            difficulty: "medium",
            date: "2024-02-20",
            weeklyHours: 4
        },
        {
            id: 3,
            subjectId: 15,
            subjectName: "Machine Learning",
            userName: "Ali R.",
            userLevel: "M1",
            specialization: "AI",
            title: "Transformative course",
            text: "This course changed how I view problem-solving. The mathematical foundations are heavy, but the applications are fascinating. The assignments were challenging but incredibly rewarding.",
            rating: 5,
            resources: "Andrew Ng's Coursera course, Pattern Recognition and Machine Learning (Bishop), Kaggle datasets",
            professorRating: 5,
            difficulty: "very-hard",
            date: "2024-03-10",
            weeklyHours: 8
        },
        {
            id: 4,
            subjectId: 7,
            subjectName: "Database Systems I",
            userName: "Fatima Z.",
            userLevel: "L2",
            specialization: "Common",
            title: "Solid foundation for databases",
            text: "Well-organized course that builds from simple to complex concepts. The labs with MySQL were particularly helpful. Make sure to do all the normalization exercises.",
            rating: 4,
            resources: "Database System Concepts (Silberschatz), W3Schools SQL tutorial, SQLZoo",
            professorRating: 4,
            difficulty: "medium",
            date: "2023-12-05",
            weeklyHours: 4
        },
        {
            id: 5,
            subjectId: 1,
            subjectName: "Introduction to Programming",
            userName: "Youssef A.",
            userLevel: "L1",
            specialization: "Common",
            title: "Perfect for beginners",
            text: "As someone with no prior programming experience, this course was exactly what I needed. The professor explains concepts clearly and provides plenty of examples. Start assignments early!",
            rating: 5,
            resources: "Python for Everybody (online book), Codecademy Python course, practice on HackerRank",
            professorRating: 5,
            difficulty: "easy",
            date: "2023-11-30",
            weeklyHours: 3
        }
    ];

    // DOM elements
    const subjectsContainer = document.getElementById('subjectsContainer');
    const reviewsContainer = document.getElementById('reviewsContainer');
    const levelFilter = document.getElementById('levelFilter');
    const semesterFilter = document.getElementById('semesterFilter');
    const sortFilter = document.getElementById('sortFilter');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const authModal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    const userMenu = document.getElementById('userMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const reviewForm = document.getElementById('reviewForm');
    const starRating = document.querySelector('.star-rating');
    const ratingValue = document.getElementById('ratingValue');
    const exploreBtn = document.getElementById('exploreBtn');
    const addReviewBtn = document.getElementById('addReviewBtn');
    const subjectSelect = document.getElementById('subjectSelect');

    // Application state
    let currentUser = null;
    let displayedSubjects = 6;
    let currentLevelFilter = 'all';
    let currentSemesterFilter = 'all';
    let currentSortFilter = 'rating';

    // Initialize application
    function initApp() {
        populateSubjectSelect();
        renderSubjects();
        renderReviews();
        setupEventListeners();
        checkAuthStatus();
    }

    // Populate subject select dropdown
    function populateSubjectSelect() {
        subjectSelect.innerHTML = '<option value="">-- Select a Subject --</option>';
        
        subjectsData.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = `${subject.name} (${subject.level} - ${subject.semester})`;
            subjectSelect.appendChild(option);
        });
    }

    // Display subjects
    function renderSubjects() {
        subjectsContainer.innerHTML = '';
        
        // Filter subjects
        let filteredSubjects = subjectsData;
        
        if (currentLevelFilter !== 'all') {
            filteredSubjects = filteredSubjects.filter(subject => subject.level === currentLevelFilter);
        }
        
        if (currentSemesterFilter !== 'all') {
            filteredSubjects = filteredSubjects.filter(subject => subject.semester === currentSemesterFilter);
        }
        
        // Sort subjects
        filteredSubjects.sort((a, b) => {
            if (currentSortFilter === 'rating') {
                return b.rating - a.rating;
            } else if (currentSortFilter === 'difficulty') {
                const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3, 'very-hard': 4 };
                return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
            } else if (currentSortFilter === 'name') {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });
        
        // Determine number of subjects to show
        const subjectsToShow = filteredSubjects.slice(0, displayedSubjects);
        
        // Create subject cards
        subjectsToShow.forEach(subject => {
            const subjectCard = createSubjectCard(subject);
            subjectsContainer.appendChild(subjectCard);
        });
        
        // Control "Load More" button visibility
        loadMoreBtn.style.display = displayedSubjects >= filteredSubjects.length ? 'none' : 'block';
    }

    // Create subject card
    function createSubjectCard(subject) {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.dataset.id = subject.id;
        
        // Generate stars
        const starsHtml = generateStars(subject.rating);
        
        // Get specialization full name
        const specializationNames = {
            'SE': 'Software Engineering',
            'AI': 'Artificial Intelligence',
            'CN': 'Computer Networks',
            'DS': 'Data Science',
            'Common': 'Common Core'
        };
        
        const specializationName = specializationNames[subject.specialization] || subject.specialization;
        
        card.innerHTML = `
            <div class="subject-header">
                <h3 class="subject-name">${subject.name}</h3>
                <div style="display: flex; flex-direction: column; gap: 5px; align-items: flex-end;">
                    <span class="subject-level">${subject.level} - ${subject.semester}</span>
                    <span style="background-color: rgba(26, 188, 156, 0.2); color: #1abc9c; padding: 3px 10px; border-radius: 15px; font-size: 0.8rem; font-weight: 500;">
                        ${specializationName}
                    </span>
                </div>
            </div>
            <div class="subject-body">
                <p class="subject-description">${subject.description}</p>
                <div class="subject-rating">
                    <div style="display: flex; align-items: center;">
                        <div class="rating-stars">${starsHtml}</div>
                        <span class="rating-value">${subject.rating}/5</span>
                        <span style="margin-left: 15px; color: #7f8c8d; font-size: 0.9rem;">
                            <i class="fas fa-user-graduate"></i> ${subject.professor}
                        </span>
                    </div>
                    <span style="background-color: rgba(52, 152, 219, 0.1); color: #3498db; padding: 3px 10px; border-radius: 15px; font-size: 0.8rem; font-weight: 600;">
                        ${subject.credits} ECTS
                    </span>
                </div>
                <div class="subject-meta">
                    <span><i class="far fa-comment"></i> ${subject.reviewsCount} reviews</span>
                    <span class="difficulty ${subject.difficulty}">
                        ${getDifficultyText(subject.difficulty)}
                    </span>
                </div>
            </div>
            <div class="subject-footer">
                <button class="btn btn-outline btn-sm view-reviews" data-id="${subject.id}">
                    <i class="fas fa-eye"></i> View Reviews
                </button>
                <button class="btn btn-primary btn-sm add-subject-review" data-id="${subject.id}">
                    <i class="fas fa-pencil-alt"></i> Add Review
                </button>
            </div>
        `;
        
        // Add event listeners to buttons
        const viewBtn = card.querySelector('.view-reviews');
        const addBtn = card.querySelector('.add-subject-review');
        
        viewBtn.addEventListener('click', function() {
            document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
            // In a real app, you might filter reviews by subject here
        });
        
        addBtn.addEventListener('click', function() {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            document.getElementById('addReview').scrollIntoView({ behavior: 'smooth' });
            subjectSelect.value = subject.id;
        });
        
        return card;
    }

    // Display reviews
    function renderReviews() {
        reviewsContainer.innerHTML = '';
        
        reviewsData.forEach(review => {
            const reviewCard = createReviewCard(review);
            reviewsContainer.appendChild(reviewCard);
        });
    }

    // Create review card
    function createReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'review-card';
        
        // Generate stars
        const starsHtml = generateStars(review.rating);
        const professorStarsHtml = generateStars(review.professorRating);
        
        // Get first letter of username
        const userInitial = review.userName.charAt(0);
        
        // Find subject for this review
        const subject = subjectsData.find(s => s.id === review.subjectId);
        const subjectName = subject ? subject.name : review.subjectName;
        
        card.innerHTML = `
            <div class="review-header">
                <div class="review-user">
                    <div class="user-avatar">${userInitial}</div>
                    <div class="user-info">
                        <h4>${review.userName}</h4>
                        <span class="user-level">${review.userLevel} - ${review.specialization}</span>
                    </div>
                </div>
                <span class="review-subject">${subjectName}</span>
            </div>
            <div style="margin-bottom: 10px;">
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <span style="font-size: 0.9rem; color: #7f8c8d; margin-right: 10px;">Course:</span>
                    ${starsHtml}
                </div>
                <div style="display: flex; align-items: center;">
                    <span style="font-size: 0.9rem; color: #7f8c8d; margin-right: 10px;">Professor:</span>
                    ${professorStarsHtml}
                </div>
            </div>
            <h4 class="review-title">${review.title}</h4>
            <p class="review-text">${review.text}</p>
            ${review.resources ? `
                <div class="review-resources">
                    <div class="resources-title">Recommended Resources:</div>
                    <div style="font-size: 0.9rem;">${review.resources}</div>
                </div>
            ` : ''}
            <div class="review-footer">
                <span>${formatDate(review.date)} • ${review.weeklyHours} hrs/week</span>
                <span class="difficulty ${review.difficulty}">
                    ${getDifficultyText(review.difficulty)}
                </span>
            </div>
        `;
        
        return card;
    }

    // Generate stars for rating
    function generateStars(rating) {
        let starsHtml = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHtml += '<i class="fas fa-star" style="color: #f39c12;"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                starsHtml += '<i class="fas fa-star-half-alt" style="color: #f39c12;"></i>';
            } else {
                starsHtml += '<i class="far fa-star" style="color: #f39c12;"></i>';
            }
        }
        
        return starsHtml;
    }

    // Get difficulty text
    function getDifficultyText(difficulty) {
        const difficultyMap = {
            'easy': 'Easy',
            'medium': 'Medium',
            'hard': 'Hard',
            'very-hard': 'Very Hard'
        };
        
        return difficultyMap[difficulty] || difficulty;
    }

    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Filter subjects
        levelFilter.addEventListener('change', function() {
            currentLevelFilter = this.value;
            displayedSubjects = 6;
            renderSubjects();
        });
        
        semesterFilter.addEventListener('change', function() {
            currentSemesterFilter = this.value;
            displayedSubjects = 6;
            renderSubjects();
        });
        
        sortFilter.addEventListener('change', function() {
            currentSortFilter = this.value;
            renderSubjects();
        });
        
        // Load more button
        loadMoreBtn.addEventListener('click', function() {
            displayedSubjects += 6;
            renderSubjects();
        });
        
        // Authentication
        loginBtn.addEventListener('click', showLoginModal);
        registerBtn.addEventListener('click', showRegisterModal);
        closeModal.addEventListener('click', hideAuthModal);
        
        // Click outside modal to close
        window.addEventListener('click', function(e) {
            if (e.target === authModal) {
                hideAuthModal();
            }
        });
        
        // Switch between login and register forms
        document.querySelectorAll('.switch-auth').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.dataset.target;
                switchAuthForm(target);
            });
        });
        
        // Show/hide password
        const showLoginPassword = document.getElementById('showLoginPassword');
        if (showLoginPassword) {
            showLoginPassword.addEventListener('click', function() {
                const passwordField = document.getElementById('loginPassword');
                const type = passwordField.type === 'password' ? 'text' : 'password';
                passwordField.type = type;
                this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }
        
        // Social login buttons
        document.querySelectorAll('.btn-social.google').forEach(btn => {
            btn.addEventListener('click', function() {
                alert('University Google login would be implemented here');
            });
        });
        
        document.querySelectorAll('.btn-social.microsoft').forEach(btn => {
            btn.addEventListener('click', function() {
                alert('Office 365 login would be implemented here');
            });
        });
        
        // Login form
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
        
        // Register form
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
        
        // Logout
        logoutBtn.addEventListener('click', handleLogout);
        
        // Star rating
        const stars = starRating.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                setStarRating(rating);
            });
            
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.dataset.rating);
                highlightStars(rating);
            });
        });
        
        starRating.addEventListener('mouseleave', function() {
            const currentRating = parseInt(ratingValue.value);
            highlightStars(currentRating);
        });
        
        // Add new review
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddReview();
        });
        
        // Navigation
        exploreBtn.addEventListener('click', function() {
            document.getElementById('subjects').scrollIntoView({ behavior: 'smooth' });
        });
        
        addReviewBtn.addEventListener('click', function() {
            if (!currentUser) {
                showLoginModal();
                return;
            }
            document.getElementById('addReview').scrollIntoView({ behavior: 'smooth' });
        });
        
        // Mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Click on level card
        document.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', function() {
                const level = this.dataset.level;
                if (level === 'license') {
                    levelFilter.value = 'L1';
                    currentLevelFilter = 'L1';
                } else if (level === 'master') {
                    levelFilter.value = 'M1';
                    currentLevelFilter = 'M1';
                }
                displayedSubjects = 6;
                renderSubjects();
                document.getElementById('subjects').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Footer level links
        document.querySelectorAll('.footer-links a[data-filter]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const filter = this.dataset.filter;
                levelFilter.value = filter;
                currentLevelFilter = filter;
                displayedSubjects = 6;
                renderSubjects();
                document.getElementById('subjects').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // Check authentication status
    function checkAuthStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            updateUIForAuth();
        }
    }

    // Show login modal
    function showLoginModal() {
        authModal.classList.remove('hidden');
        switchAuthForm('login');
    }

    // Show register modal
    function showRegisterModal() {
        authModal.classList.remove('hidden');
        switchAuthForm('register');
    }

    // Hide auth modal
    function hideAuthModal() {
        authModal.classList.add('hidden');
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
        const showPasswordBtn = document.getElementById('showLoginPassword');
        if (showPasswordBtn) {
            showPasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
        const passwordField = document.getElementById('loginPassword');
        if (passwordField) {
            passwordField.type = 'password';
        }
    }

    // Switch between auth forms
    function switchAuthForm(formType) {
        const loginContainer = document.getElementById('loginFormContainer');
        const registerContainer = document.getElementById('registerFormContainer');
        const modalTitle = document.getElementById('modalTitle');
        
        if (formType === 'login') {
            loginContainer.classList.add('active');
            registerContainer.classList.remove('active');
            modalTitle.textContent = 'Welcome to EduRating';
        } else {
            registerContainer.classList.add('active');
            loginContainer.classList.remove('active');
            modalTitle.textContent = 'Create Student Account';
        }
        
        // Reset forms
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
        
        // Reset password visibility
        const showPasswordBtn = document.getElementById('showLoginPassword');
        if (showPasswordBtn) {
            showPasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
        const passwordField = document.getElementById('loginPassword');
        if (passwordField) {
            passwordField.type = 'password';
        }
    }

    // Handle login
    function handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Validate university email
        if (!email.includes('@univ-alger.dz') && !email.includes('@edu.univ-alger.dz')) {
            alert('Please use your university email address (@univ-alger.dz)');
            return;
        }
        
        // In a real app, this would be an API call
        // For demo, we'll simulate successful login
        currentUser = {
            firstName: "Demo",
            lastName: "User",
            studentId: "202300001",
            email: email,
            level: "L3",
            specialization: "SE",
            isAdmin: email === "admin@univ-alger.dz"
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUIForAuth();
        hideAuthModal();
        
        // Success notification
        alert(`Login successful! Welcome ${currentUser.firstName}`);
    }

    // Handle registration
    function handleRegister() {
        const firstName = document.getElementById('registerFirstName').value;
        const lastName = document.getElementById('registerLastName').value;
        const studentId = document.getElementById('registerStudentId').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const level = document.getElementById('registerLevel').value;
        const specialization = document.getElementById('registerSpecialization').value;
        
        // Validate university email
        if (!email.includes('@univ-alger.dz') && !email.includes('@edu.univ-alger.dz')) {
            alert('Please use your university email address (@univ-alger.dz or @edu.univ-alger.dz)');
            return;
        }
        
        // Check password match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Check password strength
        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }
        
        // Check student ID format (8 digits starting with year)
        if (!/^\d{8,9}$/.test(studentId)) {
            alert('Please enter a valid student ID (8-9 digits)');
            return;
        }
        
        // Check terms acceptance
        const acceptTerms = document.getElementById('acceptTerms');
        if (!acceptTerms.checked) {
            alert('Please accept the Terms of Service and Privacy Policy');
            return;
        }
        
        const acceptGuidelines = document.getElementById('acceptGuidelines');
        if (!acceptGuidelines.checked) {
            alert('Please agree to provide constructive and respectful reviews');
            return;
        }
        
        // In a real app, this would be an API call
        currentUser = {
            firstName: firstName,
            lastName: lastName,
            studentId: studentId,
            email: email,
            level: level,
            specialization: specialization || 'Not specified',
            isAdmin: false
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUIForAuth();
        hideAuthModal();
        
        // Success notification
        alert(`Account created successfully! Welcome ${firstName}. Please check your university email for verification.`);
    }

    // Update UI after authentication
    function updateUIForAuth() {
        const userName = currentUser.firstName + ' ' + currentUser.lastName;
        document.getElementById('userName').textContent = userName;
        document.querySelector('.auth-buttons').classList.add('hidden');
        userMenu.classList.remove('hidden');
        
        // Show admin options if user is admin
        if (currentUser.isAdmin) {
            document.querySelectorAll('.admin-only').forEach(el => {
                el.classList.remove('hidden');
            });
        }
    }

    // Handle logout
    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        
        document.querySelector('.auth-buttons').classList.remove('hidden');
        userMenu.classList.add('hidden');
        
        // Hide admin options
        document.querySelectorAll('.admin-only').forEach(el => {
            el.classList.add('hidden');
        });
        
        alert('Logged out successfully!');
    }

    // Set star rating
    function setStarRating(rating) {
        ratingValue.value = rating;
        highlightStars(rating);
    }

    // Highlight stars
    function highlightStars(rating) {
        const stars = starRating.querySelectorAll('i');
        stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            if (starRating <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
                star.style.color = '#f39c12';
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
                star.style.color = '#ddd';
            }
        });
    }

    // Handle adding review
    function handleAddReview() {
        if (!currentUser) {
            alert('Please login to add a review!');
            showLoginModal();
            return;
        }
        
        const subjectId = parseInt(subjectSelect.value);
        const rating = parseInt(ratingValue.value);
        const title = document.getElementById('reviewTitle').value;
        const text = document.getElementById('reviewText').value;
        const resources = document.getElementById('resources').value;
        const professorRating = parseInt(document.getElementById('professorRating').value);
        const difficulty = document.getElementById('difficulty').value;
        
        if (!subjectId || rating === 0) {
            alert('Please select a subject and give a star rating!');
            return;
        }
        
        // Get subject name
        const subject = subjectsData.find(s => s.id === subjectId);
        if (!subject) {
            alert('Invalid subject selected!');
            return;
        }
        
        // Create new review
        const newReview = {
            id: reviewsData.length + 1,
            subjectId: subjectId,
            subjectName: subject.name,
            userName: `${currentUser.firstName} ${currentUser.lastName.charAt(0)}.`,
            userLevel: currentUser.level,
            specialization: currentUser.specialization,
            title: title,
            text: text,
            rating: rating,
            resources: resources,
            professorRating: professorRating,
            difficulty: difficulty,
            date: new Date().toISOString().split('T')[0],
            weeklyHours: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : difficulty === 'hard' ? 6 : 8
        };
        
        // Add review to data
        reviewsData.unshift(newReview);
        
        // Update subject review count and rating
        if (subject) {
            subject.reviewsCount += 1;
            // Update average rating (simplified)
            subject.rating = ((subject.rating * (subject.reviewsCount - 1)) + rating) / subject.reviewsCount;
        }
        
        // Update UI
        renderReviews();
        renderSubjects();
        
        // Reset form
        reviewForm.reset();
        setStarRating(0);
        
        // Success notification
        alert('Thank you for sharing your review! It will help other students.');
        
        // Scroll to reviews section
        document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
    }

    // Start application
    initApp();
});