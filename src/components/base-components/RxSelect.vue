<template>
  <div class="rx-component-wrapper">
    <el-select
        v-loading="computedIsLoading"
        :disabled="computedDisabled"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.4)"
        ref="el-select"
        v-model="currentValue"
        v-bind="computedElOptions"
        v-on="computedElListeners">
      <slot>
        <rx-option v-for="item in options" :key="item.value" :item="item"></rx-option>
      </slot>
    </el-select>
  </div>
</template>

<script>
import ElExtendMixins from '@/components/mixins/el-extend-mixin'
import RxOption from '@/components/base-components/RxOption'

export default {
  name: 'rx-select',
  mixins: [ElExtendMixins],
  components: {
    RxOption
  },
  provide () {
    return {
      RxSelect: this
    }
  },
  props: {
    value: [String, Array, Number],
    options: [Array],
    itemFields: Object // 定义option中绑定的字段
  },
  data () {
    const multiple = this.$attrs.multiple || false
    return {
      isOptionsInitialized: false,
      cacheValue: this.value,
      currentValue: multiple ? [] : '',
      optionsMap: new Map()
    }
  },
  created () {
  },
  mounted () {
  }, // end of mounted
  methods: {
    setCurrentValue (value) {
      console.log('setCurrentValue', value, this.isOptionsInitialized, this.optionsMap.size)
      // 如果赋值操作在选择项之前, 先把值缓存起来, 等复制之后再进行操作
      this.cacheValue = value
      if (!this.isOptionsInitialized) {
        return
      }
      const multiple = this.computedElOptions.multiple || false
      if (multiple) { // 处理多选
        if (Array.isArray(value) && value.length > 0) {
          let validValues = []
          value.forEach((cur) => {
            if (this.hasOption(cur)) {
              validValues.push(cur)
            }
          })
          if (_.difference(this.currentValue, validValues).length === 0) return
          this.currentValue = validValues
          this.$emit('input', this.currentValue)
        }
      } else { // 处理单选
        if (this.hasOption(value)) {
          if (this.currentValue === value) return
          this.currentValue = value
          this.$emit('input', this.currentValue)
        }
      }
    },
    hasOption (value) {
      return value && this.optionsMap.has(value)
    }
  }, // end of methods
  computed: {
    computedElOptions () {
      let elOptions = _.cloneDeep(this.$attrs)
      elOptions.multiple = elOptions.multiple || false
      if (!elOptions.multiple) {
        if (elOptions.clearable !== false) elOptions.clearable = true
      }
      return elOptions
    },
    computedDisabled () {
      if (this.disabled === true) return true
      if (this.computedIsLoading === true) return true
      return false
    },
    computedIsLoading () {
      if (this.isLoading === true) return true
      if (this.isOptionsInitialized === false) return true
      return false
    },
    computedItemFields () {
      return {
        valueField: (this.itemFields && this.itemFields.valueField) || 'value',
        labelField: (this.itemFields && this.itemFields.labelField) || 'label',
        disabledField: (this.itemFields && this.itemFields.disabledField) || 'disabled'
      }
    }
  }, // end of computed
  watch: {
    options: function (newVal) {
      if (newVal && newVal.length > 0) {
        // 此处给optionsMap中赋值, 和在RxOption中给optionsMap复制可能会有重复, 但是后续用到了此值.
        this.options.forEach((cur) => [
          this.optionsMap.set(cur[this.computedItemFields.valueField], cur)
        ])
        this.isOptionsInitialized = true
      }
    },
    isOptionsInitialized: function () {
      this.setCurrentValue(this.cacheValue)
    },
    value: function (val) {
      this.setCurrentValue(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.rx-component-wrapper /deep/ {
  .el-loading-spinner {
    margin-top: -8px;
  }
}
</style>
