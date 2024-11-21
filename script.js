// DOM Elements
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const addExpenseButton = document.getElementById('addExpense');
const expenseList = document.getElementById('expenseList');
const totalDisplay = document.getElementById('total');

// Initialize expenses array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Function to calculate total expenses
function calculateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalDisplay.textContent = total.toFixed(2);
}

// Function to render expenses list
function renderExpenses() {
    expenseList.innerHTML = ''; // Clear current list

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.description} - $${expense.amount.toFixed(2)} <span>(${expense.category})</span>
            <button onclick="deleteExpense(${index})">❌</button>
        `;
        expenseList.appendChild(li);
    });

    calculateTotal();
}

// Function to add an expense
function addExpense() {
    const amount = parseFloat(amountInput.value);
    const description = descriptionInput.value.trim();
    const category = categoryInput.value;

    if (!amount || !description) {
        alert('Please fill in both amount and description.');
        return;
    }

    const expense = { amount, description, category };
    expenses.push(expense);

    // Save to localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Clear inputs
    amountInput.value = '';
    descriptionInput.value = '';
    categoryInput.value = 'Food';

    renderExpenses();
}

// Function to delete an expense
function deleteExpense(index) {
    expenses.splice(index, 1);

    // Update localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    renderExpenses();
}

// Event listener for adding expenses
addExpenseButton.addEventListener('click', addExpense);

// Initial render
renderExpenses();
