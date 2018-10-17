<template>
  <el-checkbox-group ref="el-checkbox-group" v-model="currentValue" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </el-checkbox-group>
</template>

<script>
  export default {
    name: 'rx-checkbox-group',
    inheritAttrs: false,
    props: {
      value: Array
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