var express = require("express");
var router = express.Router();
var scenarioModel = require("../db/scenarioModel");

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

router.route("/buy").post(async (req, res) => {
  if (!req.session.user_id) {
    res.json({
      success: false,
      err: "session lost",
    });
    return;
  }
  try {
    var doc = await scenarioModel.findOne({
      id: req.session.user_id,
      "scenarios.scenarioName": req.body.name,
    });

    if (doc) {
      var scenarioFound = false;
      var coinFound = false;
      var scenarioIdx = 0;
      doc.scenarios.some((scenarioItem) => {
        if (scenarioItem.scenarioName == req.body.name) {
          scenarioFound = true;
          return true;
        }
        scenarioIdx++;
      });
      if (!scenarioFound) {
        res.json({
          success: false,
          err: "scenario Not Found",
        });
        return;
      }

      doc.scenarios[scenarioIdx].tradeHistory.push({
        coinCode: req.body.code,
        price: req.body.currentPrice,
        quantity: Math.round(req.body.quantity * 10000) / 10000,
        tradeType: req.body.tradeType,
        tradeDate: getCurrentDate(),
      });

      doc.scenarios[scenarioIdx].coinHoldings.some((item) => {
        if (item.coinCode == req.body.code) {
          var prev = item.quantity * item.priceAvg;
          var current = req.body.quantity * req.body.currentPrice;
          item.priceAvg =
            (prev + current) / (item.quantity + req.body.quantity);
          item.priceAvg = Math.round(item.priceAvg);
          item.quantity += req.body.quantity;
          item.quantity = Math.round(item.quantity * 10000) / 10000;
          item.krw += req.body.krw;
          coinFound = true;
          return true;
        }
      });
      if (coinFound == true) {
        doc.scenarios[scenarioIdx].currentBalance -= req.body.krw;
        await doc.save();
        res.json({
          success: true,
          err: null,
        });
        return;
      } else {
        doc.scenarios[scenarioIdx].coinHoldings.push({
          coinCode: req.body.code,
          quantity: Math.round(req.body.quantity * 10000) / 10000,
          priceAvg: Math.round(req.body.currentPrice * 100) / 100,
          krw: req.body.krw,
        });
        doc.scenarios[scenarioIdx].currentBalance -= req.body.krw;

        await doc.save();
        res.json({
          success: true,
          err: null,
        });
        return;
      }
    }
    res.json({
      success: false,
      err: "error while buying",
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      err,
    });
  }
});

router.route("/sell").post(async (req, res) => {
  if (!req.session.user_id) {
    res.json({
      success: false,
      err: "session lost",
    });
    return;
  }

  try {
    var doc = await scenarioModel.findOne({
      id: req.session.user_id,
      "scenarios.scenarioName": req.body.name,
    });

    if (doc) {
      var scenarioFound = false;
      var coinFound = false;
      var scenarioIdx = 0;
      doc.scenarios.some((scenarioItem) => {
        if (scenarioItem.scenarioName == req.body.name) {
          scenarioFound = true;
          return true;
        }
        scenarioIdx++;
      });
      if (!scenarioFound) {
        res.json({
          success: false,
          err: "scenario Not Found",
        });
        return;
      }

      var benefit = 0;
      var benefitRatio = 0;
      var deleteIdx = 0;
      var isDeleteTarget = false;
      doc.scenarios[scenarioIdx].coinHoldings.some((item) => {
        if (item.coinCode == req.body.code) {
          var quantity =
            Math.round(item.quantity * (req.body.percent / 100) * 10000) /
            10000;

          doc.scenarios[scenarioIdx].tradeHistory.push({
            coinCode: req.body.code,
            price: req.body.currentPrice,
            quantity,
            tradeType: req.body.tradeType,
            tradeDate: getCurrentDate(),
          });

          item.krw = item.krw * (req.body.percent / 100);
          var a = quantity * req.body.currentPrice;
          var b = item.krw;
          benefitRatio = (b == 0) ? 0 : (a - b) / b;
          benefit = item.krw + Math.round(item.krw * benefitRatio);

          console.log(`a : ${a}, b: ${b}, a-b : ${a-b}, (a-b)/b : ${(a-b)/b}`);
          console.log(`quantity : ${quantity}`);
          console.log(`benefitRatio : ${benefitRatio}`);
          console.log(`benefit : ${benefit}`);

          benefitRatio=Math.round(benefitRatio * 1000)/1000;

          item.quantity -= quantity;
          item.quantity = Math.round(item.quantity * 10000) / 10000;
          if (item.quantity <= 0) {
            item.quantity = 0;
            isDeleteTarget = true;
          }
          coinFound = true;
          return true;
        }
        deleteIdx++;
      });
      if (coinFound == true) {
        doc.scenarios[scenarioIdx].currentBalance += benefit;
        doc.scenarios[scenarioIdx].benefitRatio += benefitRatio;

        if (isDeleteTarget) {
          console.log("a");
          doc.scenarios[scenarioIdx].coinHoldings.splice(deleteIdx, 1);
        }
        await doc.save();
        res.json({
          success: true,
          err: null,
        });
        return;
      } else {
        res.json({
          success: false,
          err: "coin doesn't exist",
        });
        return;
      }
    }
    res.json({
      success: false,
      err: "error while selling",
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      err,
    });
  }
});

module.exports = router;
