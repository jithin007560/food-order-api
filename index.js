const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// Menu Items
const menu = [
    { id: 1, name: "Burger", price: 120 },
    { id: 2, name: "Pizza", price: 250 },
    { id: 3, name: "Shawarma", price: 150 },
    { id: 4, name: "Fried Rice", price: 180 },
    { id: 5, name: "Biriyani", price: 220 }
];

// Orders Storage
const orders = [];

// Get Menu
app.get("/menu", (req, res) => {
    res.json(menu);
});

// Place Order
app.post("/order", (req, res) => {

    const { itemId, quantity } = req.body;

    const item = menu.find(food => food.id === itemId);

    if (!item) {
        return res.status(404).json({
            error: "Food item not found"
        });
    }

    if (!quantity || quantity <= 0) {
        return res.status(400).json({
            error: "Invalid quantity"
        });
    }

    const order = {
        orderId: orders.length + 1,
        item: item.name,
        quantity,
        total: item.price * quantity,
        status: "Preparing"
    };

    orders.push(order);

    res.status(201).json(order);
});

// View Orders
app.get("/orders", (req, res) => {
    res.json(orders);
});

// Update Order Status
app.patch("/order/:id", (req, res) => {

    const orderId = Number(req.params.id);

    const order = orders.find(
        o => o.orderId === orderId
    );

    if (!order) {
        return res.status(404).json({
            error: "Order not found"
        });
    }

    order.status = req.body.status;

    res.json({
        message: "Order updated successfully",
        order
    });
});

// Delete Order
app.delete("/order/:id", (req, res) => {

    const orderId = Number(req.params.id);

    const index = orders.findIndex(
        o => o.orderId === orderId
    );

    if (index === -1) {
        return res.status(404).json({
            error: "Order not found"
        });
    }

    orders.splice(index, 1);

    res.json({
        message: "Order deleted successfully"
    });
});

// Start Server
app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});