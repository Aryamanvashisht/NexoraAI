import express from "express";
import databaseConnection from "./config/db.js";
import router from "./routes/billing.route.js";

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use("/", router);

app.get("/", (req, res) => {
  res.send("Hello from Billing");
});

app.listen(PORT, () => {
  console.log(`Billing started at ${PORT}`);
  databaseConnection();
});
