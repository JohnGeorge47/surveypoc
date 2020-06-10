import express from 'express';
import signup_controller from "./controllers/signup_controller"

const router = express.Router();


router.post("/signup",signup_controller.post)

module.exports=router