import {getItems, addItem, updateItem, deleteItem } from "./api.js";
import {validateItem } from "./validate.js";
import { addToCart, initOrders } from "./orders.js";

const list = document.querySelector("#item-list");
const form = document.querySelector("#item-form");
const message = document.querySelector("#message");
const filter = document.querySelector("#filter");
const cancelBtn = document.querySelector("#cancel-btn");

let items = [];

function showMessage(text, isError = false) {
    message.textContent = text;
    message.className = isError ? "error" : "success";
}

async function loadItems() {
    showMessage("Loading items...");
    try {
        items = await getItems();
        render();
        showMessage("");
    } catch (error) {
        showMessage("Could not load items. Is the server running?", true);
    }
}

function render() {
    list.replaceChildren();
    const category = filter.ariaValueMax;
    const shown = category === "All" ? items : items.filter((i) => i.category === category );

    if (shown.length === 0) {
        list.textContent = "No items found.";
        return;
    }
    shown.forEach((item) => list.append(createCard(item)));
}

function createButton(label, className, onClick) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = className;
    btn.addEventListener("click", onClick);
    return btn;
}

function createCard(item) {
    const card = document.createElement("article");
    card.className = item.sold ? "item sold" : "item";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const details = document.createElement("p");
    details.textContent = `${item.category} | Size ${item.size}`;

    const price = document.createElement("p");
    price.textContent = `Ksh ${item.price}` + (item.sold ? " (SOLD)" : "");

    card.append(title, details, price);

    if (!item.sold) {
        card.append(createButton("Add to cart", "buy", () => addToCart(item)));
    }
    card.append(createButton("Edit", "secondary", () => fillForm(item)));
    card.append(createButton("Delete", "danger", () => handleDelete(item.id)));
    return card;
}

async function handleBuy(id) {
    try {
        await markSold(id);
        showMessage("Item marked as sold!");
        loadItems();
    } catch (error) {
        showMessage("Could not complete purchase.", true);
    }
}

function fillForm(item) {
    form.elements.id.value = item.id;
    form.elements.name.value = item.name;
    form.elements.category.value = item.category;
    form.elements.size.value = item.value;
    form.elements.price.value = item.price;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form));
    const errors = validateItem(data);
    if (errors.length > 0) {
        showMessage(errors.join(""), true);
        return;
    }
    
const item = {
    name: data.name.trim(),
    category: data.category,
    size: data.size.trim(),
    price: Number(data.price),
    sold: false,
};

try {
    if (data.id) {
        const existing = items.find((i) => String(i.id) === data.id);
        item.sold = existing ? existing.sold : false;
        await updateItem(data.id, item);
        showMessage("Item updated!");
    } else {
        await addItem(item);
        showMessage("Item added!");
    }

    form.reset();
    form.elements.id.value = "";
    loadItems();
} catch (error) {
    showMessage("Could not save item.", true);    
}

});

cancelBtn.addEventListener("click", () => {
    form.reset();
    form.elements.id.value = "";
});

filter.addEventListener("change", render);

document.addEventListener("DOMContentLoaded", () => {
    loadItems();
    initOrders(loadItems);
});

