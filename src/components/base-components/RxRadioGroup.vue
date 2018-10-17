<template>
  <el-radio-group ref="el-radio-group" v-model="currentValue" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </el-radio-group>
</template>

<script>
  export default {
    name: 'rx-radio-group',
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