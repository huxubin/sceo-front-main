<template>
  <el-radio-button ref="el-radio-button" v-model="currentValue" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </el-radio-button>
</template>

<script>
  export default {
    name: 'rx-radio-button',
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