const mongoose = require('mongoose')

const pokemonSchema = mongoose.Schema({
    'name': {
        type: String,
        required: true
    },
    'url': {
        type: String,
        required: true,
    },
    'fav': {
        type: Boolean,
        required: false,
    }
})

module.exports = mongoose.model('pokemon', pokemonSchema)