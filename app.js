class ExpenseTracker {
    constructor() {
        this.expenses = this.loadExpenses();
        this.currentFilter = 'all';
        this.initializeElements();
        this.attachEventListeners();
        this.setDefaultDate();
        this.render();
    }

    initializeElements() {
        this.form = document.getElementById('expenseForm');
        this.amountInput = document.getElementById('amount');
        this.categorySelect = document.getElementById('category');
        this.descriptionInput = document.getElementById('description');
        this.dateInput = document.getElementById('date');
        this.expensesList = document.getElementById('expensesList');
        this.totalAmount = document.getElementById('totalAmount');
        this.clearAllButton = document.getElementById('clearAll');
        this.filterTabs = document.querySelectorAll('.filter-tab');
    }

    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.clearAllButton.addEventListener('click', () => this.clearAll());
        
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleFilterChange(e));
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        this.dateInput.value = today;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const expense = {
            id: Date.now(),
            amount: parseFloat(this.amountInput.value),
            category: this.categorySelect.value,
            description: this.descriptionInput.value || this.getCategoryLabel(this.categorySelect.value),
            date: this.dateInput.value,
            createdAt: new Date().toISOString()
        };

        this.expenses.unshift(expense);
        this.saveExpenses();
        this.render();
        this.resetForm();
    }

    getCategoryLabel(category) {
        const labels = {
            'comida': 'Comida',
            'transporte': 'Transporte',
            'servicios': 'Servicios',
            'entretenimiento': 'Entretenimiento',
            'salud': 'Salud',
            'educacion': 'Educación',
            'compras': 'Compras',
            'hogar': 'Hogar',
            'otros': 'Otros'
        };
        return labels[category] || 'Gasto';
    }

    getCategoryIcon(category) {
        const icons = {
            'comida': '🍔',
            'transporte': '🚗',
            'servicios': '💡',
            'entretenimiento': '🎬',
            'salud': '⚕️',
            'educacion': '📚',
            'compras': '🛍️',
            'hogar': '🏠',
            'otros': '📌'
        };
        return icons[category] || '💰';
    }

    resetForm() {
        this.form.reset();
        this.setDefaultDate();
        this.amountInput.focus();
    }

    handleFilterChange(e) {
        this.filterTabs.forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
    }

    getFilteredExpenses() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        return this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            
            switch(this.currentFilter) {
                case 'today':
                    return expenseDate >= today;
                case 'week':
                    return expenseDate >= thisWeekStart;
                case 'month':
                    return expenseDate >= thisMonthStart;
                default:
                    return true;
            }
        });
    }

    calculateTotal() {
        const filtered = this.getFilteredExpenses();
        return filtered.reduce((sum, expense) => sum + expense.amount, 0);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const isToday = date.toDateString() === today.toDateString();
        const isYesterday = date.toDateString() === yesterday.toDateString();

        if (isToday) return 'Hoy';
        if (isYesterday) return 'Ayer';

        return date.toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    }

    deleteExpense(id) {
        if (confirm('¿Estás seguro de eliminar este gasto?')) {
            this.expenses = this.expenses.filter(expense => expense.id !== id);
            this.saveExpenses();
            this.render();
        }
    }

    clearAll() {
        if (this.expenses.length === 0) return;
        
        if (confirm('¿Estás seguro de eliminar todos los gastos? Esta acción no se puede deshacer.')) {
            this.expenses = [];
            this.saveExpenses();
            this.render();
        }
    }

    render() {
        this.renderTotal();
        this.renderExpenses();
    }

    renderTotal() {
        const total = this.calculateTotal();
        this.totalAmount.textContent = this.formatCurrency(total);
    }

    renderExpenses() {
        const filtered = this.getFilteredExpenses();

        if (filtered.length === 0) {
            this.expensesList.innerHTML = `
                <div class="empty-state">
                    <p>📝 No hay gastos registrados</p>
                    <p class="empty-state-hint">
                        ${this.currentFilter === 'all' 
                            ? 'Agrega tu primer gasto arriba' 
                            : 'No hay gastos en este período'}
                    </p>
                </div>
            `;
            return;
        }

        this.expensesList.innerHTML = filtered.map(expense => `
            <div class="expense-item">
                <div class="expense-icon">
                    ${this.getCategoryIcon(expense.category)}
                </div>
                <div class="expense-details">
                    <div class="expense-category">${this.getCategoryLabel(expense.category)}</div>
                    <div class="expense-description">${this.escapeHtml(expense.description)}</div>
                    <div class="expense-date">${this.formatDate(expense.date)}</div>
                </div>
                <div class="expense-amount">
                    ${this.formatCurrency(expense.amount)}
                </div>
                <div class="expense-actions">
                    <button class="btn-icon delete" onclick="tracker.deleteExpense(${expense.id})" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadExpenses() {
        try {
            const data = localStorage.getItem('expenses');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading expenses:', error);
            return [];
        }
    }

    saveExpenses() {
        try {
            localStorage.setItem('expenses', JSON.stringify(this.expenses));
        } catch (error) {
            console.error('Error saving expenses:', error);
            alert('No se pudieron guardar los datos. El almacenamiento local podría estar lleno.');
        }
    }
}

// Initialize the app when DOM is ready
let tracker;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        tracker = new ExpenseTracker();
    });
} else {
    tracker = new ExpenseTracker();
}

// Keyboard shortcuts for desktop
document.addEventListener('keydown', (e) => {
    // Alt/Option + N: Focus on amount input (new expense)
    if ((e.altKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.getElementById('amount').focus();
    }
});
