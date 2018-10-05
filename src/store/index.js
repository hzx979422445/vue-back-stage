import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);
export default new vuex.Store({
  state: {
    fullHeight: 0,//表格最小高度
    pageCount: 0,//分页总数
    pageNo: 1,//分页初始页
    listUrl: "",//列表的url
    addUrl: "",//新增的url
    editUrl: "",//修改的url
  },
  mutations: {
    resetBaseData(state) {//重置初始状态
      state.fullHeight = 0;
      state.pageCount = 0;
      state.pageNo = 1;
      state.listUrl = "";
      state.addUrl = "";
      state.editUrl = "";
    }
  },
  actions: {
    reset(context) {
      context.commit('resetBaseData');
    },
  }
  /*
    使用说明:
    $store.commit('resetBaseData') 来触发 mutations 中的 resetBaseData 方法

   使用 $store.dispatch('reset') 来触发 action 中的 reset 方法。
  */
})
