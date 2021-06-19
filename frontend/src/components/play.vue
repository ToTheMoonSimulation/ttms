<template>
  <v-container style="height:100%; overflow:hidden;">
    <v-row class="grey" style="height:60%;" no-gutters>
      <v-col style="height:100%;">
        <v-card class="pa-2" outlined tile style="height:100%;">
          <p
            ref="chartTitle"
            style="position:absolute; top:20px;top:20px; z-index:100;"
          >
            {{ this.selectedCoinCode }}
          </p>
          <div ref="chartDiv" style="height:100%;"></div>
        </v-card>
      </v-col>
    </v-row>

    <v-row style="height:40%; overflow:hidden;" no-gutters>
      <v-col style="padding:8px; height:100%;">
        <v-data-table
          :headers="scenariosHeaders"
          :items="scenarios"
          sort-by="currentBalance"
          class="elevation-1"
          ref="dataTableScenarios"
          :loading="isLoadingScenarios"
          loading-text="Loading... Please wait"
          style="height:345px; overflow-y:auto;"
          hide-default-footer
          disable-pagination
          @click:row="onClickScenarioList"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>계좌 리스트</v-toolbar-title>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-col>

      <v-col style="padding:8px;height:100%;">
        <v-card style="height:100%;">
          <v-tabs
            v-model="tab"
            background-color="deep-purple accent-4"
            centered
            dark
            icons-and-text
          >
            <v-tabs-slider></v-tabs-slider>

            <v-tab href="#tab-1">
              Trade
              <v-icon>mdi-cash-multiple</v-icon>
            </v-tab>

            <v-tab href="#tab-2">
              History
              <v-icon>mdi-history</v-icon>
            </v-tab>

            <v-tab href="#tab-3">
              My Coins
              <v-icon>mdi-bag-personal</v-icon>
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item value="tab-1">
              <v-card flat style="text-align:center">
                <v-row v-if="this.selectedScenario">
                  <v-col>
                    <p>계좌명 : {{ this.selectedScenario.name }}</p>
                    <p>
                      현재 금액 : {{ this.selectedScenario.currentBalance }}
                    </p>
                  </v-col>
                </v-row>

                <v-row v-if="this.selectedScenario">
                  <v-col>
                    <v-slider
                      v-model="slider"
                      class="align-center"
                      :max="this.selectedScenario.currentBalance"
                      :min="1"
                      hide-details
                      color="green"
                    >
                      <template v-slot:append>
                        <v-text-field
                          v-model="slider"
                          class="mt-0 pt-0"
                          hide-details
                          single-line
                          type="number"
                          style="width: 100px"
                        ></v-text-field>
                      </template>
                    </v-slider>
                  </v-col>
                </v-row>
                <v-row v-if="this.currentHoldings">
                  <v-col>
                    <v-slider
                      v-model="currentHoldingsSlider"
                      class="align-center"
                      :max="100"
                      :min="1"
                      color="red"
                      hide-details
                    >
                      <template v-slot:append>
                        <v-text-field
                          v-model="currentHoldingsSlider"
                          class="mt-0 pt-0"
                          hide-details
                          single-line
                          type="number"
                          style="width: 100px"
                        ></v-text-field>
                      </template>
                    </v-slider>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col
                    ><v-btn color="green" style="width:80%" @click="onClickBuy"
                      >BUY</v-btn
                    ></v-col
                  >
                  <v-col
                    ><v-btn color="red" style="width:80%" @click="onClickSell"
                      >SELL</v-btn
                    ></v-col
                  >
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item value="tab-2">
              <v-card flat>
                <v-data-table
                  :headers="historyHeader"
                  :items="history"
                  sort-by="tradeDate"
                  :sort-desc="true"
                  class="elevation-1"
                  ref="dataTableHistory"
                  :loading="isLoadingScenarios"
                  loading-text="Loading... Please wait"
                  style="height:240px; overflow-y:auto;"
                  hide-default-footer
                  disable-pagination
                >
                </v-data-table>
              </v-card>
            </v-tab-item>
            <v-tab-item value="tab-3">
              <v-card flat>
                <v-data-table
                  :headers="myCoinsHeader"
                  :items="myCoins"
                  sort-by="quantity"
                  :sort-desc="true"
                  class="elevation-1"
                  :loading="isLoadingScenarios"
                  loading-text="Loading... Please wait"
                  style="height:240px; overflow-y:auto;"
                  hide-default-footer
                  disable-pagination
                >
                </v-data-table>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>

      <v-col style="padding:8px;height:100%;">
        <v-data-table
          :headers="marketsHeaders"
          :items="markets"
          sort-by="currentPrice"
          :sort-desc="true"
          class="elevation-1"
          ref="dataTableMarkets"
          :loading="isLoadingMarkets"
          loading-text="Loading... Please wait"
          style="height:345px; overflow-y:auto;"
          hide-default-footer
          disable-pagination
          @click:row="onClickMarketList"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>마켓 리스트</v-toolbar-title>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { createChart, CrosshairMode } from "lightweight-charts";
import ws from "@/libraries/ws";

export default {
  data: () => {
    return {
      tab: null,
      text: "Lorem",
      defaultCoinCode: "KRW-BTC",
      chart: null,
      bar: null,
      selectedCoinCode: "KRW-BTC",
      selectedCoinRowIdx: null,
      barInfos: [],
      barPriceInfo: {},
      selectedScenario: null,
      scenarios: [],
      scenariosHeaders: [
        {
          text: "계좌 이름",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "현재 금액", value: "currentBalance" },
        { text: "수익률", value: "benefitRatio" },
      ],
      historyHeader: [
        {
          text: "코인명",
          align: "start",
          sortable: false,
          value: "coinCode",
        },
        { text: "가격", value: "price" },
        { text: "수량", value: "quantity" },
        { text: "매수/매도", value: "tradeType" },
      ],
      history: [],
      isLoadingScenarios: false,
      markets: [],
      marketsHeaders: [
        {
          text: "코인명",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "현재 가격", value: "currentPrice" },
        { text: "전일 대비", value: "changeRatio" },
      ],
      isLoadingMarkets: false,
      krwMarkets: [],
      tempMarkets: [],
      slider: null,
      currentHoldings: null,
      currentHoldingsSlider: null,
      myCoinsHeader: [
        {
          text: "코인명",
          align: "start",
          sortable: false,
          value: "coinCode",
        },
        { text: "평균단가", value: "priceAvg" },
        { text: "수량", value: "quantity" },
      ],
      myCoins: [],
    };
  },
  mounted() {
    /*
      [코드 순서]
      1. 계좌 가져오기
      2. 웹소켓 연결 수립
      3. KRW 마켓 실시간 정보 가져오기 & 테이블 채우기
      4. 기본으로 선택된 코인 정보 가져오기 & 차트 그리기
    */
    //1. 계좌 가져오기
    this.isLoadingScenarios = true;
    this.isLoadingMarkets = true;
    axios.get("/api/dashboard").then((e) => {
      if (e.data.success) {
        e.data.docs[0].scenarios.some((item) => {
          this.scenarios.push({
            name: item.scenarioName,
            initBalance: item.initBalance,
            currentBalance: item.currentBalance,
            benefitRatio: item.benefitRatio,
            tradeHistory: item.tradeHistory,
            coinHoldings: item.coinHoldings,
          });
        });
        this.selectedScenario = this.scenarios[0];
        this.selectedScenario.coinHoldings.some((coin) => {
          if (coin.coinCode == this.selectedCoinCode) {
            this.currentHoldings = coin;
            this.currentHoldingsSlider = 1;
            return true;
          }
        });
        this.myCoins = this.selectedScenario.coinHoldings;
        this.history = this.selectedScenario.tradeHistory;
      }

      this.isLoadingScenarios = false;
    });

    //2. 웹소켓 연결 수립
    ws.onopen = () => {
      var msg = [
        {
          ticket: "TEST",
        },

        {
          type: "ticker",
          codes: [this.defaultCoinCode],
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
      try {
        var enc = new TextDecoder("utf-8");
        var arr = new Uint8Array(e.data);
        var data = JSON.parse(enc.decode(arr));

        //마켓 리스트 초기화.
        if (data.stream_type == "SNAPSHOT") {
          this.krwMarkets.some((item) => {
            if (item.market == data.code) {
              this.tempMarkets.push({
                name: item.korean_name,
                code: data.code,
                currentPrice: data.trade_price,
                changeRatio: Math.round(data.signed_change_rate * 10000) / 100,
              });
            }
          });
          if (this.tempMarkets.length == this.krwMarkets.length) {
            console.log("done");
            this.markets = this.tempMarkets;
            this.isLoadingMarkets = false;
          }
          return;
        }
        //현재 선택한 코인의 차트 그리기
        else if (this.bar && this.selectedCoinCode == data.code) {
          let curDate = parseInt(data.timestamp / 1000) + 32400;
          let lastDate = this.barInfos[this.barInfos.length - 1].time + 60;

          if (curDate > lastDate) {
            this.barInfos[this.barInfos.length - 1].time = curDate;
            this.barInfos[this.barInfos.length - 1].value = data.trade_price;

            this.barPriceInfo.open = data.trade_price;
            this.barPriceInfo.high = data.trade_price;
            this.barPriceInfo.low = data.trade_price;

            this.bar.update({
              time: curDate,
              open: data.trade_price,
              high: data.trade_price,
              low: data.trade_price,
              close: data.trade_price,
              value: data.trade_price,
            });
          } else {
            let high = Math.max(this.barPriceInfo.high, data.trade_price),
              low = Math.min(this.barPriceInfo.low, data.trade_price);

            this.barPriceInfo.high = high;
            this.barPriceInfo.low = low;

            this.bar.update({
              time: this.barInfos[this.barInfos.length - 1].time,
              open: this.barPriceInfo.open,
              high: this.barPriceInfo.high,
              low: this.barPriceInfo.low,
              close: data.trade_price,
              value: data.trade_price,
            });
          }
        }
        //매번 마켓 리스트 업데이트
        this.markets.some((item) => {
          if (item.code == data.code) {
            item.currentPrice = data.trade_price;
            item.changeRatio =
              Math.round(data.signed_change_rate * 10000) / 100;
            return true;
          }
        });
      } catch (e) {
        console.log(e);
      }
    };
    ws.onerror = (e) => {
      console.log("onerror");
      console.log(e);
    };

    this.observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target && this.chart) {
          this.chart.applyOptions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });
    this.observer.observe(this.$refs.chartDiv);

    // 3. KRW 마켓 실시간 정보 가져오기 & 테이블 채우기 <<= localstorage로 저장하는건 위험할듯.
    //  업비트 사이트에 상장폐지되는 코인들이 생기면 리스트를 갱신해줘야함.
    //  리스트 갱신전까지 오래된 정보가지고 정보 요청하면 귀찮은 에러처리에 성능 감소가 있을지도. 일단 주석처리하고 매번 갱신하는 걸로.
    // if (!this.$store.getters.krwMarketCodes) {

    axios
      .get("https://api.upbit.com/v1/market/all?isDetails=false")
      .then((e) => {
        var allMarkets = e.data;
        var requsets = [];
        allMarkets.some((item) => {
          if (item.market.startsWith("KRW")) {
            this.krwMarkets.push({
              market: item.market,
              korean_name: item.korean_name,
            });
            requsets.push(item.market);
          }
        });

        if (ws.readyState == 1) {
          var msg = [
            {
              ticket: "TEST",
            },

            {
              type: "ticker",
              codes: requsets,
            },
          ];
          msg = JSON.stringify(msg);
          ws.send(msg);
        }
      });
    // }

    // 4. 기본으로 선택된 코인 정보 가져오기 & 차트 그리기
    var chartConfig = {
      width: this.$refs.chartDiv.width,
      height: this.$refs.chartDiv.height,
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
        "https://api.upbit.com/v1/candles/minutes/1?market=" +
          this.defaultCoinCode +
          "&count=200"
      )
      .then((e) => {
        var datas = e.data;
        var arrInfos = [];
        this.chart = createChart(this.$refs.chartDiv, chartConfig);
        this.bar = this.chart.addCandlestickSeries();
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
        this.bar.setData(arrInfos);
        this.barInfos = arrInfos;
        var high = this.barInfos[this.barInfos.length - 1].high;
        var low = this.barInfos[this.barInfos.length - 1].low;
        var open = this.barInfos[this.barInfos.length - 1].open;
        this.barPriceInfo = {
          high,
          low,
          open,
        };
      });
  },
  unmounted() {},
  methods: {
    onClickBuy() {
      var currentPrice = 0;

      this.markets.some((item) => {
        if (item.code == this.selectedCoinCode) {
          currentPrice = item.currentPrice;
          return true;
        }
      });
      axios
        .post("/api/play/buy", {
          name: this.selectedScenario.name,
          quantity: this.slider / currentPrice,
          code: this.selectedCoinCode,
          currentPrice: currentPrice,
          krw: this.slider,
          tradeType: "buy",
        })
        .then((res) => {
          if (res.data.success) {
            this.isLoadingScenarios = true;
            axios.get("/api/dashboard").then((e) => {
              if (e.data.success) {
                this.scenarios = [];
                e.data.docs[0].scenarios.some((item) => {
                  this.scenarios.push({
                    name: item.scenarioName,
                    initBalance: item.initBalance,
                    currentBalance: item.currentBalance,
                    benefitRatio: item.benefitRatio,
                    tradeHistory: item.tradeHistory,
                    coinHoldings: item.coinHoldings,
                  });
                });
                this.scenarios.some((item) => {
                  if (item.name == this.selectedScenario.name) {
                    this.myCoins = item.coinHoldings;
                    this.selectedScenario = item;
                    this.currentHoldings = null;
                    this.currentHoldingsSlider = 1;
                    item.coinHoldings.some((coin) => {
                      if (coin.coinCode == this.selectedCoinCode) {
                        this.currentHoldings = coin;
                        return true;
                      }
                    });
                  }
                });
              }
              this.history = this.selectedScenario.tradeHistory;
              this.isLoadingScenarios = false;
            });
          }
        });
    },
    onClickSell() {
      var currentPrice = 0;

      this.markets.some((item) => {
        if (item.code == this.selectedCoinCode) {
          currentPrice = item.currentPrice;
          return true;
        }
      });
      axios
        .post("/api/play/sell", {
          name: this.selectedScenario.name,
          percent: this.currentHoldingsSlider,
          code: this.selectedCoinCode,
          currentPrice: currentPrice,
          tradeType: "sell",
        })
        .then((res) => {
          if (res.data.success) {
            this.isLoadingScenarios = true;
            axios.get("/api/dashboard").then((e) => {
              if (e.data.success) {
                this.scenarios = [];
                e.data.docs[0].scenarios.some((item) => {
                  this.scenarios.push({
                    name: item.scenarioName,
                    initBalance: item.initBalance,
                    currentBalance: item.currentBalance,
                    benefitRatio: item.benefitRatio,
                    tradeHistory: item.tradeHistory,
                    coinHoldings: item.coinHoldings,
                  });
                });
                this.scenarios.some((item) => {
                  if (item.name == this.selectedScenario.name) {
                    this.myCoins = item.coinHoldings;
                    this.selectedScenario = item;
                    this.currentHoldings = null;
                    this.currentHoldingsSlider = 1;
                    item.coinHoldings.some((coin) => {
                      if (coin.coinCode == this.selectedCoinCode) {
                        this.currentHoldings = coin;
                        return true;
                      }
                    });
                  }
                });
              }
              this.history = this.selectedScenario.tradeHistory;
              this.isLoadingScenarios = false;
            });
          }
        });
    },
    onClickScenarioList(row) {
      this.selectedScenario = Object.assign({}, row);
      this.scenarios.some((item) => {
        if (item.name == this.selectedScenario.name) {
          this.history = item.tradeHistory;
          this.currentHoldings = null;
          this.currentHoldingsSlider = 1;
          item.coinHoldings.some((coin) => {
            if (coin.coinCode == this.selectedCoinCode) {
              this.currentHoldings = coin;
              return true;
            }
          });
          this.myCoins = item.coinHoldings;
          return true;
        }
      });
    },
    onClickMarketList(row) {
      if (this.selectedCoinCode == row.code) return;

      var selectedCode = row.code;
      this.scenarios.some((item) => {
        if (item.name == this.selectedScenario.name) {
          this.history = item.tradeHistory;
          this.currentHoldings = null;
          this.currentHoldingsSlider = 1;
          item.coinHoldings.some((coin) => {
            if (coin.coinCode == selectedCode) {
              this.currentHoldings = coin;
              return true;
            }
          });
          return true;
        }
      });
      axios
        .get(
          "https://api.upbit.com/v1/candles/minutes/1?market=" +
            row.code +
            "&count=200"
        )
        .then((e) => {
          var datas = e.data;
          var arrInfos = [];
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
          this.bar.setData(arrInfos);
          this.barInfos = arrInfos;
          var high = this.barInfos[this.barInfos.length - 1].high;
          var low = this.barInfos[this.barInfos.length - 1].low;
          var open = this.barInfos[this.barInfos.length - 1].open;
          this.barPriceInfo = {
            high,
            low,
            open,
          };
          this.selectedCoinCode = selectedCode;
        });
    },
  },
};
</script>

<style scoped></style>
