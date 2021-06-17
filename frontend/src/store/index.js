import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin:false,
    // krwMarketCodes:null
  },
  getters:{
    isLogin:state=>{
      return state.isLogin;
    },
    // krwMarketCodes:state=>{
    //   return state.krwMarketCodes;
    // }
  },
  mutations: {
    setLogin(state, isLogin) {
      state.isLogin = isLogin;
    },
    // setKrwMarketCodes(state, krwMarketCodes) {
    //   state.krwMarketCodes = krwMarketCodes;
    // },
  },
  actions: {
    setLogin: ({ commit }, isLogin) => {
      commit("setLogin", isLogin);
    },
    // setKrwMarketCodes: ({ commit }, krwMarketCodes) => {
    //   commit("setKrwMarketCodes", krwMarketCodes);
    // },
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
