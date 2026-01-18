// Typing Animation for Home Page
if (document.getElementById('typing-animation')) {
    const typingText = "Take Control of Your Finances";
    const typingElement = document.getElementById('typing-animation');
    let i = 0;
    
    function typeWriter() {
        if (i < typingText.length) {
            typingElement.innerHTML += typingText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Start typing animation
    setTimeout(typeWriter, 500);
}

// Typing Animation for Dashboard
if (document.getElementById('dashboard-title-text')) {
    const dashboardTypingText = "Financial Dashboard";
    const dashboardTypingElement = document.getElementById('dashboard-title-text');
    let j = 0;
    
    function dashboardTypeWriter() {
        if (j < dashboardTypingText.length) {
            dashboardTypingElement.innerHTML += dashboardTypingText.charAt(j);
            j++;
            setTimeout(dashboardTypeWriter, 80);
        }
    }
    
    // Start typing animation
    setTimeout(dashboardTypeWriter, 300);
}

// Menu Toggle for Mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Budget Planner Logic
let budgetData = {
    income: 0,
    expenses: [],
    categories: ['Housing', 'Transportation', 'Food', 'Utilities', 'Healthcare', 'Entertainment', 'Education', 'Savings', 'Other']
};

// Local Storage Functions
function saveToLocalStorage() {
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('budgetData');
    if (saved) {
        budgetData = JSON.parse(saved);
        updateDashboard();
        if (document.getElementById('expense-list')) {
            renderExpenseList();
        }
    }
}

// Calculate Totals
function calculateTotals() {
    const totalExpenses = budgetData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netSavings = budgetData.income - totalExpenses;
    const savingsPercentage = budgetData.income > 0 ? (netSavings / budgetData.income * 100).toFixed(1) : 0;
    
    return {
        totalExpenses,
        netSavings,
        savingsPercentage
    };
}

// Update Dashboard Stats
function updateDashboard() {
    const totals = calculateTotals();
    
    // Update stats on home page
    const incomeStat = document.getElementById('income-stat');
    const expenseStat = document.getElementById('expense-stat');
    const savingsStat = document.getElementById('savings-stat');
    const budgetStat = document.getElementById('budget-stat');
    
    if (incomeStat) incomeStat.textContent = `$${budgetData.income.toLocaleString()}`;
    if (expenseStat) expenseStat.textContent = `$${totals.totalExpenses.toLocaleString()}`;
    if (savingsStat) savingsStat.textContent = `$${totals.netSavings.toLocaleString()}`;
    if (budgetStat) budgetStat.textContent = `${totals.savingsPercentage}%`;
    
    // Update charts if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        updateCharts();
    }
}

// Expense Management
function addExpense(name, amount, category) {
    const expense = {
        id: Date.now(),
        name,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString().split('T')[0]
    };
    
    budgetData.expenses.push(expense);
    saveToLocalStorage();
    updateDashboard();
    
    if (document.getElementById('expense-list')) {
        renderExpenseList();
    }
    
    showAlert('Expense added successfully!', 'success');
}

function removeExpense(id) {
    budgetData.expenses = budgetData.expenses.filter(expense => expense.id !== id);
    saveToLocalStorage();
    updateDashboard();
    
    if (document.getElementById('expense-list')) {
        renderExpenseList();
    }
    
    showAlert('Expense removed!', 'success');
}

function renderExpenseList() {
    const expenseList = document.getElementById('expense-list');
    if (!expenseList) return;
    
    expenseList.innerHTML = '';
    
    budgetData.expenses.forEach(expense => {
        const item = document.createElement('div');
        item.className = 'budget-item';
        item.innerHTML = `
            <div>
                <strong>${expense.name}</strong>
                <div style="color: var(--gray-color); font-size: 0.9rem;">
                    ${expense.category} • ${expense.date}
                </div>
            </div>
            <div class="item-actions">
                <span style="font-weight: 600; color: var(--danger-color);">
                    -$${expense.amount.toFixed(2)}
                </span>
                <button class="btn-icon" onclick="removeExpense(${expense.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        expenseList.appendChild(item);
    });
}

// Form Validation
function validateBudgetForm() {
    const incomeInput = document.getElementById('monthly-income');
    const expenseName = document.getElementById('expense-name');
    const expenseAmount = document.getElementById('expense-amount');
    
    let isValid = true;
    
    // Validate income
    if (incomeInput) {
        const income = parseFloat(incomeInput.value);
        if (isNaN(income) || income < 0) {
            showAlert('Please enter a valid monthly income', 'danger');
            isValid = false;
        } else {
            budgetData.income = income;
        }
    }
    
    // Validate expense form
    if (expenseName && expenseAmount) {
        const name = expenseName.value.trim();
        const amount = parseFloat(expenseAmount.value);
        
        if (!name || name.length < 2) {
            showAlert('Please enter a valid expense name (at least 2 characters)', 'danger');
            isValid = false;
        }
        
        if (isNaN(amount) || amount <= 0) {
            showAlert('Please enter a valid expense amount (greater than 0)', 'danger');
            isValid = false;
        }
        
        if (isValid) {
            const category = document.getElementById('expense-category').value;
            addExpense(name, amount, category);
            
            // Clear form
            expenseName.value = '';
            expenseAmount.value = '';
            expenseName.focus();
        }
    }
    
    return isValid;
}

// Alert System
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Contact Form Validation
function validateContactForm() {
    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');
    
    if (!name.value.trim()) {
        showAlert('Please enter your name', 'danger');
        name.focus();
        return false;
    }
    
    if (!email.value.trim() || !isValidEmail(email.value)) {
        showAlert('Please enter a valid email address', 'danger');
        email.focus();
        return false;
    }
    
    if (!message.value.trim() || message.value.length < 10) {
        showAlert('Please enter a message (at least 10 characters)', 'danger');
        message.focus();
        return false;
    }
    
    showAlert('Thank you for your message! We\'ll get back to you soon.', 'success');
    
    // In a real application, you would send the form data to a server here
    // For now, we'll just reset the form
    document.getElementById('contact-form').reset();
    
    return false; // Prevent actual form submission for demo
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    
    // Budget form submission
    const budgetForm = document.getElementById('budget-form');
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateBudgetForm();
        });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateContactForm();
        });
    }
    
    // Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});