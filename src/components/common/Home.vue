<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar :menu="menus" @menuByValue="menuByValue"></v-sidebar>
    <el-tabs type="border-card" closable style="margin-left: 250px;" @tab-remove="removeTab" v-model="activeTab"
             @tab-click="clickTab" v-if='this.tabData.length > 0'>
      <el-tab-pane
        v-for="(item, index) in tabData"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        {{item.content}}
      </el-tab-pane>
    </el-tabs>
    <div class="content">
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  import vHead from './Header.vue';
  import vSidebar from './Menu.vue';

  export default {
    components: {
      vHead, vSidebar
    },
    data() {
      return {
        menus: [],
        activeTab: "",
        tabData: []
      }
    },
    created: function () {
      const self = this;
      self.menus = this.getStorageData("menus");
      this.initMenu(self.menus);
      if (sessionStorage.getItem('tabUrl') != null) {
        this.tabData = JSON.parse(sessionStorage.getItem('tabUrl'));
        this.activeTab = this.$route.path.replace('/', '');
      }
    },
    methods: {
      removeTab(targetName) {
        let tabs = this.tabData;
        if (this.tabData.length > 1) {
          let activeName = this.activeTab;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          this.activeTab = activeName;
          this.tabData = tabs.filter(tab => tab.name !== targetName);
          this.$router.push(this.activeTab);
          let tabStr = JSON.stringify(this.tabData);
          sessionStorage.setItem('tabUrl', tabStr);
        }
      },
      clickTab(target){
        this.$router.push(target.name);
      },
      menuByValue: function (menuUrl) {
        let addUrlFlag = true;
        if (this.tabData.length > 0) {
          this.tabData.forEach(function (currentValue, index) {
            if (currentValue.name == menuUrl.url) {
              addUrlFlag = false;
            }
          })
        }
        if (addUrlFlag) {
          let obj = {
            title: menuUrl.name,
            name: menuUrl.url,
            content: menuUrl.name
          }
          this.tabData.push(obj);
        }
        this.activeTab = menuUrl.url;
        let tabStr = JSON.stringify(this.tabData);
        sessionStorage.setItem('tabUrl', tabStr);
      }
    }

  }
</script>
