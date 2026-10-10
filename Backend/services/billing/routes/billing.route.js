import express from "express"
import {
  orderCreated,
  verifyPayment,
} from "../controllers/billing.controller.js";

const router = express.Router()

router.post("/create", orderCreated);
router.post("/verify", verifyPayment);

export default router