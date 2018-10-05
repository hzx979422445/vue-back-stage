import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/homePage',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [
        {
          path: '/',
          component: resolve => require(['../components/page/Readme.vue'], resolve)
        },
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
  ]
})
router.beforeEach((to, from, next) => {
  if (window.sessionStorage.getItem("ms_user") != null) {
    if (to.path === '/login') {
      window.sessionStorage.removeItem('ms_user');
      window.sessionStorage.removeItem('menus');
      window.sessionStorage.removeItem('tabUrl');
      window.sessionStorage.removeItem('listElment');
      next();
    } else {
      if (router.options.routes[1].children.length == 1) {
        const menus = JSON.parse(window.sessionStorage.getItem('menus'));
        router.options.routes[1].children.splice(1);
        getMenusRoutes(menus);
        next({...to, replace: true});
      } else {
        next();
      }
    }
  } else {
    if (to.path === '/login') {
      window.sessionStorage.removeItem('ms_user');
      window.sessionStorage.removeItem('menus');
      window.sessionStorage.removeItem('tabUrl');
      window.sessionStorage.removeItem('listElment');
      next();
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
})

function getMenusRoutes(arr) {//路由菜单
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].listchild.length > 0) {
      let menusTwo = arr[i].listchild;
      if (menusTwo.length > 0) {
        getMenusRoutes(menusTwo);
      }
    } else {
      const urlTwo = arr[i].url;
      let menusRoutesObj = {
        path: `/${urlTwo}`,
        component: resolve => require([`../components/page/${urlTwo}.vue`], resolve),
      };
      router.options.routes[1].children.push(menusRoutesObj);
    }
  }
  router.addRoutes(router.options.routes);
}
export default router
