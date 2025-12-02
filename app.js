class ExpenseTracker {
    constructor() {
        this.expenses = this.loadExpenses();
        this.creditCards = this.loadCreditCards();
        this.currentFilter = 'all';
        this.currentCardFilter = 'all';
        this.initializeElements();
        this.attachEventListeners();
        this.setDefaultDate();
        this.updateCreditCardSelect();
        this.render();
    }

    initializeElements() {
        this.form = document.getElementById('expenseForm');
        this.amountInput = document.getElementById('amount');
        this.categorySelect = document.getElementById('category');
        this.descriptionInput = document.getElementById('description');
        this.dateInput = document.getElementById('date');
        this.creditCardSelect = document.getElementById('creditCard');
        this.installmentsInput = document.getElementById('installments');
        this.expensesList = document.getElementById('expensesList');
        this.totalAmount = document.getElementById('totalAmount');
        this.clearAllButton = document.getElementById('clearAll');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.cardFilterTabs = document.getElementById('cardFilterTabs');
        this.manageCreditCardsButton = document.getElementById('manageCreditCards');
        this.creditCardsModal = document.getElementById('creditCardsModal');
        this.closeModalButton = document.getElementById('closeModal');
        this.creditCardForm = document.getElementById('creditCardForm');
        this.cardsContainer = document.getElementById('cardsContainer');
        this.cardNameInput = document.getElementById('cardName');
        this.closingDayInput = document.getElementById('closingDay');
        this.isDefaultCheckbox = document.getElementById('isDefault');
    }

    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.clearAllButton.addEventListener('click', () => this.clearAll());
        
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleFilterChange(e));
        });

        this.manageCreditCardsButton.addEventListener('click', () => this.openCreditCardsModal());
        this.closeModalButton.addEventListener('click', () => this.closeCreditCardsModal());
        this.creditCardsModal.addEventListener('click', (e) => {
            if (e.target === this.creditCardsModal) {
                this.closeCreditCardsModal();
            }
        });

        this.creditCardForm.addEventListener('submit', (e) => this.handleCreditCardSubmit(e));
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        this.dateInput.value = today;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const amount = parseFloat(this.amountInput.value);
        const category = this.categorySelect.value;
        const description = this.descriptionInput.value || this.getCategoryLabel(this.categorySelect.value);
        const date = this.dateInput.value;
        const cardId = this.creditCardSelect.value || null;
        const installments = parseInt(this.installmentsInput.value) || 1;

        if (installments > 1 && cardId) {
            this.createInstallmentExpenses(amount, category, description, date, cardId, installments);
        } else {
            const expense = {
                id: Date.now(),
                amount: installments > 1 ? amount / installments : amount,
                category: category,
                description: description,
                date: date,
                cardId: cardId,
                createdAt: new Date().toISOString(),
                installmentInfo: installments > 1 ? {
                    total: installments,
                    current: 1,
                    parentId: Date.now()
                } : null
            };

            this.expenses.unshift(expense);
        }

        this.saveExpenses();
        this.render();
        this.resetForm();
    }

    createInstallmentExpenses(totalAmount, category, description, date, cardId, totalInstallments) {
        const installmentAmount = totalAmount / totalInstallments;
        const parentId = Date.now();
        const card = this.creditCards.find(c => c.id === cardId);
        
        if (!card) return;

        const firstDate = new Date(date);
        
        for (let i = 0; i < totalInstallments; i++) {
            let expenseDate;
            
            if (i === 0) {
                expenseDate = date;
            } else {
                const monthsToAdd = i;
                const targetDate = new Date(firstDate);
                targetDate.setMonth(targetDate.getMonth() + monthsToAdd);
                
                const closingDay = Math.min(card.closingDay + 1, this.getDaysInMonth(targetDate.getFullYear(), targetDate.getMonth() + 1));
                expenseDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), closingDay).toISOString().split('T')[0];
            }

            const expense = {
                id: parentId + i,
                amount: installmentAmount,
                category: category,
                description: `${description} (${i + 1}/${totalInstallments})`,
                date: expenseDate,
                cardId: cardId,
                createdAt: new Date().toISOString(),
                installmentInfo: {
                    total: totalInstallments,
                    current: i + 1,
                    parentId: parentId
                }
            };

            this.expenses.unshift(expense);
        }
    }

    getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
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
        this.updateCreditCardSelect();
        this.installmentsInput.value = 1;
        this.amountInput.focus();
    }

    handleFilterChange(e) {
        this.filterTabs.forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
    }

    handleCardFilterChange(e) {
        const cardTabs = document.querySelectorAll('.card-filter-tab');
        cardTabs.forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        this.currentCardFilter = e.target.dataset.card;
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
            
            let timeFilterPassed = false;
            switch(this.currentFilter) {
                case 'today':
                    timeFilterPassed = expenseDate >= today;
                    break;
                case 'week':
                    timeFilterPassed = expenseDate >= thisWeekStart;
                    break;
                case 'month':
                    timeFilterPassed = expenseDate >= thisMonthStart;
                    break;
                default:
                    timeFilterPassed = true;
            }

            if (!timeFilterPassed) return false;

            if (this.currentCardFilter === 'all') {
                return true;
            } else if (this.currentCardFilter === 'none') {
                return !expense.cardId;
            } else {
                return expense.cardId === this.currentCardFilter;
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
        this.renderCardFilters();
    }

    renderTotal() {
        const total = this.calculateTotal();
        this.totalAmount.textContent = this.formatCurrency(total);
    }

    renderCardFilters() {
        if (this.creditCards.length === 0) {
            this.cardFilterTabs.style.display = 'none';
            return;
        }

        this.cardFilterTabs.style.display = 'flex';

        let html = '<button class="card-filter-tab active" data-card="all">Todos</button>';
        html += '<button class="card-filter-tab" data-card="none">Sin tarjeta</button>';
        
        this.creditCards.forEach(card => {
            html += `<button class="card-filter-tab" data-card="${card.id}">${card.name}</button>`;
        });

        this.cardFilterTabs.innerHTML = html;

        const cardTabs = document.querySelectorAll('.card-filter-tab');
        cardTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleCardFilterChange(e));
        });

        const activeCard = this.cardFilterTabs.querySelector(`[data-card="${this.currentCardFilter}"]`);
        if (activeCard) {
            cardTabs.forEach(tab => tab.classList.remove('active'));
            activeCard.classList.add('active');
        }
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

        this.expensesList.innerHTML = filtered.map(expense => {
            const card = expense.cardId ? this.creditCards.find(c => c.id === expense.cardId) : null;
            const cardInfo = card ? `<span class="expense-card">💳 ${card.name}</span>` : '';
            const installmentInfo = expense.installmentInfo 
                ? `<span class="expense-installment">Cuota ${expense.installmentInfo.current}/${expense.installmentInfo.total}</span>` 
                : '';

            return `
                <div class="expense-item">
                    <div class="expense-icon">
                        ${this.getCategoryIcon(expense.category)}
                    </div>
                    <div class="expense-details">
                        <div class="expense-category">${this.getCategoryLabel(expense.category)}</div>
                        <div class="expense-description">${this.escapeHtml(expense.description)}</div>
                        <div class="expense-meta">
                            <span class="expense-date">${this.formatDate(expense.date)}</span>
                            ${cardInfo}
                            ${installmentInfo}
                        </div>
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
            `;
        }).join('');
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

    loadCreditCards() {
        try {
            const data = localStorage.getItem('creditCards');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading credit cards:', error);
            return [];
        }
    }

    saveCreditCards() {
        try {
            localStorage.setItem('creditCards', JSON.stringify(this.creditCards));
        } catch (error) {
            console.error('Error saving credit cards:', error);
            alert('No se pudieron guardar las tarjetas.');
        }
    }

    openCreditCardsModal() {
        this.creditCardsModal.style.display = 'flex';
        this.renderCreditCards();
    }

    closeCreditCardsModal() {
        this.creditCardsModal.style.display = 'none';
        this.creditCardForm.reset();
    }

    handleCreditCardSubmit(e) {
        e.preventDefault();

        const name = this.cardNameInput.value.trim();
        const closingDay = parseInt(this.closingDayInput.value);
        const isDefault = this.isDefaultCheckbox.checked;

        if (closingDay < 1 || closingDay > 31) {
            alert('El día de cierre debe estar entre 1 y 31');
            return;
        }

        if (isDefault) {
            this.creditCards.forEach(card => card.isDefault = false);
        }

        const card = {
            id: Date.now().toString(),
            name: name,
            closingDay: closingDay,
            isDefault: isDefault
        };

        this.creditCards.push(card);
        this.saveCreditCards();
        this.creditCardForm.reset();
        this.renderCreditCards();
        this.updateCreditCardSelect();
        this.render();
    }

    renderCreditCards() {
        if (this.creditCards.length === 0) {
            this.cardsContainer.innerHTML = '<p class="empty-cards">No hay tarjetas registradas</p>';
            return;
        }

        this.cardsContainer.innerHTML = this.creditCards.map(card => `
            <div class="card-item">
                <div class="card-info">
                    <div class="card-name">
                        ${this.escapeHtml(card.name)}
                        ${card.isDefault ? '<span class="card-badge">Por defecto</span>' : ''}
                    </div>
                    <div class="card-closing">Cierre día ${card.closingDay}</div>
                </div>
                <div class="card-actions">
                    ${!card.isDefault ? `<button class="btn-card-action" onclick="tracker.setDefaultCard('${card.id}')" title="Establecer por defecto">⭐</button>` : ''}
                    <button class="btn-card-action delete" onclick="tracker.deleteCreditCard('${card.id}')" title="Eliminar">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    updateCreditCardSelect() {
        const selectedValue = this.creditCardSelect.value;
        
        let html = '<option value="">Sin tarjeta</option>';
        this.creditCards.forEach(card => {
            const selected = card.isDefault && !selectedValue ? 'selected' : '';
            html += `<option value="${card.id}" ${selected}>${card.name}</option>`;
        });

        this.creditCardSelect.innerHTML = html;
    }

    setDefaultCard(cardId) {
        this.creditCards.forEach(card => {
            card.isDefault = card.id === cardId;
        });
        this.saveCreditCards();
        this.renderCreditCards();
        this.updateCreditCardSelect();
    }

    deleteCreditCard(cardId) {
        if (confirm('¿Estás seguro de eliminar esta tarjeta? Los gastos asociados no se eliminarán.')) {
            this.creditCards = this.creditCards.filter(card => card.id !== cardId);
            this.saveCreditCards();
            this.renderCreditCards();
            this.updateCreditCardSelect();
            this.render();
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

    // Escape: Close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('creditCardsModal');
        if (modal && modal.style.display === 'flex') {
            tracker.closeCreditCardsModal();
        }
    }
});
