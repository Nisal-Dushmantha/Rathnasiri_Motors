const { body, validationResult } = require('express-validator');

// Validation middleware for service jobs
const validateService = [
  // Customer name validation
  body('Name')
    .notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .trim(),
  
  // Phone number validation
  body('Phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\d{10}$/).withMessage('Phone must be exactly 10 digits and contain only numbers'),
  
  // Vehicle number validation
  body('VehicleNumber')
    .notEmpty().withMessage('Vehicle number is required')
    .isLength({ min: 3, max: 10 }).withMessage('Vehicle number must be 3-10 characters'),
  
  // Vehicle type validation
  body('VehicleType')
    .notEmpty().withMessage('Vehicle type is required')
    .isIn(['Bike', 'Scooter', 'Other']).withMessage('Vehicle type must be Bike, Scooter, or Other'),
  
  // Model validation
  body('Model')
    .notEmpty().withMessage('Vehicle model is required'),
  
  // Kilometers validation
  body('KiloMeters')
    .notEmpty().withMessage('Kilometer reading is required')
    .isNumeric().withMessage('Kilometers must be a number')
    .isFloat({ min: 0 }).withMessage('Kilometers cannot be negative')
    .custom(value => value >= 0).withMessage('Kilometers cannot be negative'),
  
  // Last service date validation
  body('LastServiceDate')
    .notEmpty().withMessage('Last service date is required')
    .isDate().withMessage('Invalid date format')
    .custom(value => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to beginning of day for accurate comparison
      
      return date >= today; // Ensure date is today or in the future
    }).withMessage('Service date must be today or in the future')
];

// Validation middleware for repair jobs
const validateRepair = [
  // Customer name validation
  body('Name')
    .notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .trim(),
  
  // Phone number validation
  body('Phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\d{10}$/).withMessage('Phone must be exactly 10 digits and contain only numbers'),
  
  // Vehicle number validation
  body('VehicleNumber')
    .notEmpty().withMessage('Vehicle number is required')
    .isLength({ min: 3, max: 10 }).withMessage('Vehicle number must be 3-10 characters'),
  
  // Vehicle type validation
  body('VehicleType')
    .notEmpty().withMessage('Vehicle type is required')
    .isIn(['Bike', 'Scooter', 'Other']).withMessage('Vehicle type must be Bike, Scooter, or Other'),
  
  // Model validation
  body('Model')
    .notEmpty().withMessage('Vehicle model is required'),
  
  // Repair details validation
  body('Details')
    .notEmpty().withMessage('Repair details are required')
    .isLength({ min: 5 }).withMessage('Repair details must be at least 5 characters'),
    
  // Kilometers validation (optional for repairs but validated if provided)
  body('KiloMeters')
    .optional()
    .isNumeric().withMessage('Kilometers must be a number')
    .isFloat({ min: 0 }).withMessage('Kilometers cannot be negative')
];

// Middleware to check for validation errors
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateService,
  validateRepair,
  validateResult
};
