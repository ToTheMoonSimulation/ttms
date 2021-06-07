var express = require('express');
var router = express.Router();
var userModel = require('../db/usersModel');
const bcrypt = require('bcrypt');

function getCurrentDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var today = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var milliseconds = date.getMilliseconds();
  return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
}

router.route('/')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  })
  .post(async (req, res) => {
    try {
      console.log(req.body.id, req.body.password);
      var user = new userModel();
      user.id = req.body.id;
      user.password = req.body.password;
      await user.save();
      console.log("register success");
      req.session.id = user.id;
      res.json({
        success: true,
        err: null
      });
    } catch (err) {
      if (err)
        res.json({
          success: false,
          err
        });
      console.log(err);
    }
  })
  .put(async (req, res) => {
    try {
      var user = await userModel.findOne({
        id: req.body.id
      });
      var salt = 10;
      var newPassword = await bcrypt.hash(req.body.password, salt);

      var newObj = {
        password: newPassword,
        updatedTime: getCurrentDate()
      };

      await userModel.updateOne({
        id: user.id,
      }, newObj);
      await user.save();

      var match = await bcrypt.compare(req.body.password, newPassword);
      console.log(newPassword, ':', match);
      res.json({
        success: true,
        err: null
      });
    } catch (err) {
      if (err)
        res.json({
          success: false,
          err
        });
      console.log(err);
    }
  });

router.route('/logout')
  .get((req, res) => {
    if (req.session.id) {
      req.session.destroy(function (err) {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            err
          });
        } else {
          res.json({
            success: true,
            err: null
          });
        }
      })
    } else {
      res.redirect('/');
    }
  });
router.route('/login')
  .post(async (req, res) => {
    try {
      console.log('hello');
      var docs = await userModel.find({
        id: req.body.id
      });
      console.log(docs);
      console.log(req.body.password);
      console.log(docs[0].password);
      
      var match = await bcrypt.compare(req.body.password,docs[0].password);
      console.log(req.body.password ," == ", docs[0].password, ':', match);
      if(match){
        req.session.id = req.body.id;
        res.json({
          success: true,
          err: null
        });  
      }else{
        res.json({
          success: false,
          err :"비밀번호 틀림"
        });
      }
      
    } catch (err) {
      if (err)
        res.json({
          success: false,
          err
        });
      console.log(err);
    }
  });

module.exports = router;