// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(ElementUI);

router.beforeEach((to, from, next)=> {
    if (to.name == 'Login') {
      next();
      return;
    }
    var name = store.state.user.name;
    if (name == '未登录') {
      next({path: '/', query: {redirect: to.path}})
    } else {
      next();
    }
  }
)


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
