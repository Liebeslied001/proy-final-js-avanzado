const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    'name': {
        type: String,
        required: true
    },
    'mail': {
        type: String,
        required: true,
    },
    'nickname': {
        type: String,
        required: true
    },
    'password': {
        type: String,
        required: true
    },
    'confirmPassword': {
        type: String,
        required: true,
    },
    'favorites': {
        type: Array,
        required: true,
    }
})

module.exports = mongoose.model('user', userSchema)