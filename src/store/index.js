import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data:  window.localStorage.getItem('data'),
    routes: []
  },
  mutations: {
    initMenu(state, menus){
      state.routes = menus;
    },
    login(state, data){
      state.data = data;
      window.localStorage.setItem('data', JSON.stringify(data));
    },
    logout(state){
      window.localStorage.removeItem('data');
      state.routes = [];
    }
  },
  actions: {
  }
});
