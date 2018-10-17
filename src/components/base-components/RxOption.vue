<template>
  <el-option ref="el-option" v-bind="computedElOptions" v-on="computedElListeners">
    <slot></slot>
  </el-option>
</template>

<script>
import ElExtendMixins from '@/components/mixins/el-extend-mixin'
export default {
  name: 'rx-option',
  mixins: [ElExtendMixins],
  inject: ['RxSelect'],
  props: {
    item: Object
  },
  data () {
    return {
    }
  },
  created () {
  },
  beforeDestroy () {
    this.RxSelect.optionsMap.delete(this.computedElOptions.value)
  },
  computed: {
    computedElOptions () {
      let elOptions = {}
      if (this.item) {
        const itemFields = this.RxSelect.computedItemFields
        elOptions = {
          value: this.item[itemFields.valueField],
          label: this.item[itemFields.labelField],
          disabled: this.item[itemFields.disabledField]
        }
      }
      // 显式赋值的优先级更高
      const explicitOptions = _.pick(this.$attrs, ['value', 'label', 'disabled'])
      elOptions = _.merge(elOptions, explicitOptions)
      // 把值汇总到RxSelect中
      this.RxSelect.optionsMap.set(elOptions.value, elOptions)
      this.RxSelect.isOptionsInitialized = true
      return elOptions
    }
  }
}
</script>

<style scoped>

</style>