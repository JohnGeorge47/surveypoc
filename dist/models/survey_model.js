"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _users_model = _interopRequireDefault(require("./users_model"));

var _mysql = _interopRequireDefault(require("../mysql/mysql"));

var _error_handler = _interopRequireDefault(require("../utils/error_handler/error_handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

//Here i'm checking user type via hardcoding ideally should be a join or subquery
var SurveyModel = /*#__PURE__*/function (_MySQL) {
  _inherits(SurveyModel, _MySQL);

  var _super = _createSuper(SurveyModel);

  function SurveyModel() {
    _classCallCheck(this, SurveyModel);

    return _super.call(this);
  }
  /*Ideally this should be a little different for inserting into the survey_users tables
    1.Individual inserts generally get slower especially when the set to insert is very large
    2.Can be solved by batch inserts or by writing into a csv and then insert from file if the size
     too large or put a cap on the target number of users you can send your survey(bad ux tho)
  */


  _createClass(SurveyModel, [{
    key: "CreateSurvey",
    value: function () {
      var _CreateSurvey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(email, surveydetails) {
        var um, user_id, newerr, user_type, _newerr, current_timestamp, updated_timestamp, surveyTableInsertQuery, to_insert, insert_survey, inserts, _newerr2;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                um = new _users_model["default"]();
                _context.prev = 1;
                _context.next = 4;
                return um.FindUserID(email);

              case 4:
                user_id = _context.sent;

                if (!(user_id == null)) {
                  _context.next = 8;
                  break;
                }

                newerr = new _error_handler["default"].UserDoesNotExist("the user does not exist", 1, 404);
                throw newerr;

              case 8:
                console.log(user_id);
                _context.next = 11;
                return um.Findrole(user_id);

              case 11:
                user_type = _context.sent;

                if (!(user_type == 2)) {
                  _context.next = 15;
                  break;
                }

                _newerr = new _error_handler["default"].NoPermissionError("the user does not have permission", 2, 405);
                throw _newerr;

              case 15:
                current_timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
                updated_timestamp = current_timestamp;
                surveyTableInsertQuery = "INSERT INTO createdsurveys(created_by,title,created_at,updated_at,description,survey_json) VALUES(?,?,?,?,?,?)";
                to_insert = [user_id, surveydetails.title, current_timestamp, updated_timestamp, surveydetails.description, JSON.stringify(surveydetails.data)];
                console.log(to_insert);
                _context.next = 22;
                return this.connection.query(surveyTableInsertQuery, to_insert);

              case 22:
                insert_survey = _context.sent;
                _context.next = 25;
                return this.AddToSurveyMapTable(current_timestamp, insert_survey[0].insertId, surveydetails);

              case 25:
                inserts = _context.sent;
                _context.next = 33;
                break;

              case 28:
                _context.prev = 28;
                _context.t0 = _context["catch"](1);
                console.log(_context.t0);
                _newerr2 = new _error_handler["default"].MySQLErr(_context.t0.message, 3, 500);
                throw _newerr2;

              case 33:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 28]]);
      }));

      function CreateSurvey(_x, _x2) {
        return _CreateSurvey.apply(this, arguments);
      }

      return CreateSurvey;
    }()
  }, {
    key: "AddToSurveyMapTable",
    value: function () {
      var _AddToSurveyMapTable = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(current_timestamp, insertId, surveydetails) {
        var query, agearr, response, _response, _agearr, _response2, _response3;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                query = "INSERT INTO survey_user_map(survey_id,responded,response_json,user_id) SELECT ?,?,?,user_id from users WHERE user_type=? ";
                console.log(surveydetails.target);

                if (!(surveydetails.target != undefined)) {
                  _context2.next = 48;
                  break;
                }

                if (!(!surveydetails.target.hasOwnProperty("gender") && surveydetails.target.hasOwnProperty('age'))) {
                  _context2.next = 20;
                  break;
                }

                agearr = surveydetails.target.age.split("-");
                query = query + "AND age BETWEEN ? AND ?";
                _context2.prev = 6;
                console.log(query);
                console.log(agearr);
                _context2.next = 11;
                return this.connection.query(query, [insertId, false, JSON.stringify(surveydetails.data), 2, parseInt(agearr[0]), parseInt(agearr[1])]);

              case 11:
                response = _context2.sent;
                return _context2.abrupt("return", response);

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2["catch"](6);
                throw _context2.t0;

              case 18:
                _context2.next = 48;
                break;

              case 20:
                if (!(!surveydetails.target.hasOwnProperty("age") && surveydetails.target.hasOwnProperty('gender'))) {
                  _context2.next = 35;
                  break;
                }

                query = query + "AND gender=?";
                console.log(query);
                _context2.prev = 23;
                _context2.next = 26;
                return this.connection.query(query, [insertId, false, JSON.stringify(surveydetails.data), 2, surveydetails.target.gender]);

              case 26:
                _response = _context2.sent;
                return _context2.abrupt("return", _response);

              case 30:
                _context2.prev = 30;
                _context2.t1 = _context2["catch"](23);
                throw _context2.t1;

              case 33:
                _context2.next = 48;
                break;

              case 35:
                if (!(surveydetails.target.hasOwnProperty("age") && surveydetails.target.hasOwnProperty("gender"))) {
                  _context2.next = 48;
                  break;
                }

                _agearr = surveydetails.target.age.split("-");
                query = query + "AND gender=? AND age BETWEEN ? AND ?";
                _context2.prev = 38;
                _context2.next = 41;
                return this.connection.query(query, [insertId, false, JSON.stringify(surveydetails.data), 2, surveydetails.target.gender, parseInt(_agearr[0]), parseInt(_agearr[1])]);

              case 41:
                _response2 = _context2.sent;
                return _context2.abrupt("return", _response2);

              case 45:
                _context2.prev = 45;
                _context2.t2 = _context2["catch"](38);
                throw _context2.t2;

              case 48:
                _context2.prev = 48;
                console.log(query);
                _context2.next = 52;
                return this.connection.query(query, [insertId, false, JSON.stringify(surveydetails.data), 2]);

              case 52:
                _response3 = _context2.sent;
                return _context2.abrupt("return", _response3);

              case 56:
                _context2.prev = 56;
                _context2.t3 = _context2["catch"](48);
                throw _context2.t3;

              case 59:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[6, 15], [23, 30], [38, 45], [48, 56]]);
      }));

      function AddToSurveyMapTable(_x3, _x4, _x5) {
        return _AddToSurveyMapTable.apply(this, arguments);
      }

      return AddToSurveyMapTable;
    }() //This handles the survey details

  }, {
    key: "BulkSurveyDetails",
    value: function () {
      var _BulkSurveyDetails = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(email_id) {
        var um, user_id, newerr, user_type, _result, result;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                um = new _users_model["default"]();
                _context3.prev = 1;
                _context3.next = 4;
                return um.FindUserID(email_id);

              case 4:
                user_id = _context3.sent;
                console.log(user_id);

                if (!(user_id == null)) {
                  _context3.next = 9;
                  break;
                }

                newerr = new _error_handler["default"].UserDoesNotExist("the user does not exist", 1, 404);
                throw newerr;

              case 9:
                _context3.next = 11;
                return um.Findrole(user_id);

              case 11:
                user_type = _context3.sent;

                if (!(user_type == 2)) {
                  _context3.next = 17;
                  break;
                }

                _context3.next = 15;
                return this.GetRespondentSurveys(user_id);

              case 15:
                _result = _context3.sent;
                return _context3.abrupt("return", _result);

              case 17:
                _context3.next = 19;
                return this.GetCoordinatorSurvey(user_id);

              case 19:
                result = _context3.sent;
                return _context3.abrupt("return", result);

              case 23:
                _context3.prev = 23;
                _context3.t0 = _context3["catch"](1);
                throw _context3.t0;

              case 26:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 23]]);
      }));

      function BulkSurveyDetails(_x6) {
        return _BulkSurveyDetails.apply(this, arguments);
      }

      return BulkSurveyDetails;
    }()
    /**
     * To get all surveys created by the coordinator
     * @param user_id coordinator id
     */

  }, {
    key: "GetCoordinatorSurvey",
    value: function () {
      var _GetCoordinatorSurvey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(user_id) {
        var query, rows, result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                /**
                 *We do a join with the createdsurveys table and the survey_user_map
                 *To get all the details
                 */
                query = "SELECT\n                        m.map_id,\n                        m.responded,\n                        m.response_json,\n                        m.updated_at,\n                        s.created_at,\n                        s.title,\n                        s.survey_id,\n                        s.description\n                    FROM\n                        survey_user_map AS m\n                        INNER JOIN createdsurveys AS s\n                        ON m.survey_id=s.survey_id\n                    WHERE\n                        s.created_by=?";
                _context4.prev = 1;
                _context4.next = 4;
                return this.connection.query(query, [user_id]);

              case 4:
                rows = _context4.sent;

                if (!(rows[0].length == 0)) {
                  _context4.next = 7;
                  break;
                }

                return _context4.abrupt("return", null);

              case 7:
                result = [];
                rows[0].forEach(function (element) {
                  var respJson = Object.assign({}, element);
                  result.push(respJson);
                });
                return _context4.abrupt("return", result);

              case 12:
                _context4.prev = 12;
                _context4.t0 = _context4["catch"](1);
                throw _context4.t0;

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 12]]);
      }));

      function GetCoordinatorSurvey(_x7) {
        return _GetCoordinatorSurvey.apply(this, arguments);
      }

      return GetCoordinatorSurvey;
    }()
  }, {
    key: "GetRespondentSurveys",
    value: function () {
      var _GetRespondentSurveys = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(user_id) {
        var query, rows, result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                query = "SELECT\n                     m.map_id,\n                     m.responded,\n                     m.response_json,\n                     m.updated_at,\n                     s.created_at,\n                     s.title,\n                     s.survey_id,\n                     s.description\n                   FROM\n                     survey_user_map AS m\n                   INNER JOIN createdsurveys AS s\n                     ON m.survey_id=s.survey_id\n                   WHERE\n                     m.user_id=?";
                _context5.prev = 1;
                _context5.next = 4;
                return this.connection.query(query, [user_id]);

              case 4:
                rows = _context5.sent;

                if (!(rows[0].length == 0)) {
                  _context5.next = 7;
                  break;
                }

                return _context5.abrupt("return", null);

              case 7:
                result = [];
                rows[0].forEach(function (element) {
                  var respJson = Object.assign({}, element);
                  result.push(respJson);
                });
                return _context5.abrupt("return", result);

              case 12:
                _context5.prev = 12;
                _context5.t0 = _context5["catch"](1);
                throw _context5.t0;

              case 15:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[1, 12]]);
      }));

      function GetRespondentSurveys(_x8) {
        return _GetRespondentSurveys.apply(this, arguments);
      }

      return GetRespondentSurveys;
    }()
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

  }, {
    key: "UpdateSurvey",
    value: function () {
      var _UpdateSurvey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(survey_id, reqbody) {
        var email_id, um, user_id, newerr, user_type;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                email_id = reqbody.email_id;
                um = new _users_model["default"]();
                _context6.prev = 2;
                _context6.next = 5;
                return um.FindUserID(email_id);

              case 5:
                user_id = _context6.sent;

                if (!(user_id == null)) {
                  _context6.next = 9;
                  break;
                }

                newerr = new _error_handler["default"].UserDoesNotExist("the user does not exist", 1, 404);
                throw newerr;

              case 9:
                _context6.next = 11;
                return um.Findrole(user_id);

              case 11:
                user_type = _context6.sent;

                if (!(user_type == 2)) {
                  _context6.next = 16;
                  break;
                }

                _context6.next = 15;
                return this.UpdateRespondentSurvey(survey_id, user_id, reqbody.response_json);

              case 15:
                return _context6.abrupt("return");

              case 16:
                _context6.next = 18;
                return this.UpdateCoordinatorSurvey(survey_id, user_id, reqbody.response_json);

              case 18:
                _context6.next = 23;
                break;

              case 20:
                _context6.prev = 20;
                _context6.t0 = _context6["catch"](2);
                throw _context6.t0;

              case 23:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[2, 20]]);
      }));

      function UpdateSurvey(_x9, _x10) {
        return _UpdateSurvey.apply(this, arguments);
      }

      return UpdateSurvey;
    }()
    /**
     * 
     * @param survey_id this is the id of the survey being sent 
     * @param user_id the id of the respondant
     * @param respJson the response json to be recorded
     */

  }, {
    key: "UpdateRespondentSurvey",
    value: function () {
      var _UpdateRespondentSurvey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(survey_id, user_id, respJson) {
        var query1, query2, rows, newerr, current_timestamp, result;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                console.log(survey_id, user_id); //This query is used to check if the respondent has answered this survey before
                //if true then we throw an error saying permission denied

                query1 = "SELECT responded FROM survey_user_map \n                    WHERE survey_id=? AND user_id=?"; //This query is used to insert the response sent by the respondant as well as update
                //the responded to true so the person cant submit the form again

                query2 = "UPDATE survey_user_map\n                    SET response_json=?,updated_at=?,responded=? WHERE survey_id=? AND user_id=?";
                _context7.prev = 3;
                _context7.next = 6;
                return this.connection.query(query1, [survey_id, user_id]);

              case 6:
                rows = _context7.sent;

                if (!rows[0][0].responded) {
                  _context7.next = 10;
                  break;
                }

                newerr = new _error_handler["default"].NoPermissionError("the user does not have permission", 2, 405);
                throw newerr;

              case 10:
                current_timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
                _context7.next = 13;
                return this.connection.query(query2, [JSON.stringify(respJson), current_timestamp, true, survey_id, user_id]);

              case 13:
                result = _context7.sent;
                console.log(result);
                _context7.next = 20;
                break;

              case 17:
                _context7.prev = 17;
                _context7.t0 = _context7["catch"](3);
                throw _context7.t0;

              case 20:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[3, 17]]);
      }));

      function UpdateRespondentSurvey(_x11, _x12, _x13) {
        return _UpdateRespondentSurvey.apply(this, arguments);
      }

      return UpdateRespondentSurvey;
    }()
    /**
     * The function is used to update the survey for the coordinator as well as the respondants
     * @param  survey_id The survey id you are looking for
     * @param  user_id  The user_id of the coordinator
     * @param  respJson The change json
     * returns null or throws an error
     */

  }, {
    key: "UpdateCoordinatorSurvey",
    value: function () {
      var _UpdateCoordinatorSurvey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(survey_id, user_id, respJson) {
        var query1, query2, current_timestamp, conn, query1_result, query2_result;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                /**
                 * In this function im doing a transaction 
                 * 1.To update the createdsurveys table with the new survey json
                 * 2.To update survey for all the respondants of this particular survey
                 */
                query1 = "UPDATE createdsurveys\n                    SET survey_json=?,updated_at=? WHERE survey_id=? AND created_by=?";
                query2 = "UPDATE survey_user_map\n                    SET response_json=?,updated_at=? WHERE survey_id=?";
                current_timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
                _context8.next = 5;
                return this.connection.getConnection();

              case 5:
                conn = _context8.sent;
                _context8.next = 8;
                return conn.beginTransaction();

              case 8:
                _context8.prev = 8;
                _context8.next = 11;
                return conn.query(query1, [JSON.stringify(respJson), current_timestamp, survey_id, user_id]);

              case 11:
                query1_result = _context8.sent;
                console.log(query1_result);
                _context8.next = 15;
                return conn.query(query2, [JSON.stringify(respJson), current_timestamp, survey_id]);

              case 15:
                query2_result = _context8.sent;
                console.log(query2_result);
                _context8.next = 19;
                return conn.commit();

              case 19:
                _context8.next = 24;
                break;

              case 21:
                _context8.prev = 21;
                _context8.t0 = _context8["catch"](8);
                throw _context8.t0;

              case 24:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[8, 21]]);
      }));

      function UpdateCoordinatorSurvey(_x14, _x15, _x16) {
        return _UpdateCoordinatorSurvey.apply(this, arguments);
      }

      return UpdateCoordinatorSurvey;
    }()
  }]);

  return SurveyModel;
}(_mysql["default"]);

var _default = SurveyModel;
exports["default"] = _default;