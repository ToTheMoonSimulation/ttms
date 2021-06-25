const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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

var scenarioSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    scenarios: [{
        scenarioName: {
            type: String,
            required: true
        },
        initBalance: {
            type: Number,
            required: true
        },
        currentBalance: {
            type: Number,
        },
        benefitRatio: {
            type: Number,
        },
        coinHoldings:[
            {
                coinCode :{
                    type:String
                },
                quantity : {
                    type:Number
                },
                priceAvg : {
                    type:Number
                },
                krw:{
                    type:Number
                }
            }
        ],
        tradeHistory:[
            {
                coinCode :{
                    type:String
                },
                price :{
                    type:Number
                },
                quantity : {
                    type:Number
                },
                tradeType:{
                    type:String
                },
                tradeDate:{
                    type:Date
                }
            }
        ],
        createdTime: {
            type: Date,
            required: true,
            default: getCurrentDate,
        },
        updatedTime: {
            type: Date,
            required: true,
            default: getCurrentDate,
        },
    }],
});

/*
1st param - name <String> model name
2nd param - [schema] <Schema> schema name
3rd param - [collection] <String> collection name (optional, induced from model name)
*/
module.exports = mongoose.model('scenarios', scenarioSchema, 'scenarios');