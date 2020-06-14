class SurveyAppError extends Error {
    constructor(message, id, status) {
        super()
        this.name = this.constructor.name
        this.code = status
        this.message = message
        Error.captureStackTrace(this, this.constructor)
    }

}

class MySQLErr extends SurveyAppError {
    constructor(message, id, status) {
        super(message, id, 500)
    }
}

class HttpErr extends SurveyAppError {
    constructor(message, id, status) {
        super(message, id, status)
    }
}

class NoPermissionError extends SurveyAppError {
    constructor(message, id, status) {
        super(message, id, 403)
    }
}

class UserDoesNotExist extends SurveyAppError {
    constructor(message, id, status) {
        super(message, id, 404)
    }
}

class WrongPasswordError extends SurveyAppError{
    constructor(message,id,status){
        super(message,id,status)
    }
}

module.exports = {
    WrongPasswordError,
    SurveyAppError,
    MySQLErr,
    HttpErr,
    NoPermissionError,
    UserDoesNotExist
}