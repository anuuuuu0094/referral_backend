const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    emails:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    referralCode:{
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('User', userSchema);