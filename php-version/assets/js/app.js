/**
 * PaperCraft - Main JavaScript
 * Common functionality for all pages
 */

// ===== Toast Notifications =====
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.backgroundColor = type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#000';
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i data-lucide="${type === 'error' ? 'x-circle' : type === 'warning' ? 'alert-triangle' : 'check-circle'}" 
               style="width: 20px; height: 20px;"></i>
            <span>${message}</span>
        </div>
    `;
    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ===== Dropdown Toggle =====
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown.active').forEach(d => d.classList.remove('active'));
    }
});

// ===== Modal Functions =====
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ===== Form Helpers =====
function handleFormSubmit(formId, callback) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width: 16px; height: 16px;"></i> Processing...';
        lucide.createIcons();

        try {
            const formData = new FormData(form);
            await callback(formData);
        } catch (error) {
            showToast(error.message || 'An error occurred', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            lucide.createIcons();
        }
    });
}

// ===== API Helper =====
async function apiRequest(url, options = {}) {
    const defaults = {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
        }
    };

    const response = await fetch(url, { ...defaults, ...options });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Request failed');
    }

    return data;
}

// ===== Confirm Dialog =====
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// ===== Format Date =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ===== Format Currency =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// ===== Copy to Clipboard =====
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
}

// ===== Debounce =====
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

// ===== Local Storage Helpers =====
const storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('localStorage error:', e);
        }
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};

// ===== Loading State =====
function setLoading(element, loading = true) {
    if (loading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Add spin animation for loaders
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spin { animation: spin 1s linear infinite; }
    .loading { opacity: 0.6; pointer-events: none; }
`;
document.head.appendChild(style);
