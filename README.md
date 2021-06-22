# ttms
Simulated investment application for Crypto Currency. <br><br>
화면 설계서 링크(카카오 오븐) : https://ovenapp.io/project/oiq4zpsbxuGrMpBveln9gcgSX0w6Qsar#V3WH1 <br><br>
배포 사이트(구글 앱 엔진) : https://ttms-dot-onyx-hangout-315003.du.r.appspot.com/ <br><br>
Vuetify 링크 : https://vuetifyjs.com/en/components/icons/#color <br><br> 
Vuetify 아이콘 이미지 링크 : https://materialdesignicons.com/ <br><br>

# 설치 매뉴얼
cd backend<br>
npm install<br><br>

cd ../frontend<br>
npm install<br><br>

# 몽고DB URL 수정
backend/db/dbUtils.js <br><br>


```
const name = 'projects/1035293153873/secrets/MONGODB_ATLAS_URI/versions/latest'
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
```
payload 부분을 자신의 몽고DB URL로 대체 입력. 주석 처리도 동일하게.
```
// const name = 'projects/1035293153873/secrets/MONGODB_ATLAS_URI/versions/latest'
let _db;

const mongooseConenct = async (cb) => {
    // const {
    //     SecretManagerServiceClient
    // } = require('@google-cloud/secret-manager');
    // // Instantiates a client
    // const client = new SecretManagerServiceClient();

    // const [version] = await client.accessSecretVersion({
    //     name: name,
    // });

    // // Extract the payload as a string.
    // const payload = version.payload.data.toString();

    mongoose.set('useCreateIndex', true);
    mongoose.connect("자신의 몽고DB URL 입력", {
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
```
