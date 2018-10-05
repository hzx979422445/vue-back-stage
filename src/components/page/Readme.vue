<template>
  <div>
    首页
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    created: function () {
      this.$store.dispatch('reset')
    },
    methods: {}
  }
</script>

<style scoped>

</style>
