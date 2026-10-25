export function validateItem(item) {
    const errors = [];

    if (!item.name || item.name.trim().length < 3) {
        errors.push("Name must be at least 3 characters.");        
    }

    if (!item.size || item.size.trim() === "") {
        errors.push("Size is required.");
    }

    if (!item.price || Number(item.price) <= 0) {
        errors.push("Price must be greater than 0.");
    }
}

export function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}

export function validateOrder(order, cart) {
    const errors = [];

    if (cart.length === 0) {
        errors.push("Your cart is empty.");
    }

    if (!order.customer || order.customer.trim().length < 2) {
    errors.push("Please enter your name.");    
    }
   
    if (!order.phone || !/^[0-9+\s-]{9,15}$/.test(order.phone.trim())) {
        errors.push("Enter a valid phone number.");
    }
 return errors;    
}