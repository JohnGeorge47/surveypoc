import httpContext from 'express-http-context';
import responseHandler from '../utils/responsehandler';
import  SurveyModel from '../models/survey_model'
import utils from "../utils/utils"
import crypto from "crypto"
import "../models/users_model"

let survey_controller={}

survey_controller.post=async(req,res)=>{
    let reqid = crypto.randomBytes(16).toString('hex');
    httpContext.set('ctx', reqid);
    let rp = new responseHandler.ResponseHandler(
        'application/json',
        'post',
        httpContext.get('exoCtx')
    );
    let reqbody = req.body
    if(!utils.ValidateSurveyForm(reqbody)){
        let err = new Error("Email is a mandatory param")
        return rp.error(res, err, 400)
    }
    let sm=new SurveyModel()
    try{
    let val=await sm.CreateSurvey(reqbody.email_id)
    }catch(err){
        return rp.error(res,err,404)
    }
}



module.exports=survey_controller