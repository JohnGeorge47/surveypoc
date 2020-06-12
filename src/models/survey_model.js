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

    //This handles the survey details
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
            let result = await this.GetCoordinatorSurvey(user_id)
            return result
        } catch (err) {
            throw err
        }
    }
    /**
     * To get all surveys created by the coordinator
     * @param user_id coordinator id
     */
    async GetCoordinatorSurvey(user_id) {
        /**
         *We do a join with the createdsurveys table and the survey_user_map
         *To get all the details
         */
        let query = `SELECT
                        m.map_id,
                        m.responded,
                        m.response_json,
                        m.updated_at,
                        s.created_at,
                        s.title,
                        s.survey_id,
                        s.description
                    FROM
                        survey_user_map AS m
                        INNER JOIN createdsurveys AS s
                        ON m.survey_id=s.survey_id
                    WHERE
                        s.created_by=?`
        try {
            let rows = await this.connection.query(query, [user_id])
            if (rows[0].length == 0) {
                return null
            }
            let result = []
            rows[0].forEach(element => {
                var respJson = Object.assign({}, element);
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
                     s.survey_id,
                     s.description
                   FROM
                     survey_user_map AS m
                   INNER JOIN createdsurveys AS s
                     ON m.survey_id=s.survey_id
                   WHERE
                     m.user_id=?`
        try {
            let rows = await this.connection.query(query, [user_id])
            if (rows[0].length == 0) {
                return null
            }
            let result = []
            rows[0].forEach(element => {
                var respJson = Object.assign({}, element);
                result.push(respJson)
            });
            return result
        } catch (error) {
            throw error
        }
    }
    
    /**
     * This is the function which handles the logic on whether user is
     * a coordinator or a respondant
     * @param survey_id the survey id to update
     * @param reqbody this is of the format
     * {
     *  "email_id":"blah@blah.com"
     *  "response_json":"val"
     * }
     */
    async UpdateSurvey(survey_id, reqbody) {
        let email_id = reqbody.email_id
        let um = new user_model()
        try {
            let user_id = await um.FindUserID(email_id)
            if (user_id == null) {
                let newerr = new errorhandler.UserDoesNotExist("the user does not exist", 1, 404)
                throw newerr
            }
            let user_type = await um.Findrole(user_id)
            //Here we check if the person is a respondant or a coordinator and accordingly call
            if (user_type == 2) {
                await this.UpdateRespondentSurvey(survey_id, user_id, reqbody.response_json)
                return
            }
            await this.UpdateCoordinatorSurvey(survey_id, user_id, reqbody.response_json)
        } catch (error) {
            throw error
        }

    }

    /**
     * 
     * @param survey_id this is the id of the survey being sent 
     * @param user_id the id of the respondant
     * @param respJson the response json to be recorded
     */
    async UpdateRespondentSurvey(survey_id, user_id, respJson) {
        console.log(survey_id, user_id)
        //This query is used to check if the respondent has answered this survey before
        //if true then we throw an error saying permission denied
        let query1 = `SELECT responded FROM survey_user_map 
                    WHERE survey_id=? AND user_id=?`
        //This query is used to insert the response sent by the respondant as well as update
        //the responded to true so the person cant submit the form again
        let query2 = `UPDATE survey_user_map
                    SET response_json=?,updated_at=?,responded=? WHERE survey_id=? AND user_id=?`
        try {
            let rows = await this.connection.query(query1, [survey_id, user_id])
            if (rows[0][0].responded) {
                let newerr = new errorhandler.NoPermissionError("the user does not have permission", 2, 405)
                throw newerr
            }
            let current_timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            let result = await this.connection.query(query2, [JSON.stringify(respJson), current_timestamp, true, survey_id, user_id])
            console.log(result)
        } catch (err) {
            throw err
        }
    }

    /**
     * The function is used to update the survey for the coordinator as well as the respondants
     * @param  survey_id The survey id you are looking for
     * @param  user_id  The user_id of the coordinator
     * @param  respJson The change json
     * returns null or throws an error
     */
    async UpdateCoordinatorSurvey(survey_id, user_id, respJson) {
        /**
         * In this function im doing a transaction 
         * 1.To update the createdsurveys table with the new survey json
         * 2.To update survey for all the respondants of this particular survey
         */
        let query1 = `UPDATE createdsurveys
                    SET survey_json=?,updated_at=? WHERE survey_id=? AND created_by=?`

        let query2 = `UPDATE survey_user_map
                    SET response_json=?,updated_at=? WHERE survey_id=?`
        let current_timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const conn = await this.connection.getConnection()
        await conn.beginTransaction();
        try {
            let query1_result = await conn.query(query1, [JSON.stringify(respJson), current_timestamp, survey_id, user_id])
            console.log(query1_result)
            let query2_result = await conn.query(query2, [JSON.stringify(respJson), current_timestamp, survey_id])
            console.log(query2_result)
            await conn.commit()
        } catch (error) {
            throw error
        }
    }
}

export default SurveyModel