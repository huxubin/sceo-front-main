<template>
  <el-autocomplete ref="el-autocomplete" v-model="currentValue" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </el-autocomplete>
</template>

<script>
  export default {
    name: 'rx-autocomplete',
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