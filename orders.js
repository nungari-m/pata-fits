import { addOrder, getOrders, updateOrderStatus, deleteOrder, markSold, updateItem } from "./api.js";
import { validateOrder, calculateTotal } from "./validate.js";

const STATUSES = ["Pending", "Confirmed", "Ready", "Completed"];

const cartList = document.querySelector("#cart-list");
const cartTotal = document.querySelector("#cart-total");
const orderForm = document.querySelector("#order-form");
const orderList = document.querySelector("#order-list");
const orderMessage = document.querySelector("#order-message");

let cart = [];
let reloadItems = () => {};

function showOrderMessage(text, iserror = false) {
    orderMessage.textContent = text;
    orderMessage.className = iserror ? "error" : "success";
}

//---------Cart---
export function addToCart(item) {
    if (cart.some((i) => i.id === item.id)) {
        showOrderMessage("That item is already in your cart.", true);
        return;
    }
    cart.push(item);
    renderCart();
    showOrderMessage(item.name + " added to cart.");
}

function renderCart() {
    cartList.replaceChildren();

    cart.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - KSh ${item.price} `;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "secondary";
        removeBtn.addEventListener("click", () => {
            cart = cart.filter((i) => i.id !== item.id);
            renderCart();
        });
    
        li.append(removeBtn);
        cartList.append(li);
});

cartTotal.textContent = "Total: KSh " + calculateTotal(cart);
}

//---Place an Order---
orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(orderForm));
    const errors = validateOrder(data, cart);
    if (errors.length > 0) {
        showOrderMessage(errors.join(" "), true);
        return;
    }
    
const order = {
    customer: data.customer.trim(),
    phone: data.phone.trim(),
    itemIds: cart.map((i) => i.id),
    total: calculateTotal(cart),
    status: "Pending",
    date: new Date().toISOString(),
};

try {
    const savedOrder = await addOrder(order);
    if (savedOrder?.id == null) {
        throw new Error("The API did not return the created order.");
    }

    const results = await Promise.allSettled(cart.map((item) => markSold(item.id)));
    const soldItems = cart.filter((item, index) => results[index].status === "fulfilled");
    if (results.some((result) => result.status === "rejected")) {
        const rollbackResults = await Promise.allSettled([
            deleteOrder(savedOrder.id),
            ...soldItems.map((item) => updateItem(item.id, { ...item, sold: false })),
        ]);
        const rollbackFailed = rollbackResults.some((result) => result.status === "rejected");
        showOrderMessage(
            rollbackFailed
                ? "Order failed, and some changes could not be rolled back. Refresh and check the order and items."
                : "Could not mark all items sold. The order was cancelled.",
            true
        );
        await Promise.all([reloadItems(), loadOrders()]);
        return;
    }

    cart = [];
    renderCart();
    orderForm.reset();
    showOrderMessage("Order placed! Status: Pending.");
    await Promise.all([reloadItems(), loadOrders()]);
} catch (error) {
    showOrderMessage("Could not place order. Try again.", true);
}
});

//---Track orders-----
async function loadOrders() {
    orderList.textContent = "Loading orders...";
    try {
        const orders = await getOrders();
        if (!Array.isArray(orders)) {
            throw new Error("The orders API response was not a list.");
        }
        renderOrders(orders);
    } catch (error) {
        orderList.textContent = "Could not load orders. Check the API connection and try again.";
        showOrderMessage("Could not load orders.", true);
    }
}

function renderOrders(orders) {
    orderList.replaceChildren();

    if (orders.length === 0) {
        orderList.textContent = "No orders yet.";
        return;
    }

    orders.forEach((order) => {
        const card = document.createElement("article");
        card.className = "order";

        const title = document.createElement("h3");
        title.textContent = `Order #${order.id} - ${order.customer}`;

        const details = document.createElement("p");
        details.textContent = `${Array.isArray(order.itemIds) ? order.itemIds.length : 0} item(s) | KSh ${order.total} | ${order.phone}`;

        const select = document.createElement("select");
        STATUSES.forEach((status) => {
            const option = document.createElement("option");
            option.textContent = status;
            option.selected = status === order.status;
            select.append(option);        
    });
    select.addEventListener("change", async () => {
        try {
            await updateOrderStatus(order.id, select.value);
            showOrderMessage(`Order #${order.id} is now ${select.value}.`);
        } catch (error) {
            showOrderMessage("Could not update status.", true);
        }
    });

    const deletBtn = document.createElement("button");
    deletBtn.textContent = "Delete";
    deletBtn.className = "danger";
    deletBtn.addEventListener("click", async () => {
        if (!confirm("Delete this order?")) return;
        try {
            await deleteOrder(order.id);
            loadOrders();
        } catch (error) {
            showOrderMessage("Could not delete order.", true);
        }
    });

    card.append(title, details, select, deletBtn);
    orderList.append(card);
});

}

export function initOrders(reload) {
    reloadItems = reload;
    renderCart();
    loadOrders();
}