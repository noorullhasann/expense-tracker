const apiUrl = "http://localhost:8081/api/expenses";

const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const totalDisplay = document.getElementById("total");
const filterInput = document.getElementById("filter");

let expensesCache = [];

async function loadExpenses() {
    const response = await fetch(apiUrl);
    expensesCache = await response.json();
    renderExpenses(expensesCache);
}

function renderExpenses(expenses) {
    list.innerHTML = "";
    let total = 0;

    expenses.forEach(expense => {
        total += Number(expense.amount);

        const li = document.createElement("li");
        li.textContent = `${expense.title} - ₹${expense.amount} (${expense.category})`;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editExpense(expense);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteExpense(expense.id);

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });

    totalDisplay.textContent = total;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("expenseId").value;

    const expense = {
        title: document.getElementById("title").value,
        amount: document.getElementById("amount").value,
        category: document.getElementById("category").value
    };

    if (id) {
        await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense)
        });
    } else {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense)
        });
    }

    form.reset();
    document.getElementById("expenseId").value = "";
    loadExpenses();
});

async function deleteExpense(id) {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    loadExpenses();
}

function editExpense(expense) {
    document.getElementById("expenseId").value = expense.id;
    document.getElementById("title").value = expense.title;
    document.getElementById("amount").value = expense.amount;
    document.getElementById("category").value = expense.category;
}

filterInput.addEventListener("input", () => {
    const keyword = filterInput.value.toLowerCase();
    const filtered = expensesCache.filter(e =>
        e.category.toLowerCase().includes(keyword)
    );
    renderExpenses(filtered);
});

loadExpenses();
