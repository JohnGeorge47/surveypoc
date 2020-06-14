import cluster from "cluster"
import os from "os"
import config from "../config/config.json"
import app from "./app"

/**
 * *Check if you're in the master process 
 */
if(cluster.isMaster){
    let cpuCount=os.cpus().length
    for(let i=0;i<cpuCount;i++){
      cluster.fork()
    }
    cluster.on('exit',function(worker){
      console.log(`Worker ${worker.id} died :(`);
      cluster.fork()
    })
  }else{
    app.listen(config.PORT, (req, res) => {
        console.log(`Server listening on port: ${config.PORT}`)
  })
}

