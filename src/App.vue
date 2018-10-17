<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      bodyEle: document.getElementsByTagName('body')[0]
    }
  },
  created () {
    this.bodyEle.className = this.themeName
  },
  computed: {
    themeName () {
      return this.$store.state.themeStore.themeName
    }
  },
  watch: {
    themeName () {
      this.bodyEle.className = this.themeName
    }
  }
}
</script>

<style>
  html {
    height: 100%;
    margin: 0;
  }
  body {
    color: #495164;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,"\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
    font-size: 14px;
    overflow: hidden;
    height: 100%;
    margin: 0;
  }
  #app {
    height: 100%;
    overflow: auto;
  }
</style>
