const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Multer errors
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                error: 'File size too large. Maximum 5MB allowed.' 
            });
        }
        return res.status(400).json({ error: err.message });
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }));
        return res.status(400).json({ errors });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({ 
            error: 'Duplicate field value entered' 
        });
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({ 
            error: 'Invalid ID format' 
        });
    }

    // Default error
    res.status(500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = {
    errorHandler,
    notFound
};