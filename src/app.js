import express from "express"
import bodyParser from "body-parser"
import httpContext from "express-http-context"
import router from "./routes";

const app = express()
let startTime = new Date();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(httpContext.middleware);
app.use("/api", router)
app.get("/", function (req, res) {
    res.json({
        start_time: startTime,
        uptime: `${(Math.abs(startTime.getTime() - new Date().getTime())/1000)} seconds`
    })
})
export default app