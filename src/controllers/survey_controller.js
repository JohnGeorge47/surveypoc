import httpContext from 'express-http-context';
import responseHandler from '../utils/responsehandler';
import SurveyModel from '../models/survey_model'
import utils from "../utils/utils"
import crypto from "crypto"
import "../models/users_model"

let survey_controller = {}


/*so the survey details api 
Im keeping in this format
{
    "title":"NameXYZ"
    "description":A gist of the survey basically
    "data":{
        //Heres the json about the survey
     "target":{
         "gender":
     }   
    }
}
*/
survey_controller.post = async (req, res) => {
    let reqid = crypto.randomBytes(16).toString('hex');
    httpContext.set('ctx', reqid);
    let rp = new responseHandler.ResponseHandler(
        'application/json',
        'post',
        httpContext.get('ctx')
    );
    let reqbody = req.body
    if (!utils.ValidateSurveyForm(reqbody)) {
        let err = new Error("Mandatory params are missing")
        return rp.error(res, err, 400)
    }
    let sm = new SurveyModel()
    try {
        let val = await sm.CreateSurvey(reqbody.email_id, reqbody)
        return rp.success(res, val)
    } catch (err) {
        return rp.error(res, err, 404)
    }
}

//This can be changed into a post if there are privacy concerns becuse email is a param
survey_controller.get = async (req, res) => {
    let reqid = crypto.randomBytes(16).toString('hex');
    httpContext.set('ctx', reqid);
    let rp = new responseHandler.ResponseHandler(
        'application/json',
        'GET',
        httpContext.get('ctx')
    );
    var email_id = req.query.email_id
    if (email_id == undefined) {
        let err = new Error("Mandatory params are missing")
        return rp.error(res, err, 400)
    }
    let sm = new SurveyModel()
    try {
        let result=await sm.BulkSurveyDetails(email_id)
        return rp.success(res,result,200)
    } catch (err) {
        throw err
    }
}

survey_controller.put=async(req,res)=>{
    let survey_id=req.params.survey_id
    let reqid = crypto.randomBytes(16).toString('hex');
    httpContext.set('ctx', reqid);
    console.log(req.body.email_id)
    let rp = new responseHandler.ResponseHandler(
        'application/json',
        'PUT',
        httpContext.get('ctx')
    )
    if(!survey_id==undefined){
        let err = new Error("Mandatory params are missing")
        return rp.error(res, err, 400)
    }
    if(!req.body.hasOwnProperty('email_id')){
        let err = new Error("Mandatory params are missing")
        return rp.error(res, err, 400)
    }
    if(!req.body.hasOwnProperty('response_json')){
        let err = new Error("Mandatory params are missing")
        return rp.error(res, err, 400)  
      }
      let sm = new SurveyModel()
    try {
        await sm.UpdateSurvey(survey_id,req.body)
        return rp.success(res,"Your changes have been recorded",200)
    } catch (error) {
        return rp.error(res, error, 400) 
    }
}



module.exports = survey_controller