// Validate Sri Lankan style phone number: 10 digits, starts with 0
function isValidContactNumber(number) {
    if (typeof number !== "string") return false;
    // Must be exactly 10 digits, start with 0, and all digits
    return /^0\d{9}$/.test(number.trim());
}

function validateCustomerPayload(req, res, next) {
    const errors = [];
    const { customerName, contactNumber, email } = req.body || {};

    if (!isNonEmptyString(customerName, 2, 100)) {
        errors.push(buildError("customerName", "Customer name is required (2-100 characters)."));
    }
    if (!isValidContactNumber(contactNumber)) {
        errors.push(buildError("contactNumber", "Contact number must be exactly 10 digits and start with 0."));
    }
    if (!isNonEmptyString(email) || !isValidEmail(email)) {
        errors.push(buildError("email", "Valid email is required."));
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
}
// Simple validation middleware for User CRUD requests

function isNonEmptyString(value, min = 1, max = Infinity) {
    return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}

function isValidEmail(email) {
    if (typeof email !== "string") return false;
    // Basic RFC5322-like email pattern
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
}

function isValidAge(value, min = 0, max = 120) {
    if (typeof value === "string" && value.trim() !== "") {
        const n = Number(value);
        if (!Number.isFinite(n)) return false;
        value = n;
    }
    return Number.isInteger(value) && value >= min && value <= max;
}

function buildError(field, message) {
    return { field, message };
}

function validateUserPayload(req, res, next) {
    const errors = [];
    const { name, gmail, age, address } = req.body || {};

    if (!isNonEmptyString(name, 2, 100)) {
        errors.push(buildError("name", "Name is required (2-100 characters)."));
    }
    if (!isNonEmptyString(gmail) || !isValidEmail(gmail)) {
        errors.push(buildError("gmail", "Valid email is required."));
    }
    if (!isValidAge(age)) {
        errors.push(buildError("age", "Age must be an integer between 0 and 120."));
    }
    if (!isNonEmptyString(address, 5, 200)) {
        errors.push(buildError("address", "Address is required (5-200 characters)."));
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
}

module.exports = {
    validateUserPayload,
    validateCustomerPayload,
};


