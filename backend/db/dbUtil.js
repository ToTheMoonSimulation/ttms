const mongoose = require('mongoose');

const name = 'projects/1035293153873/secrets/MONGODB_ATLAS_URI/versions/1'
let _db;

const mongooseConenct = async (cb) => {
    const {
        SecretManagerServiceClient
    } = require('@google-cloud/secret-manager');
    // Instantiates a client
    const client = new SecretManagerServiceClient();

    const [version] = await client.accessSecretVersion({
        name: name,
    });

    // Extract the payload as a string.
    const payload = version.payload.data.toString();

    mongoose.set('useCreateIndex', true);
    mongoose.connect(payload, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((db) => {
            _db = db;
            console.log('Connected to the database.');
            cb();
        })
        .catch((err) => {
            console.log('Cannot connect to the database.\n', err);
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