let utils={}

//This is used to validate the input form during signup
utils.FormValidation=(reqbody)=>{
    if(!reqbody.hasOwnProperty('email_id')||
      !reqbody.hasOwnProperty('password')||
      !reqbody.hasOwnProperty('gender')||
      !reqbody.hasOwnProperty('user_type')||
      !reqbody.hasOwnProperty('age')){
        return 0
    }
    return 1
}

module.exports=utils