const express = require('express')
const pokemonSchema = require('../models/pokemon')
const router = express.Router()

router.get('/pokemon', (req,res) => {
    pokemonSchema
        .find()
        .then((data) => res.json(data))
        .catch(error => res.json({ message: error }))

})

router.get('/pokemon/:id', (req,res) => {
    const { id } = req.params
    pokemonSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch(error => res.json({ message: error }))

})

router.delete('/pokemon/:id', (req,res) => {
    const { id } = req.params

    pokemonSchema
        .deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch(error => res.json({ message: error }))

})

//'https://pokeapi.co/api/v2/generation/1/'

module.exports = router