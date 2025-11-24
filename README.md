# Expense Tracker – Mini Budget App

## Project Description

This is a simple **Expense Tracker** built with **HTML, CSS, and JavaScript**.  
It lets you add, edit, delete, and view your daily expenses in a clean table.  
You can also filter by category, sort your expenses, and see a small chart that shows how much you spent in each category.

The goal of this project is to practice core JavaScript skills like:

- Working with objects and arrays
- Using `map`, `filter`, `find`, and `reduce`
- DOM manipulation (updating the page with JavaScript)
- Basic data visualization with the `<canvas>` element

---

## Features

- Add a new expense with:
  - `title`
  - `amount`
  - `category`
  - `date` (defaults to today if empty)
- Validation:
  - Title is required
  - Amount must be a positive number
- Delete an expense
- Edit an existing expense (enter "edit mode" and then save changes)
- Filter expenses by category (Food, Transport, Shopping, Bills, Other, or All)
- Sort expenses:
  - Date (Newest First)
  - Date (Oldest First)
  - Amount (High → Low)
  - Amount (Low → High)
- Show **total expenses** for the currently visible list
- Show **highest expense** in the currently visible list
- Uses array methods:
  - `map`
  - `filter`
  - `find`
  - `forEach`
  - `reduce`
- Uses the **spread operator** (`...`) and object **destructuring**
- Simple bar chart (using `<canvas>`) that shows category totals (Food, Transport, Shopping, Bills, Other)

All data is stored **in memory only** (array in JavaScript). There is **no backend** and no database.

---

## How to Run the Project

1. Make sure you have these three files in the same folder:
   - `index.html`
   - `style.css`
   - `main.js`

2. Open the folder on your computer.

3. Double-click `index.html` to open it in your web browser  
   (or right-click → “Open with” → choose Chrome/Edge/Firefox).

4. You should now see the **Expense Tracker – Mini Budget App** page.

5. Start using the app:
   - Fill in the form at the top and click **Add** to create a new expense.
   - Use the **Filter by category** dropdown to filter.
   - Use the **Sort by** dropdown to change the order.
   - Click **Edit** to modify an expense, then **Save**.
   - Click **Delete** to remove an expense.
   - Watch the **total**, **highest**, and **chart** update automatically.


