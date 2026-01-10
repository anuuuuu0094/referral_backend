const mongoose = require('mongoose');
const { CANDIDATE_STATUS } = require('../config/constant');

const candidateSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
            validator: function(v) {
                return /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/[\s\-\(\)\.]/g, ''));
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    jobTitle: { 
        type: String, 
        required: [true, 'Job title is required'],
        trim: true
    },
    status: { 
        type: String, 
        enum: Object.values(CANDIDATE_STATUS),
        default: CANDIDATE_STATUS.PENDING
    },
    resumeUrl: { 
        type: String,
        default: null
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Update the updatedAt field before saving
candidateSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

candidateSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

module.exports = mongoose.model('Candidate', candidateSchema);
