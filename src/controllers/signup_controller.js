import crypto from "crypto"
import bcrypt from "bcrypt"
import httpContext from 'express-http-context';
import responseHandler from '../utils/responsehandler';
import utils from "../utils/utils"
import SignupModel from "../models/signup_model"
let signup_controller = {}
let saltrounds = 10
signup_controller.post = async (req, res) => {
    let reqid = crypto.randomBytes(16).toString('hex');
    httpContext.set('ctx', reqid);
    let rp = new responseHandler.ResponseHandler(
        'application/json',
        'post',
        httpContext.get('exoCtx')
    );
    let reqbody = req.body
    console.log(req.body)
    if (!utils.FormValidation(reqbody)) {
        let err = new Error("Some parameters are missing")
        return rp.error(res, err, 400)
    }
    try {
        let hash = await bcrypt.hash(req.body.password, saltrounds)
        req.body.password=hash
        let sm=new SignupModel()
        await sm.Signup(req.body)
        let responseData={
            "success":"ok"
        }
        return rp.success(res,responsedata)
    } catch (err) {
        return rp.error(res, err, 400)
    }
}

module.exports = signup_controller