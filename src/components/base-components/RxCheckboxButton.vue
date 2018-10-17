<template>
  <el-checkbox-button ref="el-checkbox-button" v-model="currentValue" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </el-checkbox-button>
</template>

<script>
  export default {
    name: 'rx-checkbox-button',
    inheritAttrs: false,
    props: {
      value: Boolean
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