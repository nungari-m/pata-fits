import { addOrder, getOrders, updateOrderStatus, deleteOrder, markSold } from "./api.js";
import { validateOrder, calculateTotal } from "./validate.js";

const STATUSES = ["Pending", "Confirmed", "Ready", "Completed"];

const cartList = document.querySelector(#cart-list);
const cartTotal 