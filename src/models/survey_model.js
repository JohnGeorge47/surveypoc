import user_model from "./users_model"
import  MySQL from "../mysql/mysql"
import errorhandler from "../utils/error_handler/error_handler"

//Here i'm checking user type via hardcoding ideally should be a join or subquery
class SurveyModel extends MySQL{
     constructor(){
         super()
     }
    /*Ideally this should be a little different for inserting into the survey_users tables
      1.Individual inserts generally get slower especially when the set to insert is very large
      2.Can be solved by batch inserts or by writing into a csv and then insert from file if the size
       too large or put a cap on the target number of users you can send your survey(bad ux tho)
    */
    async CreateSurvey(email,surveydetails) {
        
        let um = new user_model()
        try {
            let user_id = await um.FindUserID(email)
            if (user_id == null) {
                let newerr = new errorhandler.UserDoesNotExist("the user does not exist", 1, 404)
                throw newerr
            }
            console.log(user_id)
            let user_type = await um.Findrole(user_id)
            if (user_type == 2) {
               let newerr=new errorhandler.NoPermissionError("the user does not have permission",2,405)
               throw newerr
            }
            let current_timestamp=new Date().toISOString().slice(0, 19).replace('T', ' ');
            let updated_timestamp=current_timestamp
            let surveyTableInsertQuery="INSERT INTO createdsurveys(created_by,title,created_at,updated_at,description,survey_json) VALUES(?,?,?,?,?,?)"
            let to_insert=[user_id,surveydetails.title,current_timestamp,updated_timestamp,surveydetails.description,JSON.stringify(surveydetails.data)]
            console.log(to_insert,surveyTableInsertQuery)
            let insert_survey=await this.connection.query(surveyTableInsertQuery,to_insert)
            console.log(insert_survey)
        } catch (err) {
            let newerr=new errorhandler.MySQLErr(err.message,3,500)
            throw newerr
        }
    }

    async AddToSurveyMaTable(){
        
    }
}

export default SurveyModel