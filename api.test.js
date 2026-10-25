import { beforeEach, jest } from "@jest/globals";
import { getOrders, addOrder, updateOrderStatus, deleteOrder } from "./api.js";

beforeEach(() => {
    global.fetch = jest.fn(() => 
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
);
});

test("getOrders calls GET /orders", async () => {
    await getOrders();
    expect(fetch.mock.calls[0][0]).toContain("/orders");
});

test("addOrder uses POST", async () => {
    await addOrder({ customer: "Martha" });
    expect(fetch.mock.calls[0][1].method).toBe("POST");
});

test("updateOrderStatus uses PATCH with new status", async () => {
    await updateOrderStatus(1, "Ready");
    expect(fetch.mock.calls[0][1].method).toBe("PATCH");
    expect(fetch.mock.calls[0][1].body).toContain("Ready");
});

test("deleteOrder uses DELETE", async () => {
    await deleteOrder(1);
    expect(fetch.mock.calls[0][1].method).toBe("DELETE");
});