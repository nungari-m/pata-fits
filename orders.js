import { addOrder, getOrders, updateOrderStatus, deleteOrder, markSold } from "./api.js";
import { validateOrder, calculateTotal } from "./validate.js";

const STATUSES = ["Pending", "Confirmed", "Ready", "Completed"];

const cartList = document.querySelector("#cart-list");
const cartTotal = document.querySelector("#cart-total");
const orderForm = document.querySelector("#order-form");
const orderlist = document.querySelector("#order-list");
const orderMessage = document.querySelector("#order-message");

let cart = [];
let reloadItems = () => {};

function showOrderMessage(text, iserror = false) {
    orderMessage.textContent = text;
    orderMessage.className = iserror ? "error" : "success";
}

//---------Cart---
export function addtoCart(item) {
    if (cart.some((i) => i.id === item.id)) {
        showOrderMessage("That item is alredy in your cart.", true);
        return;
    }
    cart.push(item);
    renderCart();
    showOrderMessage(item.name + "added to cart.");
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
        showOrderMessage(errors.join(""), true);
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
    await addOrder(order);
    await Promise.all(cart.map((i) => markSold(i.id)));
    cart = [];
    renderCart();
    orderForm.reset();
    showOrderMessage("Order placed! Status: Pending.");
    reloadItems();
    loadOrders();
} catch (error) {
    showOrderMessage("Could not place order. Try again.", true);
}
});

//---Track orders-----
async function loadOrders() {
    try {
        const orders = await getOrders();
        renderOrders(orders);
    } catch (error) {
        showOrderMessage("Could not load orders.", true);
    }
}

function renderOrders(orders) {
    orderlist.replaceChildren();

    if (orders.length === 0) {
        orderlist.textContent = "No orders yet.";
        return;
    }

    orders.forEach((order) => {
        const card = document.createElement("article");
        card.className = "order";

        const title = document.createElement("h3");
        title.textContent = `Order #${order.id} - ${order.customer}`;

        const details = document.createElement("p");
        details.textContent = `${order.itemIds.length} item(s) | KSh ${order.total} | ${order.phone}`;

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
    orderlist.append(card);
});

}

export function initOrders(reload) {
    reloadItems = reload;
    renderCart();
    loadOrders();
}