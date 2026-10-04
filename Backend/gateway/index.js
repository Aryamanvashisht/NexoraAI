import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getCurrentUser } from "./controllers/user.controller.js";
import protect from "./middleware/auth.middleware.js";
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js";
import morgan from "morgan";

const PORT = process.env.PORT;
const AUTH_SERVICE = process.env.AUTH_SERVICE;
const CHAT_SERVICE = process.env.CHAT_SERVICE;
const AGENT_SERVICE = process.env.AGENT_SERVICE;
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/auth", proxy(AUTH_SERVICE));
app.use("/chat", protect, proxyWithHeaders(CHAT_SERVICE));
app.use("/agent",protect,proxy(AGENT_SERVICE));
app.get("/me", protect, getCurrentUser);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Gateway started at ${PORT}`);
});
