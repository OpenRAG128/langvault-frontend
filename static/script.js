// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFile = document.getElementById('removeFile');
const languageInput = document.getElementById('language');
const languageSuggestions = document.getElementById('languageSuggestions');
const uploadForm = document.getElementById('uploadForm');
const submitBtn = document.getElementById('submitBtn');
const themeToggle = document.getElementById('themeToggle');
const copyTextBtn = document.getElementById('copyText');

// Language suggestions data
const languages = [
    { name: 'Spanish', flag: '🇪🇸' },
    { name: 'French', flag: '🇫🇷' },
    { name: 'German', flag: '🇩🇪' },
    { name: 'Italian', flag: '🇮🇹' },
    { name: 'Portuguese', flag: '🇵🇹' },
    { name: 'Japanese', flag: '🇯🇵' },
    { name: 'Korean', flag: '🇰🇷' },
    { name: 'Chinese', flag: '🇨🇳' },
    { name: 'Russian', flag: '🇷🇺' },
    { name: 'Arabic', flag: '🇸🇦' },
    { name: 'Hindi', flag: '🇮🇳' },
    { name: 'Dutch', flag: '🇳🇱' },
    { name: 'Swedish', flag: '🇸🇪' },
    { name: 'Norwegian', flag: '🇳🇴' },
    { name: 'Danish', flag: '🇩🇰' },
    { name: 'Finnish', flag: '🇫🇮' },
    { name: 'Polish', flag: '🇵🇱' },
    { name: 'Turkish', flag: '🇹🇷' },
    { name: 'Greek', flag: '🇬🇷' },
    { name: 'Hebrew', flag: '🇮🇱' }
];

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');
    
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeIcon.className = 'fas fa-sun';
    } else {
        body.classList.remove('light-theme');
        themeIcon.className = 'fas fa-moon';
    }
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');
    const isLight = body.classList.contains('light-theme');
    
    if (isLight) {
        body.classList.remove('light-theme');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
        showToast('Dark mode enabled', 'success');
    } else {
        body.classList.add('light-theme');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
        showToast('Light mode enabled', 'success');
    }
}

// File Upload Handlers
function initFileUpload() {
    const browseText = document.getElementById('browseText');

    // Handle click on drop zone
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // Handle click on 'browse files' span separately
    if (browseText) {
        browseText.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
    }

    // Drag and drop handlers
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Remove file button
    if (removeFile) {
        removeFile.addEventListener('click', (e) => {
            e.stopPropagation();
            clearFile();
        });
    }
}

function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/pdf') {
            displayFile(file);
            fileInput.files = files;
        } else {
            showToast('Please select a PDF file', 'error');
        }
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        displayFile(file);
    }
}

function displayFile(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    filePreview.style.display = 'block';
    dropZone.querySelector('.drop-zone-content').style.display = 'none';
}

function clearFile() {
    fileInput.value = '';
    filePreview.style.display = 'none';
    dropZone.querySelector('.drop-zone-content').style.display = 'block';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Language Suggestions
function initLanguageSuggestions() {
    languageInput.addEventListener('focus', showLanguageSuggestions);
    languageInput.addEventListener('input', filterLanguageSuggestions);
    languageInput.addEventListener('blur', hideLanguageSuggestions);

    // Handle suggestion clicks
    languageSuggestions.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('suggestion-item')) {
            const language = e.target.dataset.lang;
            languageInput.value = language;
            hideLanguageSuggestions();
        }
    });
}

function showLanguageSuggestions() {
    populateLanguageSuggestions();
    languageSuggestions.classList.add('show');
}

function hideLanguageSuggestions() {
    setTimeout(() => {
        languageSuggestions.classList.remove('show');
    }, 150);
}

function filterLanguageSuggestions() {
    const query = languageInput.value.toLowerCase();
    const filteredLanguages = languages.filter(lang => 
        lang.name.toLowerCase().includes(query)
    );
    populateLanguageSuggestions(filteredLanguages);
}

function populateLanguageSuggestions(filteredLanguages = languages) {
    languageSuggestions.innerHTML = '';
    filteredLanguages.slice(0, 8).forEach(lang => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.dataset.lang = lang.name;
        item.innerHTML = `${lang.flag} ${lang.name}`;
        languageSuggestions.appendChild(item);
    });
}

// Form Submission
function initFormSubmission() {
    uploadForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const file = fileInput.files[0];
    const language = languageInput.value.trim();
    
    if (!file) {
        showToast('Please select a PDF file', 'error');
        return;
    }
    
    if (!language) {
        showToast('Please enter a target language', 'error');
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Submit form
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    
    fetch('/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(html => {
        // Replace page content with response
        document.documentElement.innerHTML = html;
        // Re-initialize after page update
        initializeApp();
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Translation failed. Please try again.', 'error');
        hideLoadingState();
    });
}

function showLoadingState() {
    const btnContent = submitBtn.querySelector('.btn-content');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnContent.style.display = 'none';
    btnLoader.style.display = 'flex';
    submitBtn.disabled = true;
    
    // Add progress animation
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    uploadForm.appendChild(progressBar);
    
    // Simulate progress
    let progress = 0;
    const progressFill = progressBar.querySelector('.progress-fill');
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) {
            progress = 90;
            clearInterval(progressInterval);
        }
        progressFill.style.width = progress + '%';
    }, 500);
}

function hideLoadingState() {
    const btnContent = submitBtn.querySelector('.btn-content');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const progressBar = document.querySelector('.progress-bar');
    
    if (btnContent && btnLoader) {
        btnContent.style.display = 'flex';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
    
    if (progressBar) {
        progressBar.remove();
    }
}

// Tab Functionality
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Copy to Clipboard
function initCopyFunction() {
    if (copyTextBtn) {
        copyTextBtn.addEventListener('click', copyTranslatedText);
    }
}

function copyTranslatedText() {
    const translatedText = document.querySelector('.translated-text');
    if (translatedText) {
        const text = translatedText.textContent || translatedText.innerText;
        
        navigator.clipboard.writeText(text).then(() => {
            showToast('Text copied to clipboard!', 'success');
            copyTextBtn.classList.add('copy-success');
            
            setTimeout(() => {
                copyTextBtn.classList.remove('copy-success');
            }, 600);
        }).catch(() => {
            showToast('Failed to copy text', 'error');
        });
    }
}

// Toast Notifications
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add loading animations
function addLoadingAnimations() {
    const animatedElements = document.querySelectorAll('.upload-card, .feature-card, .results-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + U to focus file upload
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            fileInput.click();
        }
        
        // Ctrl/Cmd + L to focus language input
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            languageInput.focus();
        }
        
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (fileInput.files[0] && languageInput.value.trim()) {
                uploadForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to close language suggestions
        if (e.key === 'Escape') {
            hideLanguageSuggestions();
        }
    });
}

// Initialize all functionality
function initializeApp() {
    initTheme();
    initFileUpload();
    initLanguageSuggestions();
    initFormSubmission();
    initTabs();
    initCopyFunction();
    initSmoothScrolling();
    addLoadingAnimations();
    initKeyboardShortcuts();
    
    // Event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Reinitialize when page content is dynamically updated
window.addEventListener('load', initializeApp);