import MySQL from "../mysql/mysql"


class UserModel extends MySQL {
    constructor() {
        super()
    }
    async Findrole(user_id) {
        let query1 = "SELECT user_type FROM users WHERE user_id=?"
        try {
            let rows = await this.connection.query(query1, [user_id])
            return rows[0][0].user_type
        } catch (err) {
            throw err
        }
    }
    async FindUserID(usermail) {
        let query = "SELECT user_id from users WHERE email_id=?"
        try {
            let rows = await this.connection.query(query, usermail)
            if (rows[0][0]===undefined){
                return null
            }
            return rows[0][0].user_id
        } catch (err) {
            throw err
        }

    }

    async GetPassword(usermail) {
        let query = "SELECT password FROM passwords WHERE email_id=?"
        try {
            let rows = await this.connection.query(query, [usermail])
            if (rows[0][0] === undefined) {
                return null
            }
            return rows[0][0].password
        } catch (err) {
            let newerr = new errorhandler.MySQLErr(err.message, 1, 500)
            throw newerr
        }
    }
}

export default UserModel