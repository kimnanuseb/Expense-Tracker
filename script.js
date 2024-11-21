// DOM Elements
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const currencyInput = document.getElementById('currency');
const addExpenseButton = document.getElementById('addExpense');
const expenseList = document.getElementById('expenseList');
const totalDisplay = document.getElementById('total');
const expenseChart = document.getElementById('expenseChart');

// Initialize expenses array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Function to calculate total expenses
function calculateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalDisplay.textContent = `${currencyInput.value} ${total.toFixed(2)}`;
}

// Function to render expenses list
function renderExpenses() {
    expenseList.innerHTML = ''; // Clear current list

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        const date = new Date(expense.timestamp).toLocaleString(); // Format timestamp to readable date
        li.innerHTML = `
            ${expense.description} - ${currencyInput.value} ${expense.amount.toFixed(2)} <span>(${expense.category})</span> <span>${date}</span>
            <button onclick="deleteExpense(${index})">❌</button>
        `;
        expenseList.appendChild(li);
    });

    calculateTotal();
    renderChart();
}

// Function to add an expense
function addExpense() {
    const amount = parseFloat(amountInput.value);
    const description = descriptionInput.value.trim();
    const category = categoryInput.value.trim() || 'Other';
    const currency = currencyInput.value;

    if (!amount || !description) {
        alert('Please fill in both amount and description.');
        return;
    }

    const expense = { amount, description, category, timestamp: Date.now(), currency };
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

// Function to render the graph (Chart.js)
function renderChart() {
    const dailyData = groupExpensesByDate();

    const labels = Object.keys(dailyData);
    const values = Object.values(dailyData);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Expenses',
            data: values,
            backgroundColor: '#4caf50',
            borderColor: '#388e3c',
            borderWidth: 1
        }]
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Create chart
    new Chart(expenseChart, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
}

// Group expenses by date (Daily)
function groupExpensesByDate() {
    const grouped = {};
    expenses.forEach(expense => {
        const date = new Date(expense.timestamp).toLocaleDateString();
        if (!grouped[date]) {
            grouped[date] = 0;
        }
        grouped[date] += expense.amount;
    });
    return grouped;
}

// Event listener for adding expenses
addExpenseButton.addEventListener('click', addExpense);

// Initial render
renderExpenses();
