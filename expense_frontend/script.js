const apiUrl = "http://localhost:8081/api/expenses";

const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");

// Load expenses
async function loadExpenses() {
    const response = await fetch(apiUrl);
    const expenses = await response.json();

    list.innerHTML = "";

    expenses.forEach(expense => {
        const li = document.createElement("li");
        li.textContent = `${expense.title} - ₹${expense.amount} (${expense.category})`;

        const btn = document.createElement("button");
        btn.textContent = "Delete";
        btn.onclick = () => deleteExpense(expense.id);

        li.appendChild(btn);
        list.appendChild(li);
    });
}

// Add expense
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const expense = {
        title: document.getElementById("title").value,
        amount: document.getElementById("amount").value,
        category: document.getElementById("category").value
    };

    await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(expense)
    });

    form.reset();
    loadExpenses();
});

// Delete expense
async function deleteExpense(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
    });
    loadExpenses();
}

// Initial load
loadExpenses();
