import user_model from "./users_model"
import MySQL from "../mysql/mysql"
import errorhandler from "../utils/error_handler/error_handler"

//Here i'm checking user type via hardcoding ideally should be a join or subquery
class SurveyModel extends MySQL {
    constructor() {
        super()
    }
    /*Ideally this should be a little different for inserting into the survey_users tables
      1.Individual inserts generally get slower especially when the set to insert is very large
      2.Can be solved by batch inserts or by writing into a csv and then insert from file if the size
       too large or put a cap on the target number of users you can send your survey(bad ux tho)
    */
    async CreateSurvey(email, surveydetails) {
        let um = new user_model()
        console.log(this.connection)

        try {
            let user_id = await um.FindUserID(email)
            if (user_id == null) {
                let newerr = new errorhandler.UserDoesNotExist("the user does not exist", 1, 404)
                throw newerr
            }
            console.log(user_id)
            let user_type = await um.Findrole(user_id)
            if (user_type == 2) {
                let newerr = new errorhandler.NoPermissionError("the user does not have permission", 2, 405)
                throw newerr
            }
            let current_timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            let updated_timestamp = current_timestamp
            let surveyTableInsertQuery = "INSERT INTO createdsurveys(created_by,title,created_at,updated_at,description,survey_json) VALUES(?,?,?,?,?,?)"
            let to_insert = [user_id, surveydetails.title, current_timestamp, updated_timestamp, surveydetails.description, JSON.stringify(surveydetails.data)]
            console.log(to_insert)
            let insert_survey = await this.connection.query(surveyTableInsertQuery, to_insert)
            let inserts = await this.AddToSurveyMapTable(current_timestamp, insert_survey[0].insertId, surveydetails)
        } catch (err) {
            console.log(err)
            let newerr = new errorhandler.MySQLErr(err.message, 3, 500)
            throw newerr
        }
    }

    async AddToSurveyMapTable(current_timestamp, insertId, surveydetails) {
        let query = "INSERT INTO survey_user_map(survey_id,responded,response_json,user_id) SELECT ?,?,?,user_id from users WHERE user_type=? "
        if (!surveydetails.target.hasOwnProperty("gender") && surveydetails.target.hasOwnProperty('age')) {
            let agearr = surveydetails.target.age.split("-")
            query = query + "AND age BETWEEN ? AND ?"
            try {
                console.log(query);
                console.log(agearr)
                let response = await this.connection.query(query, [insertId, false, JSON.stringify(surveydetails.data), 2, parseInt(agearr[0]), parseInt(agearr[1])])
                return response
            } catch (err) {
                throw err
            }
        } else if (!surveydetails.target.hasOwnProperty("age") && surveydetails.target.hasOwnProperty('gender')) {
            query = query + "WHERE gender=?"
            console.log(query)
            try {
                let response = await this.connection.query(query, [insertId, false, JSON.stringify(surveydetails.data), 2, surveydetails.target.gender])
                return response
            } catch (err) {
                throw err
            }
        } else if (surveydetails.target.hasOwnProperty("age") &&
            surveydetails.target.hasOwnProperty("gender")) {
            let agearr = surveydetails.target.age.split("-")
            query = query + "WHERE gender=? AND age BETWEEN ? AND ?"
            try {
                let response = await this.connection.query(query, [insertId, false, JSON.stringify(surveydetails.data), 2, surveydetails.target.gender, parseInt(agearr[0]), parseInt(agearr[1])])
                return response
            } catch (error) {
                throw error
            }
        }
        try {
            let response = await this.connection.query(query, [insertId, false, JSON.stringify(surveydetails.data)])
            return response
        } catch (error) {
            throw error
        }
    }
    async BulkSurveyDetails(email_id) {
        let um = new user_model()
        try {
            let user_id = await um.FindUserID(email_id)
            console.log(user_id)
            if (user_id == null) {
                let newerr = new errorhandler.UserDoesNotExist("the user does not exist", 1, 404)
                throw newerr
            }
            let user_type = await um.Findrole(user_id)
            if (user_type == 2) {
                let result = await this.GetRespondentSurveys(user_id)
                return result
            }
            let result=await this.GetCoordinatorSurvey(user_id)
            return result
        } catch (err) {
            throw err
        }
    }

    async GetCoordinatorSurvey(user_id){
        let query = `SELECT
                        m.map_id,
                        m.responded,
                        m.response_json,
                        m.updated_at,
                        s.created_at,
                        s.title,
                        s.description
                    FROM
                        survey_user_map AS m
                        INNER JOIN createdsurveys AS s
                        ON m.survey_id=s.survey_id
                    WHERE
                        s.created_by=?`
         try {
           let rows=await this.connection.query(query,[user_id])
           if (rows[0].length==0){
               return null
           }
           let result=[]
           rows[0].forEach(element => {
               var respJson=Object.assign({}, element);
               result.push(respJson)
           });
           return result
         } catch (error) {
             throw error
         }  
    }

    async GetRespondentSurveys(user_id) {
        let query = `SELECT
                     m.map_id,
                     m.responded,
                     m.response_json,
                     m.updated_at,
                     s.created_at,
                     s.title,
                     s.description
                   FROM
                     survey_user_map AS m
                   INNER JOIN createdsurveys AS s
                     ON m.survey_id=s.survey_id
                   WHERE
                     m.user_id=?`
        try {
            let rows = await this.connection.query(query, [user_id])
            if (rows[0].length==0){
                return null
            }
            let result=[]
            rows[0].forEach(element => {
                var respJson=Object.assign({}, element);
                result.push(respJson)
            });
            return result
        } catch (error) {
            throw error
        }
    }
}

export default SurveyModel