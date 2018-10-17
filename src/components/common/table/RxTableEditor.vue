<template>
  <div>
    <el-collapse-transition>
      <div class="error-message" v-if="validateState === 'error'">{{errorMessage}}</div>
    </el-collapse-transition>
    <div v-html="label" v-on="onProps" v-if="label" :style="labelStyle"></div>
    <div :style="inputStyle" v-if="inputStyle.width !== '0%'">
      <el-input class="edit-input"
        v-if="type === 'input'"
        v-model="currentValue"
        v-bind="bindPorps"
        v-on="onProps"
        @blur="changeValue"
        @focus="resetValidateState"
        ref="input"></el-input>
      <el-select class="edit-input"
        v-if="type === 'select'"
        v-model="currentValue"
        v-bind="bindPorps"
        v-on="onProps"
        @change="changeValue"
        @visible-change="selectVisibleChange"
        ref="input">
        <el-option v-for="item in selectOptions" :key="item.value" :value="item.value" :label="item.label" :disabled="item.disabled"></el-option>
      </el-select>
      <div v-if="type === 'button'">
        <el-button v-for="(item, index) in buttons" :key="index" :icon="item.icon"
         type="text" @click="item.handle(row, node)"  :disabled="item.disabled && typeof item.disabled === 'function' ? item.disabled(row) : !!item.disabled"
         v-if="item.visible ? item.visible(row) : true">
          {{item.name && typeof item.name === 'function'? item.name(row) : item.name}}
        </el-button>
      </div>
      <el-date-picker class="edit-input form-date"
        v-if="type === 'date'"
        v-model="currentValue"
        clearable
        v-bind="bindPorps"
        v-on="onProps"
        ref="input"
        @change="changeValue">
      </el-date-picker>
      <el-checkbox
        v-if="type === 'checkbox'"
        v-model="currentValue"
        v-bind="bindPorps"
        v-on="onProps"
        @change="changeValue">
      </el-checkbox>
      <el-switch
        v-if="type === 'switch'"
        v-model="currentValue"
        v-bind="bindPorps"
        v-on="onProps"
        @change="changeValue">
      </el-switch>
      <dept-selector class="edit-input"
        v-if="type === 'dept'"
        v-model="currentValue"
        v-bind="bindPorps"
        v-on="onProps"
        ref="input"
        @change="changeValue">
      </dept-selector>
      <staff-selector class="edit-input"
        v-if="type === 'staff'"
        v-model="currentValue"
        v-bind="bindPorps"
        v-on="onProps"
        ref="input"
        @change="changeValue">
      </staff-selector>
      <post-selector class="edit-input"
        v-if="type === 'post'"
        v-model="currentValue"
        v-bind="bindPorps"
        v-on="onProps"
        ref="input"
        @change="changeValue">
      </post-selector>
      <goods-code-input class="edit-input"
        v-if="type === 'goodsCode'"
        v-model="currentValue"
        v-bind="bindPorps"
        v-on="onProps"
        ref="input"
        @change="changeValue">
      </goods-code-input>
      <sale-price-edit class="edit-input"
        v-if="type === 'salePriceEdit'"
        v-model="currentValue"
        v-bind="bindPorps"
        :bindPorps="bindPorps"
        v-on="onProps"
        :onProps="onProps"
        ref="input"
        @change="changeValue">
      </sale-price-edit>
      <provider-input class="edit-input"
        v-if="type === 'provider'"
        v-model="currentValue"
        v-bind="bindPorps"
        v-on="onProps"
        ref="input"
        @change="changeValue">
      </provider-input>
      <number-input class="edit-input"
        v-if="type === 'number-input'"
        v-model="currentValue"
        v-bind="bindPorps"
        v-on="onProps"
        ref="input"
        @change="changeValue">
      </number-input>
      <goods-photo class="edit-input"
        v-if="type === 'goods-photo'"
        v-bind="bindPorps">
      </goods-photo>
      <distpicker class="edit-input"
                   v-if="type === 'Distpicker'"
                   v-bind="bindPorps">
      </distpicker>
    </div>
  </div>
</template>
<script>
  import TableTreeNode from './TableTreeNode'
  import StaffSelector from '@/components/common/staff/StaffSelector'
  import DeptSelector from '@/components/common/dept/DeptSelector'
  import PostSelector from '@/components/common/post/PostSelector'
  import GoodsCodeInput from '@/components/common/goods/GoodsCodeInput'
  import SalePriceEdit from '@/components/common/price/SalePriceEdit'
  import ProviderInput from '@/components/common/provider/ProviderInput'
  import NumberInput from '@/components/common/number/NumberInput'
  import GoodsPhoto from '@/components/common/goods/GoodsPhoto'
  import Distpicker from '@/components/common/Distpicker'

  export default {
    props: {
      options: Object,
      value: null,
      row: Object,
      node: TableTreeNode
    },
    components: {
      StaffSelector,
      DeptSelector,
      PostSelector,
      GoodsCodeInput,
      SalePriceEdit,
      ProviderInput,
      NumberInput,
      GoodsPhoto,
      Distpicker
    },
    created () {
      this.currentValue = this.value
      if (this.selectOptions) {
        let selectItem = this.selectOptions.filter((item) => {
          if (item.value === this.currentValue) {
            return item
          }
        })
        if (selectItem.length === 0) {
          this.currentValue = ''
          this.$emit('input', this.currentValue)
        }
      }
    },
    computed: {
      buttons () {
        if (this.options.buttons && typeof this.options.buttons === 'function') {
          return this.options.buttons(this.row)
        } else {
          return this.options.buttons
        }
      },
      label () {
        if (this.options.label && typeof this.options.label.html === 'function') {
          return this.options.label.html(this.row)
        } else {
          if (this.options.label) {
            return this.options.label.html
          } else {
            return ''
          }
        }
      },
      inputStyle () {
        if (this.options.label) {
          return {
            float: 'left',
            width: 100 - (parseInt(this.options.label.width) || '100') + '%'
          }
        } else {
          return {
            float: 'left',
            width: '100%'
          }
        }
      },
      labelStyle () {
        return {
          float: 'left',
          width: this.options.label.width || 'auto'
        }
      },
      type () {
        if (typeof this.options.type === 'function') {
          return this.options.type(this.row)
        } else {
          return this.options.type
        }
      },
      selectOptions () {
        if (this.type === 'select') {
          if (typeof this.options.options === 'function') {
            return this.options.options(this.row)
          } else {
            return this.options.options
          }
        }
        return null
      },
      bindPorps () {
        if (this.options.bind) {
          const type = typeof this.options.bind
          if (type === 'object') {
            return this.options.bind
          } else if (type === 'function') {
            return this.options.bind(this.row)
          } else {
            return {}
          }
        } else {
          return {}
        }
      },
      onProps () {
        if (this.options.on) {
          const type = typeof this.options.on
          if (type === 'object') {
            return this.options.on
          } else if (type === 'function') {
            return this.options.on(this.row)
          } else {
            return {}
          }
        } else {
          return {}
        }
      }
    },
    data () {
      return {
        currentValue: null,
        validateState: null,
        errorMessage: ''
      }
    },
    watch: {
      value (value) {
        // element-ui 2.22以前的bug
        if (this.type === 'date') {
          if (value) {
            this.$refs.input.pickerVisible = true
            setTimeout(() => {
              this.$refs.input.pickerVisible = false
            })
          }
        }
        // element-ui 2.22以前的bug
        this.currentValue = this.value
        if (this.$refs.input && this.$refs.input.emitChange) {
          this.$refs.input.emitChange(this.value)
        }
        this.$nextTick(() => {
          if (this.validateState === 'error') {
            this.validate().then(() => {
              this.validateState = null
              if (this.$refs.input && this.$refs.input.$el.querySelector('input')) {
                this.$refs.input.$el.querySelector('input').style.borderColor = ''
              }
            }).catch(() => {
            })
          }
        })
      }
    },
    methods: {
      changeValue (val, obj, oldValue, flag) {
        if (flag) {
          return
        }
        this.resetValidateState()
        this.validateState = 'validating'
        // 验证数据的正确性
        if (this.options.rules && this.options.rules.length > 0) {
          this.validate().then(() => {
            this.$emit('input', this.currentValue)
            this.$emit('change', this.currentValue, obj, oldValue)
            this.validateState = null
          }).catch(() => {
            this.$emit('input', this.currentValue)
            this.$emit('change', this.currentValue, obj, oldValue)
          })
        } else {
          this.$emit('input', this.currentValue)
          this.$emit('change', this.currentValue, obj, oldValue)
        }
      },
      selectVisibleChange (state) {
        if (state === true) {
          this.resetValidateState()
        } else {
          this.$nextTick(() => {
            if (this.validateState !== 'validating') {
              this.$emit('cancel', this.currentValue)
            }
          })
        }
      },
      resetValidateState () {
        this.validateState = null
        if (this.$refs.input && this.$refs.input.$el.querySelector('input')) {
          this.$refs.input.$el.querySelector('input').style.borderColor = ''
        }
      },
      validate () {
        return new Promise((resolve, reject) => {
          const promiseList = []
          if (this.options.rules && this.options.rules.length && this.options.type !== 'button') {
            this.options.rules.forEach(rule => {
              promiseList.push(new Promise((resolve, reject) => {
                // 是否是非空验证，先验证非空验证
                if (rule.required && !this.currentValue) {
                  reject(rule.message)
                } else if (rule.validator && typeof rule.validator === 'function') {
                  // 调用自定义验证方法验证
                  rule.validator(this.currentValue, this.row, (errMessage) => {
                    if (errMessage) {
                      reject(errMessage)
                    } else {
                      resolve()
                    }
                  })
                } else {
                  resolve()
                }
              }))
            })
          }
          Promise.all(promiseList).then(() => {
            resolve()
          }).catch(err => {
            this.validateState = 'error'
            if (this.$refs.input && this.$refs.input.$el.querySelector('input')) {
              this.$refs.input.$el.querySelector('input').style.borderColor = 'red'
            }
            this.errorMessage = err
            reject(err)
          })
        })
      }
    }
  }
</script>
<style scoped>
  .edit-input{
    width: 98%;
  }
  .error-message{
    position: absolute;
    height: 14px;
    line-height: 14px;
    /*margin-top: 32px;*/
    margin-left: 5px;
    font-size: 12px;
    color: red;
    top: 34px;
    background-color: #fff;
    z-index: 111111000;
  }
</style>
