import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:  window.localStorage.getItem('token'),
    routes: []
  },
  mutations: {
    initMenu(state, menus){
      state.routes = menus;
    },
    login(state, token){
      state.token = token;
      window.localStorage.setItem('token', JSON.stringify(token));
    },
    logout(state){
      window.localStorage.removeItem('token');
      state.routes = [];
    }
  },
  actions: {
  }
});
