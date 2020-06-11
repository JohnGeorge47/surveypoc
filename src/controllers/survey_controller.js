import httpContext from 'express-http-context';
import responseHandler from '../utils/responsehandler';
import  SurveyModel from '../models/survey_model'
import utils from "../utils/utils"
import crypto from "crypto"
import "../models/users_model"

let survey_controller={}


/*so the survey details api 
Im keeping in this format
{
    "title":"NameXYZ"
    "description":A gist of the survey basically
    "data":{
        //Heres the json about the survey
    }
}
*/
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
        let err = new Error("Mandatory params are missing")
        return rp.error(res, err, 400)
    }
    let sm=new SurveyModel()
    try{
    let val=await sm.CreateSurvey(reqbody.email_id,reqbody)
    }catch(err){
        return rp.error(res,err,404)
    }
}



module.exports=survey_controller