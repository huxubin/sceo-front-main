<template>
  <el-radio ref="el-radio" v-model="currentValue" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </el-radio>
</template>

<script>
  export default {
    name: 'rx-radio',
    inheritAttrs: false,
    props: {
      value: [String, Number, Boolean]
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