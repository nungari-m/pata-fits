export const API_URL ="http://localhost:3000";

async function request(path, options = {}) {
    const response =await fetch(API_URL + path, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
    }
    return response.json();
}

//READ
export function getItems(id) {
    return request("/items/");
}

//CREATE
export function addItem(id, item) {
    return request("/items" + id, { method: "POST", body: JSON.stringify(item) });
}

//UPDATE 
export function updateItem(id, item) {
    return request("/items/" + id, { method: "PUT", body: JSON.stringify(item) });
}

export function markSold(id) {
    return request("/items/" + id, { method: "PATCH", body: JSON.stringify({ sold: true}) });
}

//DELETE
export function deleteItem(id) {
    return request("/items/" + id, { method: "DELETE" });
}

//----ORDERS----

//READ
export function getOrders() {
    return request("/orders");
}

//CREATE
export function addOrder(order) {
    return request("/orders/", { method: "POST", body: JSON.stringify(order) });
}    

//UPDATE 
export function updateOrderStatus(id, status) {
    return request("/orders/" + id, { method: "PATCH", body: JSON.stringify({status}) });
}

//DELETE
export function deleteOrder(id) {
    return request("/orders/" + id, { method: "DELETE"});
}