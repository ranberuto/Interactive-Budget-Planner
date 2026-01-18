// Savings Goals Management System
let savingsGoals = [];
const SMART_TIPS = {
    'on-track': [
        {
            title: '🎯 Keep the Momentum',
            content: 'You\'re doing great! Continue with your current savings rate to stay on track. Consider setting up automatic transfers to maintain consistency.'
        },
        {
            title: '⬆️ Accelerate Your Progress',
            content: 'You\'re ahead of schedule! If possible, try to increase your monthly contribution to reach your goal even faster.'
        },
        {
            title: '💪 Maintain Discipline',
            content: 'Your progress shows discipline. Keep avoiding unnecessary expenses and reward yourself periodically with small treats from your discretionary fund.'
        },
        {
            title: '📈 Increase Income',
            content: 'Consider side hustles or freelancing to boost your savings rate. Even an extra ₱2,000-5,000 monthly can significantly reduce your goal timeline.'
        }
    ],
    'at-risk': [
        {
            title: '⚠️ Slightly Behind Schedule',
            content: 'You\'re falling a bit behind. Try to cut unnecessary expenses and redirect funds to this goal. Every peso counts!'
        },
        {
            title: '💰 Review Your Budget',
            content: 'Analyze your spending patterns. Are there categories where you can cut back? Even reducing entertainment or dining by ₱1,000/month helps.'
        },
        {
            title: '🎁 Prioritize This Goal',
            content: 'Consider temporarily reducing contributions to lower-priority goals and redirecting those funds here.'
        },
        {
            title: '🤝 Seek Support',
            content: 'Tell family or friends about your goal. Having accountability partners can motivate you to stay committed.'
        }
    ],
    'off-track': [
        {
            title: '🚨 Significant Delay',
            content: 'Your goal is significantly behind schedule. Consider adjusting your deadline or restructuring your savings plan.'
        },
        {
            title: '📊 Reassess Your Plan',
            content: 'Are your monthly savings realistic given your income? Consider setting a more achievable target amount or extending the deadline.'
        },
        {
            title: '💡 Find Extra Savings',
            content: 'Look for creative ways to earn more: sell unused items, negotiate bills, or take on part-time work to boost savings.'
        },
        {
            title: '✂️ Cut Non-Essential Spending',
            content: 'Temporarily pause subscriptions, reduce dining out, and minimize entertainment expenses. Every saved peso brings you closer to your goal.'
        },
        {
            title: '🎯 Break It Down',
            content: 'If the goal seems overwhelming, break it into smaller milestones. Celebrate each milestone to stay motivated.'
        }
    ],
    'completed': [
        {
            title: '🎉 Congratulations!',
            content: 'You\'ve achieved your goal! This is a major accomplishment. Take time to celebrate your financial discipline and dedication.'
        },
        {
            title: '🎁 Enjoy Your Success',
            content: 'You\'ve earned it! Spend your savings wisely and enjoy the fruits of your disciplined saving habits.'
        },
        {
            title: '🚀 Set a New Goal',
            content: 'Keep the momentum going! Set new savings goals to maintain your financial growth and security.'
        },
        {
            title: '📚 Share Your Story',
            content: 'Your success can inspire others. Share how you achieved this goal with friends and family.'
        }
    ]
};

// Load savings goals from localStorage
function loadSavingsGoals() {
    const saved = localStorage.getItem('savingsGoals');
    if (saved) {
        savingsGoals = JSON.parse(saved);
    } else {
        savingsGoals = [];
    }
}

// Save savings goals to localStorage
function saveSavingsGoalsToStorage() {
    localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
}

// Calculate goal status
function calculateGoalStatus(goal) {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const daysTotal = (deadline - new Date(goal.createdDate)) / (1000 * 60 * 60 * 24);
    const daysRemaining = (deadline - today) / (1000 * 60 * 60 * 24);
    const progressPercent = (goal.currentSaved / goal.targetAmount) * 100;
    
    // Calculate expected progress
    const expectedProgressPercent = Math.max(0, ((daysTotal - daysRemaining) / daysTotal) * 100);
    
    if (goal.currentSaved >= goal.targetAmount) {
        return { status: 'completed', icon: '🎉', color: '#4cc9f0' };
    } else if (daysRemaining <= 0) {
        return { status: 'off-track', icon: '❌', color: '#f72585' };
    } else if (progressPercent >= expectedProgressPercent - 5) {
        return { status: 'on-track', icon: '✅', color: '#4cc9f0' };
    } else if (progressPercent >= expectedProgressPercent - 20) {
        return { status: 'at-risk', icon: '⚠️', color: '#f8961e' };
    } else {
        return { status: 'off-track', icon: '❌', color: '#f72585' };
    }
}

// Get smart tips based on status
function getSmartTips(status) {
    const tips = SMART_TIPS[status] || [];
    // Shuffle and return a random tip
    return tips[Math.floor(Math.random() * tips.length)];
}

// Update overall summary
function updateOverallSummary() {
    let totalSaved = 0;
    let totalTarget = 0;
    
    savingsGoals.forEach(goal => {
        totalSaved += goal.currentSaved;
        totalTarget += goal.targetAmount;
    });
    
    const overallPercent = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
    const remaining = Math.max(0, totalTarget - totalSaved);
    
    document.getElementById('total-saved-amount').textContent = `₱${totalSaved.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('total-goal-target').textContent = `₱${totalTarget.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('overall-progress-pct').textContent = `${overallPercent}%`;
    document.getElementById('total-remaining-amount').textContent = `₱${remaining.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Render goals list
function renderGoalsList() {
    const goalsList = document.getElementById('goals-list');
    const filterStatus = document.getElementById('filter-status').value;
    const sortBy = document.getElementById('sort-goals').value;
    
    // Filter goals
    let filteredGoals = savingsGoals.slice();
    if (filterStatus) {
        filteredGoals = filteredGoals.filter(goal => {
            const status = calculateGoalStatus(goal);
            return status.status === filterStatus;
        });
    }
    
    // Sort goals
    filteredGoals.sort((a, b) => {
        switch (sortBy) {
            case 'deadline':
                return new Date(a.deadline) - new Date(b.deadline);
            case 'priority':
                const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'progress':
                return (b.currentSaved / b.targetAmount) - (a.currentSaved / a.targetAmount);
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });
    
    if (filteredGoals.length === 0) {
        goalsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-target"></i>
                <p>${filterStatus ? 'No goals found with this status.' : 'No savings goals yet. Create your first goal above!'}</p>
            </div>
        `;
        return;
    }
    
    goalsList.innerHTML = filteredGoals.map(goal => {
        const statusInfo = calculateGoalStatus(goal);
        const progressPercent = Math.round((goal.currentSaved / goal.targetAmount) * 100);
        const remaining = goal.targetAmount - goal.currentSaved;
        const daysRemaining = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        const monthlyNeeded = daysRemaining > 0 ? remaining / (daysRemaining / 30) : 0;
        
        return `
            <div class="goal-card status-${statusInfo.status}">
                <div class="goal-header">
                    <div class="goal-title-section">
                        <h4>${goal.name}</h4>
                        <span class="status-badge status-${statusInfo.status}">
                            ${statusInfo.icon} ${statusInfo.status.replace('-', ' ').toUpperCase()}
                        </span>
                    </div>
                    <div class="goal-actions">
                        <button class="btn-icon" onclick="editGoal('${goal.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="deleteGoal('${goal.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="goal-info">
                    <div class="info-row">
                        <span class="info-label"><i class="fas fa-tag"></i> Category:</span>
                        <span class="info-value">${goal.category}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label"><i class="fas fa-calendar"></i> Deadline:</span>
                        <span class="info-value">${formatDate(goal.deadline)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label"><i class="fas fa-flag"></i> Priority:</span>
                        <span class="info-value priority-${goal.priority}">${goal.priority} Priority</span>
                    </div>
                </div>
                
                <div class="goal-progress">
                    <div class="progress-header">
                        <span>₱${goal.currentSaved.toLocaleString('en-PH', { minimumFractionDigits: 2 })} / ₱${goal.targetAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                        <span class="progress-percent">${progressPercent}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(100, progressPercent)}%; background-color: ${statusInfo.color};"></div>
                    </div>
                </div>
                
                <div class="goal-stats">
                    <div class="stat">
                        <span class="stat-label">Remaining</span>
                        <span class="stat-value">₱${remaining.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Days Left</span>
                        <span class="stat-value">${Math.max(0, daysRemaining)}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Monthly Needed</span>
                        <span class="stat-value">₱${monthlyNeeded.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
                
                <div class="goal-actions-expanded">
                    <button class="btn btn-sm btn-primary" onclick="showAddSavingsModal('${goal.id}')">
                        <i class="fas fa-plus"></i> Add Savings
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="showSmartTips('${goal.id}')">
                        <i class="fas fa-lightbulb"></i> Get Tips
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-PH', options);
}

// Show smart tips modal
function showSmartTips(goalId) {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!goal) return;
    
    const statusInfo = calculateGoalStatus(goal);
    const tip = getSmartTips(statusInfo.status);
    
    const modalBody = document.getElementById('tips-modal-body');
    modalBody.innerHTML = `
        <div class="tips-content">
            <h3>${tip.title}</h3>
            <p>${tip.content}</p>
            <div class="tips-footer">
                <p><strong>Goal:</strong> ${goal.name}</p>
                <p><strong>Status:</strong> ${statusInfo.status.replace('-', ' ').toUpperCase()}</p>
            </div>
            <button class="btn btn-primary" onclick="closeModal()">Got it!</button>
        </div>
    `;
    
    document.getElementById('tips-modal').style.display = 'block';
}

// Show add savings modal
function showAddSavingsModal(goalId) {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!goal) return;
    
    const amount = prompt(`Add savings to "${goal.name}":\n\nCurrent: ₱${goal.currentSaved.toLocaleString('en-PH', { minimumFractionDigits: 2 })}\nTarget: ₱${goal.targetAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}\n\nAmount to add (₱):`, '0');
    
    if (amount !== null && amount !== '') {
        const addAmount = parseFloat(amount);
        if (!isNaN(addAmount) && addAmount >= 0) {
            goal.currentSaved += addAmount;
            goal.lastUpdated = new Date().toISOString();
            saveSavingsGoalsToStorage();
            updateOverallSummary();
            renderGoalsList();
            showAlert(`Added ₱${addAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} to "${goal.name}"!`, 'success');
        } else {
            showAlert('Please enter a valid amount', 'danger');
        }
    }
}

// Edit goal
function editGoal(goalId) {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!goal) return;
    
    // Fill form with goal data
    document.getElementById('goal-name').value = goal.name;
    document.getElementById('goal-target').value = goal.targetAmount;
    document.getElementById('goal-current').value = goal.currentSaved;
    document.getElementById('goal-deadline').value = goal.deadline;
    document.getElementById('goal-category').value = goal.category;
    document.getElementById('goal-priority').value = goal.priority;
    
    // Change button text
    const submitBtn = document.querySelector('#goal-form button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Goal';
    submitBtn.dataset.editId = goalId;
    
    // Scroll to form
    document.getElementById('goal-name').focus();
    document.querySelector('.goal-form-card').scrollIntoView({ behavior: 'smooth' });
    
    showAlert('Edit the goal details and click "Update Goal"', 'info');
}

// Delete goal
function deleteGoal(goalId) {
    if (confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
        savingsGoals = savingsGoals.filter(g => g.id !== goalId);
        saveSavingsGoalsToStorage();
        updateOverallSummary();
        renderGoalsList();
        showAlert('Goal deleted successfully!', 'success');
    }
}

// Close modal
function closeModal() {
    document.getElementById('tips-modal').style.display = 'none';
}

// Show alert
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 4000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadSavingsGoals();
    updateOverallSummary();
    renderGoalsList();
    setupEventListeners();
    
    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// Setup event listeners
function setupEventListeners() {
    // Goal form submission
    document.getElementById('goal-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('goal-name').value.trim();
        const target = parseFloat(document.getElementById('goal-target').value);
        const current = parseFloat(document.getElementById('goal-current').value) || 0;
        const deadline = document.getElementById('goal-deadline').value;
        const category = document.getElementById('goal-category').value;
        const priority = document.getElementById('goal-priority').value;
        const submitBtn = this.querySelector('button[type="submit"]');
        const isEdit = submitBtn.dataset.editId;
        
        // Validation
        if (!name) {
            showAlert('Please enter a goal name', 'danger');
            return;
        }
        
        if (isNaN(target) || target <= 0) {
            showAlert('Please enter a valid target amount greater than 0', 'danger');
            return;
        }
        
        if (current > target) {
            showAlert('Current amount cannot exceed target amount', 'danger');
            return;
        }
        
        if (!deadline) {
            showAlert('Please select a deadline', 'danger');
            return;
        }
        
        if (!category) {
            showAlert('Please select a category', 'danger');
            return;
        }
        
        if (isEdit) {
            // Update existing goal
            const goalIndex = savingsGoals.findIndex(g => g.id === isEdit);
            if (goalIndex !== -1) {
                savingsGoals[goalIndex] = {
                    ...savingsGoals[goalIndex],
                    name,
                    targetAmount: target,
                    currentSaved: current,
                    deadline,
                    category,
                    priority,
                    lastUpdated: new Date().toISOString()
                };
            }
            
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Create Goal';
            delete submitBtn.dataset.editId;
            
            showAlert('Goal updated successfully!', 'success');
        } else {
            // Create new goal
            const newGoal = {
                id: Date.now().toString(),
                name,
                targetAmount: target,
                currentSaved: current,
                deadline,
                category,
                priority,
                createdDate: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            
            savingsGoals.push(newGoal);
            showAlert('Goal created successfully!', 'success');
        }
        
        saveSavingsGoalsToStorage();
        updateOverallSummary();
        renderGoalsList();
        
        // Clear form
        this.reset();
        document.getElementById('goal-priority').value = 'Medium';
    });
    
    // Clear form button
    document.getElementById('clear-goal-form').addEventListener('click', function() {
        document.getElementById('goal-form').reset();
        document.getElementById('goal-priority').value = 'Medium';
        const submitBtn = document.querySelector('#goal-form button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Create Goal';
        delete submitBtn.dataset.editId;
    });
    
    // Filter and sort
    document.getElementById('filter-status').addEventListener('change', renderGoalsList);
    document.getElementById('sort-goals').addEventListener('change', renderGoalsList);
    
    // Modal close button
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    
    // Close modal on background click
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('tips-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Add CSS styles for savings goal page
const style = document.createElement('style');
style.textContent = `
    .savings-header {
        padding: 2rem 0;
        background: linear-gradient(135deg, #4361ee, #3a0ca3);
        color: white;
    }
    
    .savings-header h1 {
        color: white;
        margin-bottom: 0.5rem;
    }
    
    .savings-header .subtitle {
        opacity: 0.9;
        margin-bottom: 2rem;
    }
    
    .overall-summary {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        background: rgba(255, 255, 255, 0.1);
        padding: 2rem;
        border-radius: 12px;
        backdrop-filter: blur(10px);
    }
    
    @media (max-width: 768px) {
        .overall-summary {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    
    .summary-item {
        text-align: center;
    }
    
    .summary-label {
        display: block;
        opacity: 0.8;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }
    
    .summary-value {
        display: block;
        font-size: 1.75rem;
        font-weight: 700;
    }
    
    .savings-content {
        padding: 2rem 0;
    }
    
    .savings-grid {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 2rem;
    }
    
    @media (max-width: 992px) {
        .savings-grid {
            grid-template-columns: 1fr;
        }
    }
    
    .goal-form-card h3,
    .tips-card h3,
    .goals-controls h3 {
        margin-bottom: 1.5rem;
    }
    
    .quick-tips-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .quick-tip {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    
    .quick-tip:hover {
        background: #e9ecef;
        transform: translateX(5px);
    }
    
    .tip-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
    }
    
    .quick-tip strong {
        display: block;
        margin-bottom: 0.25rem;
    }
    
    .quick-tip p {
        font-size: 0.9rem;
        color: #6c757d;
        margin: 0;
    }
    
    .controls-group {
        display: flex;
        gap: 1rem;
    }
    
    .controls-group .form-control {
        flex: 1;
    }
    
    @media (max-width: 768px) {
        .controls-group {
            flex-direction: column;
        }
    }
    
    .goals-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .goal-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border-left: 4px solid #4361ee;
        transition: all 0.3s ease;
    }
    
    .goal-card:hover {
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        transform: translateY(-2px);
    }
    
    .goal-card.status-on-track {
        border-left-color: #4cc9f0;
    }
    
    .goal-card.status-at-risk {
        border-left-color: #f8961e;
    }
    
    .goal-card.status-off-track {
        border-left-color: #f72585;
    }
    
    .goal-card.status-completed {
        border-left-color: #06d6a0;
    }
    
    .goal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }
    
    .goal-title-section {
        flex: 1;
    }
    
    .goal-title-section h4 {
        margin: 0 0 0.5rem 0;
    }
    
    .status-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
    }
    
    .status-badge.status-on-track {
        background: rgba(76, 201, 240, 0.2);
        color: #0c5460;
    }
    
    .status-badge.status-at-risk {
        background: rgba(248, 150, 30, 0.2);
        color: #856404;
    }
    
    .status-badge.status-off-track {
        background: rgba(247, 37, 133, 0.2);
        color: #721c24;
    }
    
    .status-badge.status-completed {
        background: rgba(6, 214, 160, 0.2);
        color: #0c5460;
    }
    
    .goal-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .goal-info {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e9ecef;
    }
    
    @media (max-width: 768px) {
        .goal-info {
            grid-template-columns: 1fr;
        }
    }
    
    .info-row {
        display: flex;
        flex-direction: column;
    }
    
    .info-label {
        font-size: 0.85rem;
        color: #6c757d;
        margin-bottom: 0.25rem;
    }
    
    .info-value {
        font-weight: 600;
    }
    
    .priority-High {
        color: #f72585;
    }
    
    .priority-Medium {
        color: #f8961e;
    }
    
    .priority-Low {
        color: #06d6a0;
    }
    
    .goal-progress {
        margin-bottom: 1.5rem;
    }
    
    .progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-weight: 600;
    }
    
    .progress-percent {
        color: #4361ee;
    }
    
    .goal-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    @media (max-width: 768px) {
        .goal-stats {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
        }
    }
    
    .stat {
        text-align: center;
    }
    
    .stat-label {
        display: block;
        font-size: 0.85rem;
        color: #6c757d;
        margin-bottom: 0.25rem;
    }
    
    .stat-value {
        display: block;
        font-size: 1.1rem;
        font-weight: 700;
        color: #4361ee;
    }
    
    .goal-actions-expanded {
        display: flex;
        gap: 0.75rem;
    }
    
    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: #6c757d;
    }
    
    .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    .modal {
        position: fixed;
        z-index: 2000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        background-color: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        position: relative;
    }
    
    .close-modal {
        position: absolute;
        right: 1rem;
        top: 1rem;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6c757d;
    }
    
    .close-modal:hover {
        color: #212529;
    }
    
    .tips-content h3 {
        color: #4361ee;
        margin-bottom: 1rem;
    }
    
    .tips-content p {
        margin-bottom: 1rem;
        line-height: 1.6;
    }
    
    .tips-footer {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin: 1.5rem 0;
        font-size: 0.95rem;
    }
    
    .tips-footer p {
        margin: 0.5rem 0;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
