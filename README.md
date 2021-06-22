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
mongoose.set('useCreateIndex', true);
    mongoose.connect(payload, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
```
payload 부분을 자신의 몽고DB URL로 대체 입력
```
 mongoose.set('useCreateIndex', true);
    mongoose.connect("자신의 몽고DB URL 입력", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
```
