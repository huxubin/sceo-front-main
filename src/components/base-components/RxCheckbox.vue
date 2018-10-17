<template>
  <el-checkbox ref="el-checkbox" v-model="currentValue" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </el-checkbox>
</template>

<script>
  export default {
    name: 'rx-checkbox',
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