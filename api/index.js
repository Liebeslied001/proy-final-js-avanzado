const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const axios = require('axios')
const pokemonSchema = require('./src/models/pokemon')

const userRoutes = require('./src/routes/user')
const pokemonRoutes = require('./src/routes/pokemon')

require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 9000

//middlewares
app.use(cors())
app.use(express.json())
app.use('/api', userRoutes)
app.use('/api', pokemonRoutes)
console.log(cors, 'cors')
// routes
app.get('/', (req, res) => {
    res.send('welcome to my APIs')
})

mongoose.set('strictQuery', true);

//mongodb connection
mongoose.connect(process.env.MONGODB_URI)
    .then(async() => {
        console.log('Connected to MongoDB Atlas')
        const response = await axios.get('https://pokeapi.co/api/v2/generation/1/', { 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        });

        pokemonSchema
            .insertMany(response.data.pokemon_species)
    
    })
    .catch((error) => console.log(error))

app.listen(9000, () => {
    console.log(`server listening on port: ${PORT}`)
})
