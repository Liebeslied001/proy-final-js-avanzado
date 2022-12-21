const express = require('express')
const router = express.Router()

const userSchema = require('../models/user')
const pokemonSchema = require('../models/pokemon')

router.post('/user/register', (req,res) => {
    const user = userSchema(req.body)
    user
        .save()
        .then((data) => res.json(data))
        .catch(error => res.json({ message: error }))

})

router.post('/user/login', (req,res) => {
    const { mail, password } = req.body
    userSchema
        .findOne({
            mail, password
        })
        .then((data) => res.json(data))
        .catch(error => res.json({ message: error }))

})

router.get('/user/:userId', (req,res) => {
    const { userId } = req.params
    userSchema
        .findById(userId)
        .then((data) => res.json(data))
        .catch(error => res.json({ message: error }))

})

router.put('/user/:userId', (req,res) => {
    const { userId } = req.params
    const { name, mail, nickname, password, confirmPassword } = req.body

    userSchema
        .updateOne({ _id: userId }, {
            $set: {
                name, mail, nickname, password, confirmPassword
            }
        })
        .then((data) => res.json(data))
        .catch(error => res.json({ message: error }))

})

router.put('/user/:userId/pokemon/favorites', (req,res) => {
    const { userId } = req.params
    const { favoriteId } = req.body

        userSchema
        .findById(userId)
        .then((data) => {
            const oldFavorites = data.favorites
            userSchema
                .updateOne({ _id: userId }, {
                    $set: {
                        favorites: [...oldFavorites, favoriteId]
                    }
                })
                .then((data) => res.json(data))
                .catch(error => res.json({ message: error }))
        })
        .catch(error => res.json({ message: error }))
        
})

router.get('/user/:userId/pokemon/favorites', (req,res) => {
    const { userId } = req.params

        userSchema
        .findById(userId)
        .then((data) => {
            const favorites = data.favorites
            pokemonSchema
                .find({
                    _id: { $in: favorites }
                })
                .then((data) => res.json(data))
                .catch(error => res.json({ message: error }))
        })
        .catch(error => res.json({ message: error }))
        
})

router.delete('/user/:userId', (req,res) => {
    const { userId } = req.params

    userSchema
        .deleteOne({ _id: userId })
        .then((data) => res.json(data))
        .catch(error => res.json({ message: error }))

})

router.delete('/user/:userId/pokemon/favorites/:favoriteId', (req,res) => {
    const { userId, favoriteId } = req.params
    userSchema
        .findById(userId)
        .then((data) => {
            const favorites = data.favorites.filter((item) => item !== favoriteId)
            userSchema
                .updateOne({ _id: userId }, {
                    $set: {
                        favorites
                    }
                })
                .then((data) => res.json(data))
                .catch(error => res.json({ message: error }))
        })
        .catch(error => res.json({ message: error }))
        
})

//'https://pokeapi.co/api/v2/generation/1/'

module.exports = router