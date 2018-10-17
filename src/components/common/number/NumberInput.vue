<template>
  <el-input
    ref="input"
    :value="currentValue"
    :disabled="disabled"
    :max="max"
    :min="min"
    :key="keyValue"
    :maxlength="maxlength"
    :minlength="minlength"
    :readonly="readonly"
    :placeholder="placeholder"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange">
  </el-input>
</template>

<script>
  // import numeral from 'numeral'
  // import _ from 'lodash'
  export default {
    name: 'number-input',
    props: {
      max: {
        type: Number,
        default: Infinity
      }, // 最大值
      min: {
        type: Number,
        default: -Infinity
      }, // 最小值
      maxlength: {
        type: Number,
        default: 21
      }, // 最大长度
      minlength: Number, // 最小长度
      readonly: Boolean, // 是否只读
      placeholder: String, //
      disabled: Boolean, // 是否禁用
      hasmax: {
        type: Boolean,
        default: true
      }, // 是否包含最大值
      hasmin: {
        type: Boolean,
        default: true
      }, //  是否包含最小值
      precision: {
        type: Number | String,
        default: 7
      }, // 小数保留位数
      isInteger: {
        type: Boolean,
        default: false
      }, // 是否是整数
      prefixstr: {
        type: String,
        default: ''
      }, // 前缀
      ts: { // thousand Separator
        type: Boolean,
        default: true
      }, // 是否有分割符
      value: String | Number, //
      keyValue: String, // key
      fixedNum: String | Number, // 需要保留的小数位数
      isJustInteger: {
        type: Boolean,
        default: false
      }, // 是否是正整数 // 冗余参数最好不用
      hasZero: {
        type: Boolean,
        default: true
      } // 是否包含0 // 冗余参数最好不用
    },
    data () {
      return {
        currentValue: '',
        newValue: '',
        isInt: false,
        focusData: '',
        precisionValue: ''
      }
    },
    // computed: {
    //   fmtStr () {
    //     let prefix = this.prefixstr + '0'
    //     if (this.ts) {
    //       prefix = this.prefixstr + '0,0'
    //     }
    //     let suffix = ''
    //     if (this.precisionValue > 0) {
    //       suffix = _.padEnd('.', Number(this.precisionValue) + 1, '0')
    //     }
    //     return `${prefix}${suffix}`
    //   },
    //   noFmtStr () {
    //     let prefix = '0'
    //     let suffix = ''
    //     if (this.precisionValue > 0) {
    //       suffix = _.padEnd('.', Number(this.precisionValue) + 1, '0')
    //     }
    //     return `${prefix}${suffix}`
    //   }
    // },
    created () {
      this.isInt = this.isInteger
      if (this.precision || this.precision === 0) {
        this.precisionValue = this.precision
      } else {
        this.precisionValue = 7
      }
      if (this.isJustInteger || this.isInteger) {
        this.precisionValue = 0
      }
    },
    watch: {
      value: {
        immediate: true,
        handler (value) {
          this.handleChange(value, true)
        }
      },
      precision: {
        immediate: true,
        handler (value) {
          if (value || value === 0) {
            this.precisionValue = value
          } else {
            this.precisionValue = 7
          }
          if (this.isJustInteger || this.isInteger) {
            this.precisionValue = 0
          }
          if (this.newValue) {
            this.handleChange(this.newValue)
          }
        }
      }
    },
    methods: {
      handleInput (value) {
        value = this.filterWord(value)
        if (!value) {
          return
        }
        let flag = false
        if (value) {
          // this.$nextTick(() => {
          if (String(value).indexOf('.') === -1) {
            if (String(value).length > 12) {
              this.$message.warning('最多只能输入12位整数')
              flag = true
            }
          } else {
            if (String(value).split('.')[0].length > 12) {
              this.$message.warning('最多只能输入12位整数')
              flag = true
            }
          }
          // })
        }
        if (this.precisionValue > 0 && value && String(value).indexOf('.') !== -1) {
          // this.$nextTick(() => {
          this.currentValue = String(value).substring(0, String(value).split('.')[0].length + Number(this.precisionValue) + 1)
          if (String(value).length !== String(this.currentValue).length) {
            this.$message.warning(`只能保留${this.precisionValue}位小数位`)
            flag = true
          }
          // })
        } else {
          // this.$nextTick(() => {
          if (String(value).indexOf('.') !== -1) {
            this.$message.warning(`只能输入整数`)
            flag = true
          }
          // })
        }
        if (!flag) {
          this.newValue = value
        }
        this.$nextTick(() => {
          this.$refs.input.setCurrentValue(this.newValue)
        })
      },
      focus () {
        this.$refs.input.focus()
      },
      // 过滤输入字符
      filterWord (val) {
        if (!val) {
          return ''
        }
        let canInWord = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        let dotNum = 0
        val = String(val).split('')
        val.map((item, index) => {
          if (canInWord.indexOf(item) === -1) {
            if (!(index === 0 && item === '-')) {
              this.$message.warning('输入不合法！')
              val[index] = ''
            }
          }
        })
        val = val.join('').split('')
        val.map((item, index) => {
          if (item === '.' && index === 0) {
            val[index] = '0.'
          } else if (item === '.' && index === 1 && val[0] === '-') {
            val[index] = '0.'
          } else if (item === '.' && !dotNum) {
            dotNum = index
          } else if (item === '.') {
            this.$message.warning('输入不合法！')
            val[index] = ''
          }
        })
        let reVal = val.join('')
        if (!reVal) {
          this.$nextTick(() => {
            this.$refs.input.setCurrentValue('')
          })
        }
        return reVal
      },
      handleFocus (event) {
        this.$emit('focus', event)
        this.$refs.input.setCurrentValue(this.newValue)
        setTimeout(() => {
          this.focusData = this.newValue
        })
      },
      handleBlur (event) {
        if (String(this.currentValue).indexOf(',') === -1) {
          this.handleChange(this.currentValue)
        }
        this.$emit('blur', this.currentValue, this.focusData, event)
        this.$emit('change', this.currentValue, {type: 'numberFocus'}, this.focusData)
        this.$refs.input.setCurrentValue(this.currentValue)
      },
      getValidValue (val) {
        if (!val && val !== 0) {
          return ''
        }
        if (parseInt(this.precisionValue) === 0 && !this.isJustInteger) {
          this.isInt = true
        } else {
          this.isInt = false
        }
        let handleVal = val // parseFloat(val)
        if (isNaN(parseFloat(val))) {
          this.$message.warning('请输入数字！')
          return ''
        }
        let maxStr = ''
        let minStr = ''
        // let hasmaxStr = ''
        // let hasminStr = ''
        let isIntegerStr = ''
        if (this.max !== Infinity) {
          if (this.hasmax) {
            if (!(this.max >= parseFloat(val))) {
              handleVal = ''
            }
            maxStr = `小于等于${this.max}的`
          } else {
            if (!(this.max > parseFloat(val))) {
              handleVal = ''
            }
            maxStr = `小于${this.max}的`
          }
        }
        if (this.min !== -Infinity) {
          if (this.hasmin) {
            if (!(this.min <= parseFloat(val))) {
              handleVal = ''
            }
            minStr = `大于等于${this.min}的`
          } else {
            if (!(this.min < parseFloat(val))) {
              handleVal = ''
            }
            minStr = `大于${this.min}的`
          }
        }
        let numberString = '数字'
        if (this.isInt) {
          isIntegerStr = '整'
          numberString = '数'
        }
        if (this.isJustInteger) {
          isIntegerStr = '正整'
          numberString = '数'
        }
        let err = `只能输入${minStr}${maxStr}${isIntegerStr}${numberString}` + (this.hasZero ? '' : ',不包括0')
        if (handleVal && this.isInt) {
          handleVal = String(val).split(',')[0]
        }
        if (handleVal && this.isJustInteger) {
          handleVal = String(val).split(',')[0]
          if (!this.hasZero && String(handleVal) === '0') {
            handleVal = ''
          }
          if (!(handleVal > 0)) {
            handleVal = ''
          }
        }
        if (String(handleVal) !== String(val)) {
          this.$message.warning(err)
        }
        if (handleVal && this.precisionValue > 0) {
          // handleVal = this.numeralHandle(handleVal, this.noFmtStr)
          handleVal = this.numeralHandle(handleVal)
        }
        if (!handleVal) {
          return handleVal
        }
        // 去整数位最高位0
        let numSymbol = ''
        let handleValArr = String(handleVal).split('.')
        handleValArr[0] = handleValArr[0].split('')
        if (handleValArr[0][0] === '-') {
          numSymbol = '-'
          handleValArr[0].shift()
        }
        handleValArr[0] = handleValArr[0].join('')
        handleValArr[0] = numSymbol + String(Number(handleValArr[0]))
        if (!handleValArr[1]) {
          handleValArr.length = 1
        }
         // 排除-0
        if (handleValArr.join('.') === '-0') {
          return '0'
        }
        return handleValArr.join('.')
      },
      // 去尾数0 返回字符串
      // pastZero (val) {
      //   let handleData = val + ''
      //   if (handleData.indexOf('.') !== -1) {
      //     let zeroArr = handleData.split('.')[1].split('')
      //     let zeroNum = 0
      //     if (zeroArr.length === 0) {
      //       return handleData.split('.')[0]
      //     }
      //     for (let i = zeroArr.length - 1; i >= 0; i--) {
      //       if (parseInt(zeroArr[i]) === 0) {
      //         zeroNum++
      //       } else {
      //         zeroArr.length = zeroArr.length - zeroNum
      //         return zeroArr.length === 0 ? handleData.split('.')[0] : handleData.split('.')[0] + '.' + zeroArr.join('')
      //       }
      //     }
      //     return handleData.split('.')[0]
      //   } else {
      //     return val
      //   }
      // },
      // numeralHandle (val, fmt) {
      //   let returnVal = this.pastZero(numeral(Math.abs(val)).format(fmt))
      //   if (val < 0) {
      //     returnVal = '-' + returnVal
      //   }
      //   return returnVal
      // },
      // 减少进度损失
      numeralHandle (val) {
        let fixedVal = String(val).split('.')
        if (Number(fixedVal[1])) {
          fixedVal[1] = Number(Number('0.' + fixedVal[1]).toFixed(this.precisionValue))
          if (!fixedVal[1]) {
            fixedVal.length = 1
          } else {
            fixedVal[1] = String(fixedVal[1]).split('.')[1]
          }
        } else {
          fixedVal.length = 1
        }
        return fixedVal.join('.')
        // return this.UTILS.handleNum(fixedVal.join('.'))
      },
      handleChange (value, watch) {
        // let decimals = ''
        // if (String(value).indexOf('.') !== -1) {
        //   decimals = String(value).split('.')[1]
        // }
        let newVal = this.getValidValue(value)
        if (!newVal && newVal !== 0) {
          this.currentValue = ''
          newVal = ''
        } else {
          this.currentValue = this.prefixstr ? this.prefixstr + this.UTILS.handleNum(newVal, this.fixedNum) : this.UTILS.handleNum(newVal, this.fixedNum)
        }
        // if (decimals && String(newVal).indexOf('.') !== -1 && String(newVal).split('.')[1].length >= decimals.length) {
        //   newVal = String(newVal).split('.')[0] + '.' + decimals
        // }
        // if (decimals && String(this.currentValue).indexOf('.') !== -1 && String(this.currentValue).split('.')[1].length >= decimals.length) {
        //   this.currentValue = String(this.currentValue).split('.')[0] + '.' + decimals
        // }
        this.newValue = newVal
        this.$emit('input', newVal)
        if (watch) { // 避免加载的时候检验
          this.$emit('change', newVal, null, null, true)
        } else {
          this.$emit('change', newVal)
        }
      }
    },
    mounted () {
    },
    updated () {
    }
  }
</script>

<style scoped>

</style>
