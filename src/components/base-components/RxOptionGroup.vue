<template>
  <el-option-group ref="el-option-group" v-bind="computedElOptions" v-on="computedElListeners">
    <slot></slot>
  </el-option-group>
</template>

<script>
import ElExtendMixins from '@/components/mixins/el-extend-mixin'

export default {
  name: 'rx-option-group',
  mixins: [ElExtendMixins],
  inject: ['RxSelect'],
  props: {
    item: Object
  },
  data () {
    return {
    }
  },
  created () {},
  computed: {
    computedElOptions () {
      let elOptions = {}
      if (this.item) {
        const itemFields = this.RxSelect.computedItemFields
        elOptions = {
          label: this.item[itemFields.labelField],
          disabled: this.item[itemFields.disabledField]
        }
      }
      // 显式赋值的优先级更高
      const explicitOptions = _.pick(this.$attrs, ['label', 'disabled'])
      elOptions = _.merge(elOptions, explicitOptions)
      return elOptions
    }
  }
}
</script>

<style scoped>

</style>