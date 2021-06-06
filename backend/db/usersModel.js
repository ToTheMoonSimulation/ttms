const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;


function getCurrentDate(){
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

var userSchema = new Schema({
    id: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
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
});
userSchema.pre('save', async function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    user.password = await bcrypt.hash(user.password, SALT_WORK_FACTOR);
    next();
});

/*
1st param - name <String> model name
2nd param - [schema] <Schema> schema name
3rd param - [collection] <String> collection name (optional, induced from model name)
*/
module.exports = mongoose.model('users', userSchema, 'users');