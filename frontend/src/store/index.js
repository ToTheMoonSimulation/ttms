import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin:false
  },
  getters:{
    isLogin:state=>{
      return state.isLogin;
    }
  },
  mutations: {
    setLogin(state, isLogin) {
      state.isLogin = isLogin;
    },
  },
  actions: {
    setLogin: ({ commit }, isLogin) => {
      commit("setLogin", isLogin);
    },
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
