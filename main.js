import {getItems, addItem, updateItem, deleteItem } from "./api.js";
import {validateItem } from "./validate.js";

const list = document.querySelector("#item-list");
const form = document.querySelector("#item-form");
const message = document.querySelector("#message");
const filter = document.querySelector("#filter");
const cancelBtn = document.querySelector("#cancel-btn");

let items = [];

function showMessage(text, isError = false) {
    message.textContent = text;
    message.className = iisError ? "error" : "success";
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

import { addToCart, initOrders } from "./orders.js";