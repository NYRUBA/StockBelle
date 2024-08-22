const adminInventory = JSON.parse(localStorage.getItem('inventory')) || [];
const adminSales = JSON.parse(localStorage.getItem('sales')) || [];
const stockRequests = JSON.parse(localStorage.getItem('stockRequests')) || [];

document.getElementById('adminAddItemBtn').addEventListener('click', addItem);
document.getElementById('adminItemQuantity').addEventListener('change', checkLowStock);

function saveData() {
    localStorage.setItem('inventory', JSON.stringify(adminInventory));
    localStorage.setItem('sales', JSON.stringify(adminSales));
    localStorage.setItem('stockRequests', JSON.stringify(stockRequests));
}

function loadData() {
    displayInventory();
    displaySalesLog();
    displayStockRequests();
    generateSalesReport();
    updateDashboard();
}

window.onload = loadData;

function addItem() {
    const name = document.getElementById('adminItemName').value.trim();
    const quantity = parseInt(document.getElementById('adminItemQuantity').value);
    const price = parseFloat(document.getElementById('adminItemPrice').value);

    if (!name || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
        alert('Invalid input.');
        return;
    }

    adminInventory.push({ name, quantity, price });
    displayInventory();
    saveData();
    updateDashboard();
}

function displayInventory() {
    const inventoryList = document.getElementById('adminInventoryList');
    inventoryList.innerHTML = '';

    adminInventory.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - Quantity: ${item.quantity} - Price: UGX ${item.price.toFixed(2)}`;

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

function displayStockRequests() {
    const requestList = document.getElementById('stockRequests');
    requestList.innerHTML = '';

    stockRequests.forEach((request, index) => {
        const requestItem = document.createElement('li');
        requestItem.textContent = `${request.name} - Quantity: ${request.quantity}`;
        requestList.appendChild(requestItem);
    });
}

function checkLowStock() {
    const item = adminInventory.find(item => item.quantity < 5);
    if (item) {
        alert('Low stock detected!');
    }
}

function generateSalesReport() {
    const salesChartCtx = document.getElementById('adminSalesChart').getContext('2d');

    const salesData = adminSales.reduce((acc, sale) => {
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
    const totalSales = adminSales.reduce((acc, sale) => acc + sale.price, 0);
    document.getElementById('adminTotalSales').textContent = totalSales.toFixed(2);

    const inventoryValue = adminInventory.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    document.getElementById('adminInventoryValue').textContent = inventoryValue.toFixed(2);
}

