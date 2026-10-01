import express from 'express'
import databaseConnection from './config/db.js'
import router from './routes/auth.route.js'

const PORT = process.env.PORT
const app = express()
app.use(express.json())
app.use("/", router)

app.get("/", (req, res) => {
    res.send("Hello from Auth")
})

app.listen(PORT, () => {
    console.log(`Auth started at ${PORT}`);
    databaseConnection()
})