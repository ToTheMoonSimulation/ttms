var express = require('express');
var router = express.Router();
var scenarioModel = require('../db/scenarioModel');


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
    .get(async (req, res) => {
        if (!req.session.user_id) {
            res.json({
                success: false,
                err: "session lost"
            });
            return;
        }
        try {
            var docs = await scenarioModel.find({
                id: req.session.user_id
            });
            console.log(docs);
            if (docs.length > 0) {
                res.json({
                    success: true,
                    docs,
                    err: null
                });
            }else{
                res.json({
                    success: false,
                    docs,
                    err: "no data"
                });
            }
        } catch (e) {
            res.json({
                success: false,
                err: e
            })
        }
    })
    .post(async (req, res) => {
        if (!req.session.user_id) {
            res.json({
                success: false,
                err: "session lost"
            });
            return;
        }
        try {
            var doc = await scenarioModel.findOne({
                id: req.session.user_id
            });
            console.log(doc);

            if (doc) {
                var failed=false;
                doc.scenarios.some((item)=>{
                    if( item.scenarioName == req.body.name){
                        res.json({
                            success: false,
                            err:"duplicate name"
                        });
                        failed=true;
                        return true;
                    }
                });
                if(failed) return;
                doc.scenarios.push({
                    scenarioName: req.body.name,
                    initBalance: req.body.initBalance,
                    currentBalance: req.body.currentBalance,
                    benefitRatio: req.body.benefitRatio,
                });
                await doc.save();
            } else {
                var scenario = new scenarioModel();
                scenario.id = req.session.user_id;
                scenario.scenarios = [{
                    scenarioName: req.body.name,
                    initBalance: req.body.initBalance,
                    currentBalance: req.body.currentBalance,
                    benefitRatio: req.body.benefitRatio,
                }];
                await scenario.save();
                console.log("save success");
            }

            res.json({
                success: true,
                err: null
            });

        } catch (err) {
            res.json({
                success: false,
                err
            });
        }
    })
    .put(async (req, res) => {
        if (!req.session.user_id) {
            res.json({
                success: false,
                err: "session lost"
            });
            return;
        };
        try {
            var doc = await scenarioModel.findOne({
                id: req.session.user_id
            });
            console.log(doc);

            if (doc) {
                doc.scenarios[req.body.idx] = {
                    scenarioName: req.body.name,
                    initBalance: req.body.initBalance,
                    currentBalance: req.body.currentBalance,
                    benefitRatio: req.body.benefitRatio,
                };

                await doc.save();
                console.log("update success");
                res.json({
                    success: true,
                    err: null
                });
            } else {
                res.json({
                    success: false,
                    err: "put: no document found"
                });
            }
        } catch (err) {
            res.json({
                success: false,
                err
            });
        }
    })
    .delete(async (req, res) => {
        if (!req.session.user_id) {
            res.json({
                success: false,
                err: "session lost"
            });
            return;
        };
        try {
            var doc = await scenarioModel.findOne({
                id: req.session.user_id
            });
            console.log(doc);

            if (doc) {
                doc.scenarios.splice(req.body.idx, 1);

                await doc.save();
                console.log("delete success");
                res.json({
                    success: true,
                    err: null
                });
            } else {
                res.json({
                    success: false,
                    err: "delete: no document found"
                });
            }
        } catch (err) {
            console.log(err);
            res.json({
                success: false,
                err
            });
        }
    });

module.exports = router;