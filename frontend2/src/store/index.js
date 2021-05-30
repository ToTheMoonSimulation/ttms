import { createStore } from 'vuex'

export default createStore({
  state: {
    count:0
  },
  mutations: {
    plusOne(state){
      state.count++;
    }
  },
  actions: {
  },
  getters: {
    getCount(state){
      return state.count;
    }
  },
  modules: {
  }
})
