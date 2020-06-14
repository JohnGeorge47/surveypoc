import MySQL from "../mysql/mysql"
import mysql from "mysql2/promise"

class SignUpModel extends MySQL{
    constructor(){
        super()
    }
    async Signup(body){
        //I'm adding a transaction her i feel its not he best way to go about this should be ideally put
        //in the mysql module
        let query1="INSERT INTO users(email_id,age,gender,user_type) VALUES(?,?,?,?)"
        let inserts=[body.email_id,body.age,body.gender,body.user_type]
        let query2="INSERT INTO passwords(email_id,user_id,password) VALUES(?,?,?)"
        const conn=await this.connection.getConnection()
        await conn.beginTransaction();
        try{
            let results=await conn.query(query1,inserts)
            let lastinsert=results[0].insertId
            console.log(lastinsert)
            let query2inserts=[body.email_id,lastinsert,body.password]
            let res=await conn.query(query2,query2inserts)
            await conn.commit()

        }catch(err){
            await conn.rollback()
            throw err
        }finally{
            conn.release()
        }
    }

}

export default SignUpModel