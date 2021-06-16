<template>
  <v-app>
    <h1>hello play</h1>
  </v-app>
</template>

<script>
import ws from "@/libraries/ws";
export default {
  data: () => {
    return {};
  },
  mounted() {
    console.log("mounted");

    ws.onopen = (e) => {
      console.log("onopen");
      console.log(e);
    };
    ws.onclose = (e) => {
      console.log("onclose");
      console.log(e);
    };
    ws.onmessage = (e) => {
      console.log("onmessage");
      console.log(e);
    };
    ws.onerror = (e) => {
      console.log("onerror");
      console.log(e);
    };
  },
  unmounted() {},
  methods: {},
};

// axios
//   .get("https://api.upbit.com/v1/market/all?isDetails=false")
//   .then((e) => {
//     var allMarkets = e.data;
//     var krwMarkets = [];
//     allMarkets.some((item) => {
//       if (item.market.startsWith("KRW")) {
//         krwMarkets.push(item);
//       }
//     });
</script>

<style></style>
