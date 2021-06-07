<template>
  <v-app>
    <v-app-bar app elevate-on-scroll>
      <v-img
        class="mx-2"
        :src="require('@/assets/logo.png')"
        max-height="40"
        max-width="40"
        contain
      ></v-img>
      <v-app-bar-title> To The Moon Simulation</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-dialog v-model="loginDialog" v-if="loginSuccess === false">
        <template v-slot:activator="{ on: dialog, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon v-bind="attrs" v-on="{ ...tooltip, ...dialog }">
                <v-icon color="green darken-2" dark>
                  mdi-login
                </v-icon>
              </v-btn>
            </template>
            <span>로그인</span>
          </v-tooltip>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">로그인</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="아이디*"
                    required
                    :rules="idRules"
                    v-model="id"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="비밀번호*"
                    type="password"
                    required
                    :rules="passwordRules"
                    v-model="password"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*표시는 반드시 채워야 합니다.</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="loginDialog = false">
              취소
            </v-btn>
            <v-btn color="blue darken-1" text @click="loginBtn">
              로그인
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="registerDialog" v-if="loginSuccess === false">
        <template v-slot:activator="{ on: dialog, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon v-bind="attrs" v-on="{ ...tooltip, ...dialog }">
                <v-icon color="blue darken-2">
                  mdi-account-plus
                </v-icon>
              </v-btn>
            </template>
            <span>회원가입</span>
          </v-tooltip>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">회원가입</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="아이디*"
                    v-model="id"
                    required
                    :rules="idRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="비밀번호*"
                    type="password"
                    required
                    :rules="passwordRules"
                    v-model="password"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="비밀번호 재입력*"
                    type="password"
                    required
                    :rules="[
                      password === confirm_password || 'Password must match',
                    ]"
                    v-model="confirm_password"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*표시는 반드시 채워야 합니다.</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="registerDialog = false">
              취소
            </v-btn>
            <v-btn color="blue darken-1" text @click="submitBtn">
              회원가입
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-tooltip bottom v-if="loginSuccess === true">
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            icon
            v-on="{ ...tooltip }"
            @click="$router.push({ name: 'dashboard' }).catch(() => {})"
          >
            <v-icon color="blue darken-2" dark>
              mdi-view-dashboard
            </v-icon>
          </v-btn>
        </template>
        <span>대시보드</span>
      </v-tooltip>

      <v-dialog v-model="modifyDialog" v-if="loginSuccess === true">
        <template v-slot:activator="{ on: dialog, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon v-bind="attrs" v-on="{ ...tooltip, ...dialog }">
                <v-icon color="green darken-2" dark>
                  mdi-card-account-details
                </v-icon>
              </v-btn>
            </template>
            <span>계정 정보</span>
          </v-tooltip>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">계정 정보</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="id"
                    label="아이디*"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="비밀번호*"
                    type="password"
                    required
                    :rules="passwordRules"
                    v-model="password"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="비밀번호 재입력*"
                    type="password"
                    required
                    :rules="[
                      password === confirm_password || 'Password must match',
                    ]"
                    v-model="confirm_password"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*표시는 반드시 채워야 합니다.</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="modifyDialog = false">
              취소
            </v-btn>
            <v-btn color="blue darken-1" text @click="modifyAccountBtn">
              수정
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-tooltip bottom v-if="loginSuccess === true">
        <template v-slot:activator="{ on: tooltip }">
          <v-btn icon v-on="{ ...tooltip }" @click="logoutBtn">
            <v-icon color="red darken-2" dark>
              mdi-logout
            </v-icon>
          </v-btn>
        </template>
        <span>로그아웃</span>
      </v-tooltip>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <v-card class="mx-auto my-12">
          <v-card-text>
            <v-timeline align-top dense style="text-align:center;">
              <v-timeline-item color="purple">
                <p class="text-h4 text--primary">
                  투 더 문!
                </p>
              </v-timeline-item>
              <v-timeline-item color="green">
                <p class="text-h4 text--primary">
                  암호화폐 모의투자 어플리케이션
                </p>
              </v-timeline-item>
              <v-timeline-item>
                <v-btn
                  color="primary"
                  x-large
                  @click="$router.push({ name: 'play' })"
                  >지금 시작해보세요!</v-btn
                >
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>

        <v-row no-gutters>
          <v-col cols="12" sm="4">
            <v-card class="pa-2" outlined tile>
              <p>도지 코인</p>
              <div
                style="text-align:center;"
                id="dogeChart"
                ref="dogeChart"
              ></div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="pa-2" outlined tile>
              <p>비트 코인</p>
              <div id="btcChart" ref="btcChart"></div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="pa-2" outlined tile>
              <p>이더리움</p>
              <div id="ethChart" ref="ethChart"></div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import { createChart } from "lightweight-charts";

export default {
  data: () => ({
    loginDialog: false,
    registerDialog: false,
    id: "",
    password: "",
    confirm_password: "",
    idRules: [(v) => !!v || "아이디를 입력해주십시오"],
    passwordRules: [(v) => !!v || "패스워드를 입력해주십시오"],
    loginSuccess: false,
    accountDialog: false,
    modifyDialog: false,
  }),
  methods: {
    initForm: function() {
      this.id = "";
      this.password = "";
      this.confirm_password = "";
    },
    submitBtn: function() {
      axios
        .post("https://ttms-dot-onyx-hangout-315003.du.r.appspot.com/api/users", {
            id: this.id,
            password: this.password,
        })
        .then((e) => {
          if (e.data.success == true) {
            console.log("회원가입 성공!");
            this.registerDialog = false;
            this.loginSuccess = true;
          } else {
            // if (e.data.err.code == 11000) {
            //   console.log("아이디 중복 에러!");
            // } else {
              console.log(e);
            console.log(e.data.err || "에러!");
            this.loginSuccess = false;
            // }
          }
        });
    },
    modifyAccountBtn: function() {
      axios
        .put("/api/users", {
            id: this.id,
            password: this.password,
          
        })
        .then((e) => {
          if (e.data.success == true) {
            console.log("수정 성공!");
            this.modifyDialog = false;
          } else {
            console.log(e.data.err || "에러!");
          }
        });
    },
    loginBtn: function() {
      console.log({
        id: this.id,
        password: this.password,
      });
      axios
        .post("/api/users/login", {
            id: this.id,
            password: this.password,
         
        })
        .then((e) => {
          console.log(e);
          if (e.data.success == true) {
            console.log("로그인 성공!");
            this.loginDialog = false;
            this.loginSuccess = true;
          } else {
            console.log(e.data.err || "에러!");
            this.loginSuccess = false;
          }
        });
    },
    logoutBtn: function() {
      axios
        .post("/api/users/logout", {
            id: this.id,
            password: this.password
        })
        .then((e) => {
          if (e.data.success == true) {
            console.log("로그아웃 성공!");
            this.loginDialog = false;
            this.loginSuccess = false;
          } else {
            console.log(e.data.err || "에러!");
          }
          this.loginSuccess = false;
        });
    },
  },
  mounted() {
    axios
      .get("https://api.upbit.com/v1/market/all?isDetails=false")
      .then((e) => {
        var allMarkets = e.data;
        var krwMarkets = [];
        allMarkets.some((item) => {
          if (item.market.startsWith("KRW")) {
            krwMarkets.push(item);
          }
        });
        axios
          .get(
            "https://api.upbit.com/v1/candles/days?market=KRW-DOGE&count=200"
          )
          .then((e) => {
            var datas = e.data;
            var arrInfos = [];
            var chart = createChart(this.$refs.dogeChart, {
              width: 500,
              height: 400,
              layout: {
                backgroundColor: "#ffffff",
                textColor: "rgba(33, 56, 77, 1)",
              },
              grid: {
                vertLines: {
                  color: "rgba(197, 203, 206, 0.7)",
                },
                horzLines: {
                  color: "rgba(197, 203, 206, 0.7)",
                },
              },
              timeScale: {
                timeVisible: true,
                secondsVisible: true,
              },
            });
            var lineSeries = chart.addLineSeries();
            datas.some((item) => {
              arrInfos.push({
                time: parseInt(item.timestamp / 1000),
                value: item.trade_price,
              });
            });
            arrInfos = arrInfos.reverse();
            lineSeries.setData(arrInfos);
            axios
              .get(
                "https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=200"
              )
              .then((e) => {
                var datas = e.data;
                var arrInfos = [];
                var chart = createChart(this.$refs.btcChart, {
                  width: 500,
                  height: 400,
                  layout: {
                    backgroundColor: "#ffffff",
                    textColor: "rgba(33, 56, 77, 1)",
                  },
                  grid: {
                    vertLines: {
                      color: "rgba(197, 203, 206, 0.7)",
                    },
                    horzLines: {
                      color: "rgba(197, 203, 206, 0.7)",
                    },
                  },
                  timeScale: {
                    timeVisible: true,
                    secondsVisible: true,
                  },
                });
                var lineSeries = chart.addLineSeries();
                datas.some((item) => {
                  arrInfos.push({
                    time: parseInt(item.timestamp / 1000),
                    value: item.trade_price,
                  });
                });
                arrInfos = arrInfos.reverse();
                lineSeries.setData(arrInfos);
              });
            axios
              .get(
                "https://api.upbit.com/v1/candles/days?market=KRW-ETH&count=200"
              )
              .then((e) => {
                var datas = e.data;
                var arrInfos = [];
                var chart = createChart(this.$refs.ethChart, {
                  width: 500,
                  height: 400,
                  layout: {
                    backgroundColor: "#ffffff",
                    textColor: "rgba(33, 56, 77, 1)",
                  },
                  grid: {
                    vertLines: {
                      color: "rgba(197, 203, 206, 0.7)",
                    },
                    horzLines: {
                      color: "rgba(197, 203, 206, 0.7)",
                    },
                  },
                  timeScale: {
                    timeVisible: true,
                    secondsVisible: true,
                  },
                });
                var lineSeries = chart.addLineSeries();
                datas.some((item) => {
                  arrInfos.push({
                    time: parseInt(item.timestamp / 1000),
                    value: item.trade_price,
                  });
                });
                arrInfos = arrInfos.reverse();
                lineSeries.setData(arrInfos);
              });
          });
      });
  },
};
</script>

<style></style>
