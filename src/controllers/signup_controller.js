import crypto from "crypto"
import httpContext from 'express-http-context';
import responseHandler from '../utils/responsehandler';
import utils from "../utils/utils"
let signup_controller = {}

signup_controller.post = async (req, res) => {
    let reqid = crypto.randomBytes(16).toString('hex');
    httpContext.set('ctx', reqid);
    let rp = new responseHandler.ResponseHandler(
        'application/json',
        'get',
        httpContext.get('exoCtx')
    );
    let reqbody = req.body
    console.log(req.body)
    if (!utils.FormValidation(reqbody)) {
        let err=new Error("Some parameters are missing")
        return rp.error(res, err, 400)
    }
    console.log(reqbody)
}

module.exports = signup_controller