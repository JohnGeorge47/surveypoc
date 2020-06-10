import user_model from "./users_model"
import errorhandler from "../utils/error_handler/error_handler"

//Here i'm checking user type via hardcoding ideally should be a join or subquery
class SurveyModel {
    async CreateSurvey(email) {
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
            console.log(user_type)
        } catch (err) {
            throw err
        }
    }
}

export default SurveyModel