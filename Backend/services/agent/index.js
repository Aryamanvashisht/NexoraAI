import express from "express";
import databaseConnection from "./config/db.js";

const PORT = process.env.PORT;
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Agent");
});

app.listen(PORT, () => {
  console.log(`Agent started at ${PORT}`);
  databaseConnection();
});
