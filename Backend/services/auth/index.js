import express from 'express'
import databaseConnection from './config/db.js'

const PORT = process.env.PORT
const app = express()

app.get("/", (req, res) => {
    res.send("Hello from Auth")
})

app.listen(PORT, () => {
    console.log(`Auth started at ${PORT}`);
    databaseConnection()
})