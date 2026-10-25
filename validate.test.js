import { calculateTotal, validateOrder } from "./validate";

describe("validateOrder", () => {
    const cart = [{ id: 1, price: 500 }];

    test("accepts a valid order", () => {
        expect(validateOrder({ customer: "Martha", phone: "0712345678" }, cart)).toEqual([]);
    });

    test("rejects an empty cart", () => {
        expect(validateOrder({ customer: "Martha", phone: "0712345678" }, [])).toContain("Your cart is empty.");
    });

    test("rejects a bad phone number", () => {
        expect(validateOrder({ customer: "Martha", phone: "abc" }, cart)).toHaveLength(1);
    });
});

test("calculateTotal adds up prices", () => {
    expect(calculateTotal([{ price: 500 }, { price: 250 }])).toBe(750);
});