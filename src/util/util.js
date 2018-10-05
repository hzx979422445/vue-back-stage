/**
 * 全局公共方法&指令操作类
 *
 * @param Vue
 * @param options
 */
exports.install = function (Vue, options) {
  /////////////////////////////////////////////////////////////////////////////////////第一部分-实例方法////////////////////////////////////////////////////////////////////////////////
  /**
   * 为列表页的表格提供最小高度
   * @returns {number}
   */
  Vue.prototype.listTableMinHeight = function () {
    let fullHeight = document.documentElement.clientHeight - 350;
    if (fullHeight < 500) {
      fullHeight = 500;
    }
    return fullHeight;
  };
  /**
   * 方法作用:获取菜单对应的列表url路径
   * @param key 需要获取数组对象某个值所需要的键(例:"userlist")
   * @param arr 需要获取的数组对象(非必填)
   * @returns {String}
   */
  Vue.prototype.getMenuUrl = function (key, arr) {
    let requestUrlArr;
    if (arr) {
      requestUrlArr = arr;
    } else {
      requestUrlArr = this.getStorageData(this.$route.path + "l");
    }
    let requestUrl;
    requestUrlArr.forEach(function (currentValue, index) {
      if (currentValue.rel == key) {
        requestUrl = currentValue.href;
      }
    })
    return requestUrl;
  };
  /**
   *获取菜单内部按钮权限-关联到菜单
   * @returns {*}
   */
/*  Vue.prototype.getMenuButton = function () {
    return this.getStorageData(this.$route.path + "b");
  };*/
  /**
   *获取菜单内部按钮权限-关联到角色
   * @returns {*}
   */
    Vue.prototype.getMenuButton = function () {
       return this.getStorageData("listElment");
   };
  /**
   * 写入缓存
   * @param key
   * @param data
   */
  Vue.prototype.setStorageData = function (key, data) {
    let datas = JSON.stringify(data);
    window.sessionStorage.setItem(key, datas);
  };

  /**
   * 获取缓存
   * @param key
   * @returns {any}
   */
  Vue.prototype.getStorageData = function (key) {
    let data = window.sessionStorage.getItem(key);
    if(data != "undefined"){
      return JSON.parse(data);
    }
  };

  /**
   * 初始化Menus
   * @param menus
   * @param l  取菜单link的特殊标识
   * @param b  取菜单button的特殊标识
   */
  Vue.prototype.initMenu = function (menus) {
    if (menus != undefined) {
      for (var i = 0; i < menus.length; i++) {
        if (menus[i].listchild.length > 0) {
          let menusTwo = menus[i].listchild;
          if (menusTwo.length > 0) {
            this.initMenu(menusTwo);
          }
        } else {
          let route = menus[i].url.toString();
          this.setStorageData("/" + route + "l", menus[i].listMenuLink);
          this.setStorageData("/" + route + "b", menus[i].listElment);
        }
      }
    }
  }


/////////////////////////////////////////////////////////////////////////////////////第二部分-指令////////////////////////////////////////////////////////////////////////////////

  /**自定义指令
   bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
   inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
   update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
   componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
   unbind：只调用一次，指令与元素解绑时调用。
   */

  /**
   * 根据权限按钮的id判断是否有该按钮权限
   */
  Vue.directive('isExistButton', {
    bind(el, binding, vnode, oldVnode) {
      let buttonFlag = true;
      let button;
      if(el.attributes.buttons != undefined){
        button = JSON.parse(el.attributes.buttons.value);
      }
      if (button != undefined) {
        button.forEach(function (currentValue, index) {
          if (currentValue.id == binding.expression) {
            buttonFlag = false;
          }
        })
      }
      if (buttonFlag) {
        el.parentNode.removeChild(el);
      }
    }
  })
};
