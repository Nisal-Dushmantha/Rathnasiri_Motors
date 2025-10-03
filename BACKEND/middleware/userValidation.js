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
};


