import express from 'express'
import { login, logOut } from '../controllers/auth.controller.js'

const router = express.Router()

router.get("/logout",logOut)
router.post("/login", login)

export default router