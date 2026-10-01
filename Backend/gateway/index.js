import express from 'express'
import proxy from 'express-http-proxy'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT
const AUTH_SERVICE = process.env.AUTH_SERVICE;
const app = express()
app.use(
  cors({
      origin: process.env.FRONTEND_URL,
      credentials:true
  }),
);

app.use(cookieParser())

app.use("/auth", proxy(AUTH_SERVICE));

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.listen(PORT, () => {
    console.log(`Gateway started at ${PORT}`);
})