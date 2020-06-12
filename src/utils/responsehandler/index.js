import {JSON, XML, GetResponseStrategy} from './factory';

export class ResponseHandler {
    constructor(rtype, method, rid) {
            if (rtype != JSON && rtype != XML) {
                // setting defaut type as JSON
                this.rtype = JSON
            }else {
                this.rtype = rtype; 
            }
            this.method = method;
            this.rid = rid;
        }

    success(res, data,status){
        if(status===undefined){
            status=200
        }
        let fullResp = {
            http_code: status,
            metadata: this.method,
            method:this.method,
            request_id: this.rid,
            response:data
        }
        let responder = GetResponseStrategy(this.rtype);
        responder.send(res, fullResp, status);
    }

    error(res, err,status) {
        if(status===undefined){
            status=400
        }
        let fullResp = {
            http_code: err.code,
            metadata: this.method,
            method:this.method,
            request_id: this.rid,
            response: [
                {
                    status: "error",
                    code: err.code,
                    error_data: {
                        message : err.message
                    }
                }
            ]
        }
        let responder = GetResponseStrategy(this.rtype);
        responder.send(res, fullResp, status);

    }
}

module.exports={
    ResponseHandler
}