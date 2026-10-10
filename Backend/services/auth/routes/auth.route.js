import express from 'express'
import { login, logOut, updateUserPayment } from '../controllers/auth.controller.js'

const router = express.Router()

router.get("/logout",logOut)
router.post("/login", login)
router.put("/update-plan",updateUserPayment)

export default router