import { PLANS } from "../utils/plans.js";
import razorpay from "../config/razorpay.js";
import {Payment} from "../models/payment.model.js"
import axios from "axios";

export const orderCreated = async(req,res) => {
    try {
        const userId = req.headers["x-user-id"]
        const { plan } = req.body
        const selectedPlan = PLANS[selectedPlan]

        if (!selectedPlan) {
            return res.status(404).json({ message: `Selected Plan: ${plan} not found` })
        }

        const order = await razorpay.orders.create({
            amount: selectedPlan.amount * 100,
            currency: "INR",
            receipt: `receipt-${Date.now()}`
        })

        await Payment.create({
            userId,
            orderId: order?.id,
            amount: order?.amount,
            curreny: order?.currency,
            credits: selectedPlan?.credits,
            plan: selectedPlan?.plan,
            status: "created"
        })

        return res.status(201).json({ order, plan: selectedPlan })

    } catch (error) {
        return res.status(500).json({message: `Error creating the order ${error}`});
    }
}

export const verifyPayment = async(req,res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const createSignature = crypto
          .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest("hex")
          
        if (razorpay_signature !== createSignature) {
            return res.status(400).json({message:"Payment Verification Failed"})
        }

        const payment = await Payment.findOne({ orderId: razorpay_order_id });

        if (!payment) {
            return res.status(404).json({message:"Payment Not found"})
        }

        payment.status = "paid"
        payment.paymentId = razorpay_payment_id;
        await payment.save()

        await axios.put(`${process.env.AUTH_SERVICE}/update-plan`, {
            userId: payment.userId,
            plan: payment.plan,
            credits:payment.credits
        });

        return res.status(200).json({message:"Payment Verified"})
    } catch (error) {
        return res.status(404).json({ message: `Error in Payment verification ${error}` });
    }
}