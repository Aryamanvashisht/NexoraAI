import express from 'express'
import proxy from 'express-http-proxy'

const PORT = process.env.PORT
const AUTH_SERVICE = process.env.AUTH_SERVICE;
const app = express()

app.use("/auth", proxy(AUTH_SERVICE));

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.listen(PORT, () => {
    console.log(`Gateway started at ${PORT}`);
})