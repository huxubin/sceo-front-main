<template>
  <el-input ref="el-input" v-model="currentValue" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </el-input>
</template>

<script>
  export default {
    name: 'rx-input',
    inheritAttrs: false,
    props: {
      value: [String, Number]
    },
    computed: {
      currentValue: {
        get () {
          return this.value
        },
        set (val) {
        }
      }
    }
  }
</script>

<style scoped>

</style>