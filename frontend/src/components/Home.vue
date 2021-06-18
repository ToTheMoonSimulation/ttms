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

      <v-tooltip bottom v-if="isAdminLogin === true">
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            icon
            v-on="{ ...tooltip }"
            @click="
              $router.push({ name: 'admin_memberManagement' }).catch(() => {})
            "
          >
            <v-icon color="blue darken-2" dark>
              mdi-account-cowboy-hat
            </v-icon>
          </v-btn>
        </template>
        <span>관리자 페이지</span>
      </v-tooltip>

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
                id="dogeChartDiv"
                ref="dogeChartDiv"
              ></div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="pa-2" outlined tile>
              <p>비트 코인</p>
              <div id="btcChartDiv" ref="btcChartDiv"></div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="pa-2" outlined tile>
              <p>이더리움</p>
              <div id="ethChartDiv" ref="ethChartDiv"></div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import { createChart, CrosshairMode } from "lightweight-charts";
import ws from "@/libraries/ws";

export default {
  data: () => ({
    loginDialog: false,
    registerDialog: false,
    isAdminLogin: false,
    id: "",
    password: "",
    confirm_password: "",
    idRules: [(v) => !!v || "아이디를 입력해주십시오"],
    passwordRules: [(v) => !!v || "패스워드를 입력해주십시오"],
    loginSuccess: false,
    accountDialog: false,
    modifyDialog: false,
    observer: null,
    dogeChart: null,
    dogeBar: null,
    dogeBarPriceInfo: {},
    btcChart: null,
    btcBar: null,
    btcBarInfos: [],
    btcBarPriceInfo: {},
    ethChart: null,
    ethBar: null,
    ethBarPriceInfo: {},
  }),
  methods: {
    initForm: function() {
      this.id = "";
      this.password = "";
      this.confirm_password = "";
    },
    submitBtn: function() {
      axios
        .post("/api/users/register", {
          id: this.id,
          password: this.password,
        })
        .then((e) => {
          if (e.data.success == true) {
            console.log("회원가입 성공!");
            this.registerDialog = false;
            this.loginSuccess = true;
            this.password = "";
            this.confirm_password = "";
            if (e.data.adminLogin) {
              this.isAdminLogin = true;
            }
            this.$store.dispatch("setLogin", true);
          } else {
            console.log(e);
            console.log(e.data.err || "에러!");
            this.loginSuccess = false;
          }
        });
    },
    modifyAccountBtn: function() {
      axios
        .put("/api/users/update", {
          id: this.id,
          password: this.password,
        })
        .then((e) => {
          if (e.data.success == true) {
            console.log("수정 성공!");
            this.modifyDialog = false;
            this.password = "";
            this.confirm_password = "";
          } else {
            console.log(e.data.err || "에러!");
          }
        });
    },
    loginBtn: function() {
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
            this.password = "";
            this.confirm_password = "";
            this.$store.dispatch("setLogin", true);
            if (e.data.adminLogin) {
              this.isAdminLogin = true;
            }
          } else {
            console.log(e.data.err || "에러!");
            this.loginSuccess = false;
          }
        });
    },
    logoutBtn: function() {
      axios.post("/api/users/logout").then(() => {
        console.log("로그아웃 성공!");
        this.id = "";
        this.password = "";
        this.confirm_password = "";
        this.loginSuccess = false;
        this.isAdminLogin = false;
        this.$store.dispatch("setLogin", false);
      });
    },
  },
  unmounted() {
    console.log("unmounted");
  },
  mounted() {
    console.log("mounted");

    if (this.$store.getters.isLogin) {
      this.loginSuccess = true;
    }

    axios.get("/api/users/session").then((e) => {
      if (e.data.success == true) {
        console.log("세션 유지중");
        this.loginSuccess = true;
        this.id = e.data.user_id;
        this.$store.dispatch("setLogin", true);
        if (e.data.adminLogin) {
          this.isAdminLogin = true;
        }
      } else {
        this.$store.dispatch("setLogin", false);
        this.loginSuccess = false;
      }
    });

    ws.onopen = (e) => {
      console.log("onopen");
      console.log(e);
      var msg = [
        {
          ticket: "TEST",
        },

        {
          type: "ticker",
          codes: ["KRW-BTC", "KRW-DOGE", "KRW-ETH"],
          isOnlyRealtime: true,
        },
      ];
      msg = JSON.stringify(msg);
      ws.send(msg);
    };
    ws.onclose = (e) => {
      console.log("onclose");
      console.log(e);
    };
    ws.onmessage = (e) => {
      var enc = new TextDecoder("utf-8");
      var arr = new Uint8Array(e.data);
      var data = JSON.parse(enc.decode(arr));
      if (this.btcBar && data.code === "KRW-BTC") {
        let curDate = parseInt(data.timestamp / 1000) + 32400;
        let lastDate = this.btcBarInfos[this.btcBarInfos.length - 1].time + 60;

        if (curDate > lastDate) {
          this.btcBarInfos[this.btcBarInfos.length - 1].time = curDate;
          this.btcBarInfos[this.btcBarInfos.length - 1].value =
            data.trade_price;

          this.btcBarPriceInfo.open = data.trade_price;
          this.btcBarPriceInfo.high = data.trade_price;
          this.btcBarPriceInfo.low = data.trade_price;

          this.btcBar.update({
            time: curDate,
            open: data.trade_price,
            high: data.trade_price,
            low: data.trade_price,
            close: data.trade_price,
            value: data.trade_price,
          });
        } else {
          let high = Math.max(this.btcBarPriceInfo.high, data.trade_price),
            low = Math.min(this.btcBarPriceInfo.low, data.trade_price);

          this.btcBarPriceInfo.high = high;
          this.btcBarPriceInfo.low = low;

          this.btcBar.update({
            time: this.btcBarInfos[this.btcBarInfos.length - 1].time,
            open: this.btcBarPriceInfo.open,
            high: this.btcBarPriceInfo.high,
            low: this.btcBarPriceInfo.low,
            close: data.trade_price,
            value: data.trade_price,
          });
        }
      } else if (this.dogeBar && data.code === "KRW-DOGE") {
        let curDate = parseInt(data.timestamp / 1000) + 32400;
        let lastDate =
          this.dogeBarInfos[this.dogeBarInfos.length - 1].time + 60;

        if (curDate > lastDate) {
          this.dogeBarInfos[this.dogeBarInfos.length - 1].time = curDate;
          this.dogeBarInfos[this.dogeBarInfos.length - 1].value =
            data.trade_price;

          this.dogeBarPriceInfo.open = data.trade_price;
          this.dogeBarPriceInfo.high = data.trade_price;
          this.dogeBarPriceInfo.low = data.trade_price;

          this.dogeBar.update({
            time: curDate,
            open: data.trade_price,
            high: data.trade_price,
            low: data.trade_price,
            close: data.trade_price,
            value: data.trade_price,
          });
        } else {
          let high = Math.max(this.dogeBarPriceInfo.high, data.trade_price),
            low = Math.min(this.dogeBarPriceInfo.low, data.trade_price);

          this.dogeBarPriceInfo.high = high;
          this.dogeBarPriceInfo.low = low;

          this.dogeBar.update({
            time: this.dogeBarInfos[this.dogeBarInfos.length - 1].time,
            open: this.dogeBarPriceInfo.open,
            high: this.dogeBarPriceInfo.high,
            low: this.dogeBarPriceInfo.low,
            close: data.trade_price,
            value: data.trade_price,
          });
        }
      } else if (this.ethBar && data.code === "KRW-ETH") {
        let curDate = parseInt(data.timestamp / 1000) + 32400;
        let lastDate = this.ethBarInfos[this.ethBarInfos.length - 1].time + 60;

        if (curDate > lastDate) {
          this.ethBarInfos[this.ethBarInfos.length - 1].time = curDate;
          this.ethBarInfos[this.ethBarInfos.length - 1].value =
            data.trade_price;

          this.ethBarPriceInfo.open = data.trade_price;
          this.ethBarPriceInfo.high = data.trade_price;
          this.ethBarPriceInfo.low = data.trade_price;

          this.ethBar.update({
            time: curDate,
            open: data.trade_price,
            high: data.trade_price,
            low: data.trade_price,
            close: data.trade_price,
            value: data.trade_price,
          });
        } else {
          let high = Math.max(this.ethBarPriceInfo.high, data.trade_price),
            low = Math.min(this.ethBarPriceInfo.low, data.trade_price);

          this.ethBarPriceInfo.high = high;
          this.ethBarPriceInfo.low = low;

          this.ethBar.update({
            time: this.ethBarInfos[this.ethBarInfos.length - 1].time,
            open: this.ethBarPriceInfo.open,
            high: this.ethBarPriceInfo.high,
            low: this.ethBarPriceInfo.low,
            close: data.trade_price,
            value: data.trade_price,
          });
        }
      }
    };
    ws.onerror = (e) => {
      console.log("onerror");
      console.log(e);
    };

    if (ws.readyState == 1) {
      var msg = [
        {
          ticket: "TEST",
        },

        {
          type: "ticker",
          codes: ["KRW-BTC", "KRW-DOGE", "KRW-ETH"],
          isOnlyRealtime: true,
        },
      ];
      msg = JSON.stringify(msg);
      ws.send(msg);
    }

    this.observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target) {
          if (entry.target.id.includes("doge") && this.dogeChart) {
            this.dogeChart.applyOptions({
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            });
          } else if (entry.target.id.includes("btc") && this.btcChart) {
            this.btcChart.applyOptions({
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            });
          } else if (entry.target.id.includes("eth") && this.ethChart) {
            this.ethChart.applyOptions({
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            });
          }
        }
      }
    });
    this.observer.observe(this.$refs.dogeChartDiv);
    this.observer.observe(this.$refs.btcChartDiv);
    this.observer.observe(this.$refs.ethChartDiv);

    var chartConfig = {
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
        secondsVisible: false,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
    };
    axios
      .get(
        "https://api.upbit.com/v1/candles/minutes/1?market=KRW-DOGE&count=200"
      )
      .then((e) => {
        var datas = e.data;
        var arrInfos = [];
        this.dogeChart = createChart(this.$refs.dogeChartDiv, chartConfig);
        this.dogeBar = this.dogeChart.addCandlestickSeries();
        datas.some((item) => {
          let a = new Date(item.candle_date_time_kst);
          a.setHours(a.getHours() + 9);
          arrInfos.push({
            time: parseInt(a.getTime() / 1000),
            open: item.opening_price,
            high: item.high_price,
            low: item.low_price,
            close: item.trade_price,
            value: item.trade_price,
          });
        });
        arrInfos = arrInfos.reverse();
        this.dogeBar.setData(arrInfos);
        this.dogeBarInfos = arrInfos;
        var high = this.dogeBarInfos[this.dogeBarInfos.length - 1].high;
        var low = this.dogeBarInfos[this.dogeBarInfos.length - 1].low;
        var open = this.dogeBarInfos[this.dogeBarInfos.length - 1].open;
        this.dogeBarPriceInfo = {
          high,
          low,
          open,
        };
        axios
          .get(
            "https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=200"
          )
          .then((e) => {
            var datas = e.data;
            var arrInfos = [];
            this.btcChart = createChart(this.$refs.btcChartDiv, chartConfig);
            this.btcBar = this.btcChart.addCandlestickSeries();
            datas.some((item) => {
              let a = new Date(item.candle_date_time_kst);
              a.setHours(a.getHours() + 9);
              arrInfos.push({
                time: parseInt(a.getTime() / 1000),
                open: item.opening_price,
                high: item.high_price,
                low: item.low_price,
                close: item.trade_price,
                value: item.trade_price,
              });
            });
            arrInfos = arrInfos.reverse();
            this.btcBar.setData(arrInfos);
            this.btcBarInfos = arrInfos;
            var high = this.btcBarInfos[this.btcBarInfos.length - 1].high;
            var low = this.btcBarInfos[this.btcBarInfos.length - 1].low;
            var open = this.btcBarInfos[this.btcBarInfos.length - 1].open;
            this.btcBarPriceInfo = {
              high,
              low,
              open,
            };

            axios
              .get(
                "https://api.upbit.com/v1/candles/minutes/1?market=KRW-ETH&count=200"
              )
              .then((e) => {
                var datas = e.data;
                var arrInfos = [];
                this.ethChart = createChart(
                  this.$refs.ethChartDiv,
                  chartConfig
                );
                this.ethBar = this.ethChart.addCandlestickSeries();
                datas.some((item) => {
                  let a = new Date(item.candle_date_time_kst);
                  a.setHours(a.getHours() + 9);
                  arrInfos.push({
                    time: parseInt(a.getTime() / 1000),
                    open: item.opening_price,
                    high: item.high_price,
                    low: item.low_price,
                    close: item.trade_price,
                    value: item.trade_price,
                  });
                });
                arrInfos = arrInfos.reverse();
                this.ethBar.setData(arrInfos);
                this.ethBarInfos = arrInfos;
                var high = this.ethBarInfos[this.ethBarInfos.length - 1].high;
                var low = this.ethBarInfos[this.ethBarInfos.length - 1].low;
                var open = this.ethBarInfos[this.ethBarInfos.length - 1].open;
                this.ethBarPriceInfo = {
                  high,
                  low,
                  open,
                };
              });
          });
      });
  },
};
</script>

<style></style>
