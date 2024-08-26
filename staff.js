
const inventory = [];
const sales = [];

document.getElementById('addItemBtn').addEventListener('click', addItem);

//Save inventory and sales data to local storage
function saveData() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('sales', JSON.stringify(sales));
}

// Load inventory and sales data from localStorage
function loadData() {
    const storedInventory = localStorage.getItem('inventory');
    const storedSales = localStorage.getItem('sales');

    if (storedInventory) {
        inventory.push(...JSON.parse(storedInventory));
    }
    if (storedSales) {
        sales.push(...JSON.parse(storedSales));
    }

    displayInventory();
    displaySalesLog();
    updateDashboard();
}

// Run loadData, GenerateSalesReport and updateDashboard when the page loads to retrieve saved data
window.onload = function(){
    loadData();
    generateSalesReport();
    updateDashboard();
};

function addItem() {
    const name = document.getElementById('itemName').value.trim;
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const price = parseFloat(document.getElementById('itemPrice').value);

   // Input validation
   if (!name) {
    alert('Item name is required.');
    return;
}
if (isNaN(quantity) || quantity <= 0) {
    alert('Quantity must be a positive number.');
    return;
}

if (isNaN(price) || price <= 0) {
    alert('Price must be a positive number.');
    return;
}

inventory.push({ name, quantity, price });
displayInventory();
saveData();
updateDashboard();
}

function displayInventory() {
    const inventoryList = document.getElementById('inventoryList');
    inventoryList.innerHTML = '';

    inventory.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - Quantity: ${item.quantity} - Price: UGX ${item.price.toFixed(2)}`;

// Check if stock is low
        if (item.quantity < 5) {
            listItem.style.color = 'red';
            listItem.textContent += ' (Low Stock!)';
        }

        const sellButton = document.createElement('button');
        sellButton.textContent = 'Sell';
        sellButton.addEventListener('click', () => sellItem(index));
        listItem.appendChild(sellButton);

        inventoryList.appendChild(listItem);
    });
}

function generateSalesReport() {
    const salesChartCtx = document.getElementById('salesChart').getContext('2d');

    const salesData = sales.reduce((acc, sale) => {
        acc.labels.push(sale.name);
        acc.data.push(sale.price);
        return acc;
    }, { labels: [], data: [] });

    new Chart(salesChartCtx, {
        type: 'bar',
        data: {
            labels: salesData.labels,
            datasets: [{
                label: 'Sales (UGX)',
                data: salesData.data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateDashboard() {
    // Calculate total sales
    const totalSales = sales.reduce((acc, sale) => acc + sale.price, 0);
    document.getElementById('totalSales').textContent = totalSales.toFixed(2);

    // Calculate current inventory value
    const inventoryValue = inventory.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    document.getElementById('inventoryValue').textContent = inventoryValue.toFixed(2);
}

function sellItem(index) {
    if (inventory[index].quantity > 0) {
        inventory[index].quantity -= 1;
        sales.push({
            name: inventory[index].name,
            price: inventory[index].price,
            date: new Date().toLocaleString()
        });
        displayInventory();
        displaySalesLog();
        saveData();
        generateSalesReport();
        updateDashboard();
    } else {
        alert('Out of stock!');
    }
    
}

function displaySalesLog() {
    const salesLog = document.getElementById('salesLog');
    salesLog.innerHTML = '';

    sales.forEach(sale => {
        const logItem = document.createElement('li');
        logItem.textContent = `Sold: ${sale.name} - Price: UGX ${sale.price.toFixed(2)} - Date: ${sale.date}`;
        salesLog.appendChild(logItem);
    });
}