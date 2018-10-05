import Vue from 'vue';
import App from './App';           //主入口
import router from './router';    //路由配置文件
import axios from './util/http'; //axios请求再封装文件
import util from './util/util'; //定义全局方法的文件
import  store from  './store'
import vaildate from './util/validate'; //定义全局输入框验证方法的文件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
Vue.use(ElementUI);
Vue.use(util);
Vue.use(vaildate);
new Vue({
  router,
  axios,
  store,
  render: h => h(App)
}).$mount('#app');
/*
     公用全局数据(sessionStorage)
          menus:菜单模块
          ms_user:用户信息
          tabUrl:tab路由切换
          listElment:按钮
 */
