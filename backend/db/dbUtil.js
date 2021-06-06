const mongoose = require('mongoose');
var url = 'mongodb+srv://admin:E8Dh22i-fSbjL6x@cluster0.ylv2g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
let _db;

const mongooseConenct = (cb) => {
    mongoose.set('useCreateIndex', true);
    mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((db) => {
            _db = db;
            console.log('Connected to the database.');
            cb();
        })
        .catch((err) => {
            console.log('Cannot connect to the database.\n' ,err);
            process.exit();
        });
};

const getDB = () => {
    if (_db) {
        return _db;
    } else {
        throw new Error('DB get failed');
    }
}

exports.mongooseConenct = mongooseConenct;
exports.getDB = getDB;