const { validationResult } = require('express-validator');
const { body } = require('express-validator');

const validateCandidate = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Invalid phone number format'),
    
    body('jobTitle')
        .trim()
        .notEmpty().withMessage('Job title is required')
        .isLength({ min: 2, max: 100 }).withMessage('Job title must be between 2 and 100 characters'),
    
    body('status')
        .optional()
        .isIn(['Pending', 'Reviewed', 'Hired']).withMessage('Invalid status value')
];

const validateStatus = [
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['Pending', 'Reviewed', 'Hired']).withMessage('Invalid status value')
];

const validate =  (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
   next();
};

module.exports = {
    validateCandidate,
    validateStatus,
    validate
};







