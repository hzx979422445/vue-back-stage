<template>
  <div class="sidebar">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
      <template v-for="item in menu">
        <template v-if="item.listchild.length > 0">
          <el-submenu :index="item.url">
            <template slot="title"><i :class="item.icon"></i>{{ item.name }}</template>
            <el-menu-item v-for="(subItem,i) in item.listchild" :key="i" :index="subItem.url" @click="addTab(subItem)">{{
              subItem.name }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.url" @click="addTab(item)">
            <i :class="item.icon"></i>{{ item.name }}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  export default {
    props: {
      menu: {
        type: Array,
        default: []
      },
    },
    computed: {
      onRoutes() {
        return this.$route.path.replace('/', '');
      }
    },
    methods: {
      addTab: function (ele) {
        this.$emit('menuByValue',ele);
      }
    }
  }
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    width: 250px;
    left: 0;
    top: 70px;
    bottom: 0;
    background: #2E363F;
  }

  .sidebar > ul {
    height: 100%;
  }
</style>
