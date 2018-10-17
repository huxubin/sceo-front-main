<template>
  <div>
    <div class="sale-price">
      <div @click="editing" v-if="canEdit" :style="iconStyle">
        <i class="el-icon-edit"></i></div>
      <div v-if="type === 'input'" :style="inputStyle">
        <number-input class="edit-input"
                      v-model="value"
                      v-if="number"
                      @blur="editingEnd"
                      v-bind="bindPorps"
                      v-on="onProps"
                      ref="input"
                      @change="changeValue">
        </number-input>
        <el-input v-else ref="input" type="text" @blur="editingEnd" v-model="value"></el-input>

      </div>
      <div class="el-text--text" v-if="type === 'text'" :style="textStyle">
        <div class="hove-class" style="z-index: 1;" v-if="hoveValue">{{hoveValue}}</div>
        <span :style="{color: color}">{{ts ? UTILS.handleNum(value) : value}}</span>
      </div>
      <div class="el-text--text" v-if="type === 'select'" :style="selectStyle">
        <div class="hove-class" v-if="hoveValue">{{hoveValue}}</div>
        <el-select v-model="value"
                   @change="changeValue"
                   ref="input">
          <el-option v-for="item in selectData" :key="item.value" :value="item.value"
                     :label="item.label" :disabled="item.disabled">
            <span v-if="userDefined">{{ item.userDefined }}</span>
            <span v-else>{{ item.label }}</span>
          </el-option>
        </el-select>
      </div>
      <el-button v-if="type === 'button'" @click="doSomething" class="el-button--text" :style="buttonStyle">
        <div class="hove-class" style="z-index: 1;" v-if="hoveValue">{{hoveValue}}</div>
        <a :style="{textDecoration: 'underline', color: color}">{{ts ? UTILS.handleNum(value) : value}}</a>
      </el-button>
    </div>
  </div>
</template>

<script>
  import NumberInput from '@/components/common/number/NumberInput'
  export default {
    name: 'sale-price-edit',
    components: {
      NumberInput
    },
    props: {
      ts: { // thousand Separator
        type: Boolean,
        default: true
      }, // 是否有分割符
      model: {
        type: String | Number,
        default: ''
      },
      textType: {
        type: String,
        default: ''
      },
      color: {
        type: String,
        default: '#5487DC'
      },
      styleObject: {  // 样式对象
        type: Object,
        default: function () {
          return {inputStyle: {}, buttonStyle: {}, iconStyle: {}, selectStyle: {}, textStyle: {}}
        }
      },
      hoveValue: {  // 浮现文本
        type: String | Number,
        default: ''
      },
      selectData: {   // select数据
        type: Array,
        default: function () {
          return []
        }
      },
      canEdit: {
        type: Boolean,
        default: true
      },
      number: {
        type: Boolean,
        default: false
      },
      bindPorps: Object,
      onProps: Object,
      userDefined: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        value: '',
        type: this.textType || 'text',
        inputStyle: {float: 'right', width: '70%', textAlign: 'right', margin: '2px 0 0 5px'},
        buttonStyle: {float: 'right', width: '75%', textAlign: 'right', marginTop: '5px'},
        selectStyle: {float: 'right', width: '75%', textAlign: 'right'},
        iconStyle: {float: 'left', width: '25%', marginTop: '7px', fontSize: '18px'},
        textStyle: {float: 'right', width: '75%', textAlign: 'right', marginTop: '5px', overflow: 'auto'} // , overflow: 'hidden'}
      }
    },
    watch: {
      textType (val) {
        this.type = val || 'text'
      },
      model (val) {
        this.value = val
      },
      value (val, old) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    },
    methods: {
      doSomething () {
        this.$emit('click')
      },
      changeValue (value, newValue, oldValue, flag) {
        this.$emit('change', this.value, null, null, flag)
      },
      editing () {
        this.type = 'input'
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      },
      editingEnd () {
        if (this.textType === 'button') {
          this.type = 'button'
        } else if (this.textType === 'select') {
          this.type = 'select'
        } else {
          this.type = 'text'
        }
      }
    },
    created () {
      this.value = this.model
      if (this.styleObject.inputStyle) {
        this.inputStyle = {...this.inputStyle, ...this.styleObject.inputStyle}
      }
      if (this.styleObject.buttonStyle) {
        this.buttonStyle = {...this.buttonStyle, ...this.styleObject.buttonStyle}
      }
      if (this.styleObject.iconStyle) {
        this.iconStyle = {...this.iconStyle, ...this.styleObject.iconStyle}
      }
      if (this.styleObject.selectStyle) {
        this.selectStyle = {...this.selectStyle, ...this.styleObject.selectStyle}
      }
      if (this.styleObject.textStyle) {
        this.textStyle = {...this.textStyle, ...this.styleObject.textStyle}
      }
    }
  }
</script>

<style scoped>
  .sale-price{
    width: calc(100% - 5px);
    margin-right: 5px;
  }
  .el-icon-edit:hover{
    cursor: pointer;
  }
  .sale-price{
    position: absolute;
    /*width: 85%;*/
    top: 0;
  }
  .el-text--text .hove-class,
  .el-button--text .hove-class{
    position: absolute;
    display: none;
    float: right;
    right: 15px;
    bottom: -10px;
    color: red;
    z-index: 1000001;
  }
  .el-text--text:hover .hove-class,
  .el-button--text:hover .hove-class{
    display: block;
  }
  .el-text--text::-webkit-scrollbar {/*滚动条整体样式*/
    width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 2px;
  }
  .el-text--text::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #535353;
  }
  .el-text--text::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: #EDEDED;
  }
</style>
