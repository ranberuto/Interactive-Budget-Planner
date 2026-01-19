const sampleBudgetData = {
    income: 150000,
    expenses: [
        { category: 'Housing', amount: 35000 },
        { category: 'Food', amount: 18500 },
        { category: 'Utilities', amount: 8750 },
        { category: 'Transport', amount: 15000 },
        { category: 'Entertainment', amount: 10250 }
    ],
    monthlyTrend: {
        months: ['August', 'September', 'October', 'November', 'December', 'January'],
        income: [150000, 150000, 150000, 150000, 150000, 150000],
        expenses: [85000, 87500, 89000, 84500, 86750, 87500]
    }
};

function initializeCharts() {
    const expenseCtx = document.getElementById('expenseChart');
    if (expenseCtx) {
        new Chart(expenseCtx, {
            type: 'doughnut',
            data: {
                labels: sampleBudgetData.expenses.map(e => e.category),
                datasets: [{
                    data: sampleBudgetData.expenses.map(e => e.amount),
                    backgroundColor: [
                        '#4cc9f0',
                        '#f8961e',
                        '#06d6a0',
                        '#ff7f0e',
                        '#667eea'
                    ],
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 600 },
                        bodyFont: { size: 13 },
                        borderColor: 'rgba(255,255,255,0.2)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.raw;
                                const percentage = Math.round((value / total) * 100);
                                return `₱${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    const monthlyCtx = document.getElementById('monthlyChart');
    if (monthlyCtx) {
        const totalExpenses = sampleBudgetData.expenses.reduce((sum, e) => sum + e.amount, 0);
        
        new Chart(monthlyCtx, {
            type: 'bar',
            data: {
                labels: ['Income', 'Expenses', 'Savings'],
                datasets: [{
                    label: 'Amount',
                    data: [sampleBudgetData.income, totalExpenses, sampleBudgetData.income - totalExpenses],
                    backgroundColor: [
                        '#4cc9f0',
                        '#f8961e',
                        '#06d6a0'
                    ],
                    borderColor: [
                        '#0ea5e9',
                        '#ff7f0e',
                        '#10b981'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBackgroundColor: [
                        '#0ea5e9',
                        '#ff7f0e',
                        '#10b981'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₱' + value.toLocaleString();
                            },
                            font: { size: 11, weight: 500 }
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.05)',
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 600 },
                        bodyFont: { size: 13 },
                        borderColor: 'rgba(255,255,255,0.2)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return '₱' + context.raw.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: sampleBudgetData.monthlyTrend.months,
                datasets: [{
                    label: 'Monthly Expenses',
                    data: sampleBudgetData.monthlyTrend.expenses,
                    borderColor: '#f8961e',
                    backgroundColor: 'rgba(248, 150, 30, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#f8961e',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7,
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₱' + (value / 1000).toFixed(0) + 'k';
                            },
                            font: { size: 11, weight: 500 }
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.05)',
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: { size: 12, weight: 600 },
                            color: '#4a5568',
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 600 },
                        bodyFont: { size: 13 },
                        borderColor: 'rgba(255,255,255,0.2)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return '₱' + context.raw.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    const areaCtx = document.getElementById('areaChart');
    if (areaCtx) {
        new Chart(areaCtx, {
            type: 'line',
            data: {
                labels: sampleBudgetData.monthlyTrend.months,
                datasets: [
                    {
                        label: 'Income',
                        data: sampleBudgetData.monthlyTrend.income,
                        borderColor: '#4cc9f0',
                        backgroundColor: 'rgba(76, 201, 240, 0.15)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#4cc9f0',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Expenses',
                        data: sampleBudgetData.monthlyTrend.expenses,
                        borderColor: '#f8961e',
                        backgroundColor: 'rgba(248, 150, 30, 0.15)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#f8961e',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₱' + (value / 1000).toFixed(0) + 'k';
                            },
                            font: { size: 11, weight: 500 }
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.05)',
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: { size: 12, weight: 600 },
                            color: '#4a5568',
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 600 },
                        bodyFont: { size: 13 },
                        borderColor: 'rgba(255,255,255,0.2)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ₱' + context.raw.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    const categoryCtx = document.getElementById('categoryComparisonChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'bar',
            data: {
                labels: sampleBudgetData.expenses.map(e => e.category),
                datasets: [{
                    label: 'Amount Spent',
                    data: sampleBudgetData.expenses.map(e => e.amount),
                    backgroundColor: [
                        '#4cc9f0',
                        '#f8961e',
                        '#06d6a0',
                        '#ff7f0e',
                        '#667eea'
                    ],
                    borderColor: [
                        '#0ea5e9',
                        '#ff7f0e',
                        '#10b981',
                        '#ff6f00',
                        '#5a3fa0'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBackgroundColor: [
                        '#0ea5e9',
                        '#ff7f0e',
                        '#10b981',
                        '#ff6f00',
                        '#5a3fa0'
                    ]
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₱' + value.toLocaleString();
                            },
                            font: { size: 11, weight: 500 }
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.05)',
                            drawBorder: false
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 600 },
                        bodyFont: { size: 13 },
                        borderColor: 'rgba(255,255,255,0.2)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return '₱' + context.raw.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Radar Chart for Financial Health Score
    const radarCtx = document.getElementById('radarChart');
    if (radarCtx) {
        new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['Income', 'Savings', 'Budget Control', 'Emergency Fund', 'Investment'],
                datasets: [{
                    label: 'Financial Health Score',
                    data: [85, 83, 79, 72, 68],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    hoverBackgroundColor: 'rgba(102, 126, 234, 0.3)',
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            font: { size: 11, weight: 500 }
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: { size: 12, weight: 600 },
                            color: '#4a5568',
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 600 },
                        bodyFont: { size: 13 },
                        borderColor: 'rgba(255,255,255,0.2)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw + '/100';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Savings Pie Chart
    const savingsPieCtx = document.getElementById('savingsPieChart');
    if (savingsPieCtx) {
        const totalExpenses = sampleBudgetData.expenses.reduce((sum, e) => sum + e.amount, 0);
        const savings = sampleBudgetData.income - totalExpenses;
        
        new Chart(savingsPieCtx, {
            type: 'pie',
            data: {
                labels: ['Savings', 'Expenses'],
                datasets: [{
                    data: [savings, totalExpenses],
                    backgroundColor: [
                        '#06d6a0',
                        '#f8961e'
                    ],
                    borderColor: [
                        '#10b981',
                        '#ff7f0e'
                    ],
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: { size: 12, weight: 600 },
                            color: '#4a5568',
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 600 },
                        bodyFont: { size: 13 },
                        borderColor: 'rgba(255,255,255,0.2)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.raw;
                                const percentage = Math.round((value / total) * 100);
                                return `₱${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

function updateCharts() {
    if (typeof Chart !== 'undefined') {
        initializeCharts();
    }
}

if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeCharts, 100);
    });

}
