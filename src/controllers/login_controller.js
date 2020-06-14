import crypto from "crypto"
import bcrypt from "bcrypt"
import httpContext from 'express-http-context';
import "regenerator-runtime/runtime.js";
import responseHandler from '../utils/responsehandler';
import utils from "../utils/utils"
import errorhandler from "../utils/error_handler/error_handler"
import user_model from "../models/users_model"




let login_controller={}

login_controller.post=async(req,res)=>{
    let reqid = crypto.randomBytes(16).toString('hex');
    httpContext.set('ctx', reqid);
    let rp = new responseHandler.ResponseHandler(
        'application/json',
        'post',
        httpContext.get('exoCtx')
    );
    let reqbody = req.body
    console.log(reqbody)
    if (!utils.LoginFormValidation(reqbody)) {
        let err = new Error("Some parameters are missing")
        return rp.error(res, err, 400)
    }
    try {
        let um=new user_model()
        let pass=await um.GetPassword(reqbody.email_id)
        let result=await bcrypt.compare(reqbody.password,pass)
        if(result){
            let data={}
            data["request_token"]=crypto.randomBytes(16).toString('hex');
            return rp.success(res,data)
        }
        let err=new errorhandler.WrongPasswordError("email_id or password incorrect",1,415)
        return rp.error(res,)
    } catch (error) {
        return rp.error(res, error, 500)
    }
}

module.exports=login_controller 