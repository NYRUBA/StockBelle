// Mock user database for simplicity
const staffUsers = [
    { username: "staff1", password: "password1" },
    { username: "staff2", password: "password2" }
];

// Simulating staff login
function staffLogin(username, password) {
    const user = staffUsers.find(user => user.username === username && user.password === password);
    if (user) {
        alert('Login successful!');
        // Redirect to the staff dashboard (limited access)
        window.location.href = "staff-dashboard.html";
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

// Example function for staff to request more stock
function requestStock(itemName, requestedQuantity) {
    if (!itemName || requestedQuantity <= 0) {
        alert("Invalid item or quantity.");
        return;
    }

    const stockRequest = {
        itemName,
        requestedQuantity,
        date: new Date().toLocaleString(),
        staffMember: "staff1" // Assume this is the logged-in staff member
    };

    // Save the stock request (this could be sent to admin)
    localStorage.setItem('stockRequest', JSON.stringify(stockRequest));
    alert(`Stock request for ${itemName} submitted.`);
}

// Display available inventory for staff
function displayAvailableInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const inventoryList = document.getElementById('staffInventoryList');
    inventoryList.innerHTML = '';

    inventory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - Quantity: ${item.quantity} - Price: UGX ${item.price.toFixed(2)}`;
        inventoryList.appendChild(listItem);
    });
}

// Function to handle item sales by staff
function sellItem(index) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const sales = JSON.parse(localStorage.getItem('sales')) || [];

    if (inventory[index].quantity > 0) {
        inventory[index].quantity -= 1;
        sales.push({
            name: inventory[index].name,
            price: inventory[index].price,
            date: new Date().toLocaleString(),
            staffMember: "staff1" // Assume this is the logged-in staff member
        });

        // Update local storage
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('sales', JSON.stringify(sales));

        // Update UI
        displayAvailableInventory();
        alert('Item sold successfully!');
    } else {
        alert('Out of stock!');
    }
}

// Example usage for login
document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    staffLogin(username, password);
});

// Example usage for requesting stock
document.getElementById('requestStockBtn').addEventListener('click', () => {
    const itemName = document.getElementById('requestItemName').value;
    const requestedQuantity = parseInt(document.getElementById('requestQuantity').value);
    requestStock(itemName, requestedQuantity);
});

// Display inventory when the page loads
window.onload = displayAvailableInventory;
