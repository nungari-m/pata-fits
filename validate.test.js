import { calculateTotal, validateItem, validateOrder } from "./validate.js";

describe("validateItem", () => {
    test("accepts a valid item", () => {
        expect(validateItem({ name: "Denim jacket", size: "M", price: "500" })).toEqual([]);
    });

    test.each(["", "0", "-10", "not a price"])("rejects invalid price %s", (price) => {
        expect(validateItem({ name: "Denim jacket", size: "M", price })).toContain(
            "Price must be greater than 0."
        );
    });

    test("reports missing name and size", () => {
        expect(validateItem({ name: "", size: "", price: "500" })).toEqual([
            "Name must be at least 3 characters.",
            "Size is required.",
        ]);
    });
});

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