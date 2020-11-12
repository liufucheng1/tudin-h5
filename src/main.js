import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from './plugins/http';
import NProgress from 'nprogress'
import '../public/css/nprogress.css'//进度条样式
import './plugins/vant';
import '../public/css/globe.css';//公共css样式
import login from './plugins/login'
// 封装的按钮
import TdButton from './components/tdbutton/index.vue';
Vue.component('td-button',TdButton);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

// 登录
login.login();


// 进度条配置
NProgress.configure({
    easing: 'ease',  // 动画方式
    speed: 500,  // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3 // 初始化时的最小百分比
  })
  router.beforeEach((to, from , next) => {
    // 每次切换页面时，调用进度条
    NProgress.start();
    next();
  });
  router.afterEach(() => {
    NProgress.done()
  })
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
