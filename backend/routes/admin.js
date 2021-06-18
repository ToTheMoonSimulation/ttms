var express = require("express");
var router = express.Router();
var scenarioModel = require("../db/scenarioModel");
var userModel = require("../db/usersModel");

function getCurrentDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var today = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var milliseconds = date.getMilliseconds();
  return new Date(
    Date.UTC(year, month, today, hours, minutes, seconds, milliseconds)
  );
}

router
  .route("/")
  .get(async (req, res) => {
    if (!req.session.user_id) {
      res.json({
        success: false,
        err: "session lost",
      });
      return;
    }
    try {
      var docs = await scenarioModel.find();
      var userDocs = await userModel.find();

      if (userDocs.length > 0) {
        res.json({
          success: true,
          docs,
          userDocs,
          err: null,
        });
      } else {
        res.json({
          success: false,
          docs,
          err: "no data",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        success: false,
        err: e,
      });
    }
  })
  .delete(async (req, res) => {
    if (!req.session.user_id) {
      res.json({
        success: false,
        err: "session lost",
      });
      return;
    }
    try {
      var queryUser = await userModel.deleteOne({
        id: req.body.userId,
      });
      var queryScenario = await scenarioModel.deleteOne({
        id: req.body.userId,
      });
      console.log(req.body.userId);
      console.log("deleted");
      console.log(queryUser);
      console.log(queryScenario);
      if (queryUser.deletedCount > 0 || queryScenario.deletedCount > 0) {
        res.json({
          success: true,
          err: null,
        });
      } else {
        res.json({
          success: false,
          err: "delete error",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        success: false,
        err: e,
      });
    }
  });

module.exports = router;
