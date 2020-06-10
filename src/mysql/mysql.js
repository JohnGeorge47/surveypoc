import mysql from "mysql"
import  config from '../../config/config.json'

class MySQL {
    constructor() {
        this.connection = mysql.createConnection({
            host:config.MYSQL_USERNAME,
            user: MYSQL_USERNAME,
            password: MYSQL_PASSWORD,
            database: MYSQL_DB
        })
    }
    DoQuery(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, function (err, rows, fields) {
                if (err) {
                    return reject(err)
                }
                return resolve(rows)
            })
        })
    }
    Close(){
        return new Promise((resolve,reject)=>{
            this.connection.end(function(err){
                if(err){
                   return reject(err)
                }
                return resolve("closed successfuly")
            })
        })
    }

}

export default MySQL