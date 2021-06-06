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
    .get(async (req, res, next) => {
        try {
            var docs = await userModel.find({});
            console.log(docs);
            res.json(docs);
        } catch (err) {
            if (err) throw err;
        }
    })
    .post(async (req, res) => {
        try {
            console.log(req.body.id, req.body.password);
            var user = new userModel();
            user.id = req.body.id;
            user.password = req.body.password;
            await user.save();
            console.log("save success");
            res.redirect(302, '/login');
        } catch (err) {
            if (err) throw err;
        }
    })
    .put(async (req,res)=>{
        try {
            var user = await userModel.findOne({
                id: req.body.id
            });
            if (!user) {
                console.log('no user found');
                res.redirect(302, '/login');
                return;
            }
            var newPassword = await bcrypt.hash(req.body.password, 10);
    
            var testObj = {
                id: "ascccchjhc",
                password: newPassword,
                updatedTime: getCurrentDate()
            };
    
            await userModel.updateOne({
                id: user.id,
            }, testObj);
            await user.save();
    
            var match = await bcrypt.compare(req.body.password, newPassword);
            console.log(newPassword, ':', match);
            res.redirect(302, '/login');
        } catch (err) {
            if (err) throw err;
        }
    })
    .delete(async (req,res)=>{
        try {
            console.log(req.body.id);
            await userModel.remove({
                id: req.body.id
            });
    
            res.redirect(302, '/login');
        } catch (err) {
            if (err) throw err;
        }
    });

module.exports = router;