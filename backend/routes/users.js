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

router.route('/session').get((req, res) => {
    console.log(req.session.user_id);
    if (req.session.user_id) {
        console.log("세션 유지중");
        if (req.session.user_id === "admin") {
            res.json({
                success: true,
                user_id: req.session.user_id,
                adminLogin: true,
                err: null
            });
        } else {
            res.json({
                success: true,
                user_id: req.session.user_id,
                err: null
            });
        }
    } else {
        res.json({
            success: false,
            err: null
        });
    }
});

router.route('/register')
    .post(async (req, res) => {
        try {
            console.log(req.body.id, req.body.password);
            var user = new userModel();
            user.id = req.body.id;
            user.password = req.body.password;
            await user.save();
            console.log("register success");
            req.session.user_id = user.id;
            if (req.session.user_id === "admin") {
                res.json({
                    success: true,
                    user_id: req.session.user_id,
                    adminLogin: true,
                    err: null
                });
            } else {
                res.json({
                    success: true,
                    user_id: req.session.user_id,
                    err: null
                });
            }
        } catch (err) {
            res.json({
                success: false,
                err
            });
        }
    });

router.route('/update')
    .put(async (req, res) => {
        if (!req.session.user_id) {
            res.json({
                success: false,
                err: "you must login first"
            });
        }
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
router.route('/login')
    .post(async (req, res) => {
        try {
            console.log('hello');
            var docs = await userModel.find({
                id: req.body.id
            });
            if(docs.length == 0) throw "no id found";

            var match = await bcrypt.compare(req.body.password, docs[0].password);
            console.log(req.body.password, " == ", docs[0].password, ':', match);
            if (match) {
                req.session.user_id = req.body.id;
                if (req.session.user_id === "admin") {
                    res.json({
                        success: true,
                        adminLogin: true,
                        err: null
                    });
                } else {
                    res.json({
                        success: true,
                        err: null
                    });
                }
            } else {
                res.json({
                    success: false,
                    err: "wrong password"
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
router.route('/logout')
    .post((req, res) => {
        if (req.session.user_id) {
            delete req.session.user_id;
            req.session.destroy(function (err) {
                if (err) {
                    console.log(err);
                    res.redirect('/');
                } else {
                    console.log("로그아웃 성공");
                    req.session = null;
                    res.redirect('/');
                }
            });

        } else {
            res.redirect('/');
        }
    });

module.exports = router;