let expenses = [];
let nextId = 1;
let editingId = null;

const form = document.getElementById("expense-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");

const filterCategory = document.getElementById("filter-category");
const sortBySelect = document.getElementById("sort-by");
const expenseTbody = document.getElementById("expense-tbody");
const totalExpenseSpan = document.getElementById("total-expense");
const highestExpenseSpan = document.getElementById("highest-expense");
const chartCanvas = document.getElementById("chart");
const ctx = chartCanvas.getContext("2d");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value || new Date().toISOString().slice(0, 10);

  if (!title || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid title and amount.");
    return;
  }

  if (editingId === null) {
    const newExpense = {
      id: nextId++,
      title,
      amount,
      category,
      date,
    };
    expenses = [...expenses, newExpense];
  } else {
    expenses = expenses.map(function (expense) {
      if (expense.id === editingId) {
        return {
          ...expense,
          title,
          amount,
          category,
          date,
        };
      }
      return expense;
    });
    editingId = null;
    submitBtn.textContent = "Add";
    cancelEditBtn.style.display = "none";
  }

  form.reset();
  renderExpenses();
});

cancelEditBtn.addEventListener("click", function () {
  editingId = null;
  submitBtn.textContent = "Add";
  cancelEditBtn.style.display = "none";
  form.reset();
});

filterCategory.addEventListener("change", renderExpenses);
sortBySelect.addEventListener("change", renderExpenses);

function deleteExpense(id) {
  expenses = expenses.filter(function (expense) {
    return expense.id !== id;
  });
  renderExpenses();
}

function startEditExpense(id) {
  const exp = expenses.find(function (expense) {
    return expense.id === id;
  });
  if (!exp) return;

  titleInput.value = exp.title;
  amountInput.value = exp.amount;
  categoryInput.value = exp.category;
  dateInput.value = exp.date;

  editingId = id;
  submitBtn.textContent = "Save";
  cancelEditBtn.style.display = "inline-block";
}

function renderExpenses() {
  const selectedCategory = filterCategory.value;
  const sortBy = sortBySelect.value;

  let filteredExpenses =
    selectedCategory === "All"
      ? expenses
      : expenses.filter(function (expense) {
          return expense.category === selectedCategory;
        });

  filteredExpenses = filteredExpenses.slice();

  if (sortBy === "date-newest") {
    filteredExpenses.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  } else if (sortBy === "date-oldest") {
    filteredExpenses.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date);
    });
  } else if (sortBy === "amount-high") {
    filteredExpenses.sort(function (a, b) {
      return b.amount - a.amount;
    });
  } else if (sortBy === "amount-low") {
    filteredExpenses.sort(function (a, b) {
      return a.amount - b.amount;
    });
  }

  expenseTbody.innerHTML = "";

  filteredExpenses.forEach(function (expense) {
    const { id, title, amount, category, date } = expense;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${title}</td>
      <td>$${amount.toFixed(2)}</td>
      <td>${category}</td>
      <td>${date}</td>
      <td>
        <button class="small-btn" data-action="edit" data-id="${id}">Edit</button>
        <button class="small-btn" data-action="delete" data-id="${id}">Delete</button>
      </td>
    `;
    expenseTbody.appendChild(tr);
  });

  expenseTbody.querySelectorAll("button.small-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = parseInt(btn.getAttribute("data-id"));
      const action = btn.getAttribute("data-action");
      if (action === "delete") {
        deleteExpense(id);
      } else if (action === "edit") {
        startEditExpense(id);
      }
    });
  });

  const total = filteredExpenses
    .map(function (expense) {
      return expense.amount;
    })
    .reduce(
      function (sum, value) {
        return sum + value;
      },
      0
    );
  totalExpenseSpan.textContent = "Total: $" + total.toFixed(2);

  if (filteredExpenses.length > 0) {
    const highest = filteredExpenses.reduce(function (max, expense) {
      return expense.amount > max.amount ? expense : max;
    });
    highestExpenseSpan.textContent =
      "Highest: $" +
      highest.amount.toFixed(2) +
      " (" +
      highest.title +
      ")";
  } else {
    highestExpenseSpan.textContent = "Highest: $0.00";
  }

  const bigExpense = filteredExpenses.find(function (expense) {
    return expense.amount > 1000;
  });

  drawChart(filteredExpenses);
}

function drawChart(expensesForChart) {
  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

  if (expensesForChart.length === 0) {
    ctx.font = "14px Arial";
    ctx.fillText("No data to display", 250, 110);
    return;
  }

  const categories = ["Food", "Transport", "Shopping", "Bills", "Other"];
  const totals = categories.map(function (cat) {
    return expensesForChart
      .filter(function (e) {
        return e.category === cat;
      })
      .map(function (e) {
        return e.amount;
      })
      .reduce(
        function (sum, value) {
          return sum + value;
        },
        0
      );
  });

  const maxTotal = Math.max.apply(null, totals) || 1;

  const padding = 30;
  const chartHeight = chartCanvas.height - padding * 2;
  const chartWidth = chartCanvas.width - padding * 2;
  const barWidth = (chartWidth / categories.length) * 0.6;
  const gap = (chartWidth / categories.length) * 0.4;

  ctx.font = "12px Arial";

  categories.forEach(function (cat, index) {
    const total = totals[index];
    const x = padding + index * (barWidth + gap);
    const barHeight = (total / maxTotal) * chartHeight;
    const y = chartCanvas.height - padding - barHeight;

    ctx.fillStyle = "#88aaff";
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "#000";
    ctx.fillText("$" + total.toFixed(0), x, y - 4);

    ctx.fillText(cat, x, chartCanvas.height - padding + 14);
  });
}

renderExpenses();
