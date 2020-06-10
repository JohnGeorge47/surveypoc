export class JSONStrategy {
    send(res, data, status) {
        res.status(status).json(data)
    }
}

module.exports={
    JSONStrategy
}