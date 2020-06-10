import json from './json';
import xml from './xml'
const JSON = "application/json"
const XML = "text/xml";
export const GetResponseStrategy = (rtype) =>{
    switch (rtype){
        case JSON :
            let jsonObj=new json.JSONStrategy()
            return jsonObj;
        case XML :
            return new xml.XMLStrategy()
    }
    return JSONStrategy;
}
module.exports={
    GetResponseStrategy,
    XML,
    JSON
}