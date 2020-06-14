import express, { Router } from 'express';
import signup_controller from "./controllers/signup_controller"
import survey_controller from "./controllers/survey_controller"
import login_controller from "./controllers/login_controller"


const router = express.Router();


router.post("/signup",signup_controller.post)
//Here ideally 
router.post("/create_survey",survey_controller.post)
router.post("/login",login_controller.post)
router.put("/update_survey/:survey_id",survey_controller.put)
router.get("/get_survey",survey_controller.get)
router.get("/get_survey/:title",survey_controller.get)
module.exports=router