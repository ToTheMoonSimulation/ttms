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

      <v-dialog>
        <template v-slot:activator="{ on: loginDialog, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon v-bind="attrs" v-on="{ ...tooltip, ...loginDialog }">
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
                  <v-text-field label="아이디*" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="비밀번호*"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*표시는 반드시 채워야 합니다.</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              취소
            </v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false">
              로그인
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog>
        <template v-slot:activator="{ on: registerDialog, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="{ ...tooltip, ...registerDialog }"
              >
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
                  <v-text-field label="아이디*" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="비밀번호*"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="비밀번호 재입력*"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*표시는 반드시 채워야 합니다.</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              취소
            </v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false">
              회원가입
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
                <v-btn color="primary" x-large @click="$router.push({ name: 'play' })">지금 시작해보세요!</v-btn>
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
  }),
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
  unmounted() {
    console.log("haa");
  },
  methods: {},
};
</script>

<style></style>
