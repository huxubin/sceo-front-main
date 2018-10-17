<template>
  <div class="dist-picker">
    <el-cascader
      :disabled="disabled"
      :filterable="filterable"
      ref="cascader"
      :options="options"
      :title="addressTitle"
      v-model="val"
      :placeholder="placeholder"
      :change-on-select="changeOnSelect"
      :show-all-levels="showAllLevels"
      :clearable="clearable"
      :props="{label:settings.label,value:settings.value}"
      @active-item-change="itemChange"
      @change="handleChange">
    </el-cascader>
  </div>
</template>

<script>
  import _ from 'lodash'

  /**
   * 省市区选择器
   */
  export default {
    name: 'distpicker',
    props: {
      /**
       * 属性类型
       * text: 当省市区储存为一个属性时，v-model 绑定省市区属性 type 设置为 text 得到的数据为 JSON.stringify(['省','市','区'])
       * array: 当省市区储存为一个属性时，v-model 绑定省市区属性 type 设置为 array 得到的数据为 ['省','市','区']
       * auto: 默认类型，省市区分为三个属性时，v-model绑定 包含省市区属性的对象
       */
      type: {
        type: String,
        default: 'auto'
      },
      value: {
        required: true,
        type: Object | String
      },
      // 是否可任意选择
      changeOnSelect: {
        type: Boolean,
        default: false
      },
      // 是否显示完整路径
      showAllLevels: {
        type: Boolean,
        default: true
      },
      // 是否支持清空选项
      clearable: {
        type: Boolean,
        default: false
      },
      /**
       * props 对应 el-cascader props，另包 this.settings 属性 请参照属性注释
       */
      props: {
        type: Object,
        default () {
          return {}
        }
      },
      // 开启过滤
      filterable: {
        type: Boolean,
        default: false
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: '请选择'
      }
    },
    created () {
      Object.assign(this.settings, this.props)
    },
    mounted () {
      let _this = this.$refs.cascader
      _this.hideMenu = _ => {
        _this.inputValue = ''
        _this.menu.visible = false
        _this.$refs.input.focus()
        this.$emit('visible-change', false)
      }
      _this.clearValue = (ev) => {
        ev.stopPropagation()
        _this.handlePick([], true)
        this.$emit('clear-change')
      }
      this.cascader = this.$refs['cascader']
      this.loadProvinces()
    },
    methods: {
      init () {
        if (this.watchValue.length > 0) {
          this.setValue(this.watchValue)
        }
      },
      handleChange (val) {
        if (this.changeOnSelect) {
          this.itemChange(val)
        }
        let rs = null
        if (this.type === 'text') {
          rs = JSON.stringify(this.val)
        } else if (this.type === 'array') {
          rs = this.val
        } else {
          rs = this.value
          this.$set(rs, this.settings.province, val[0])
          this.$set(rs, this.settings.city, val[1])
          this.$set(rs, this.settings.area, val[2])
        }
        this.$emit('input', rs)
        this.$emit('change', rs, rs)
        this.getAddressTitle()
      },
      itemChange (val) {
        let obj = {children: this.options}
        for (let i of val) {
          obj = _.find(obj.children, {'id': i})
        }
        if (obj && obj.children && obj.children.length < 1) {
          this.loadCity(obj).then(len => {
            if (len < 1) {
              this.val = val
              this.cascader.handlePick(val, true)
            }
          })
        }
      },
      loadProvinces () {
        this.$store.dispatch('dictStore/getProvinces')
          .then((data) => {
            this.options = data
            this.init()
          })
      },
      loadCity (obj) {
        return this.$store.dispatch('dictStore/getChildDeep', obj)
      },
      setValue (arr) {
        let province = _.find(this.options, {'id': arr[0]})
        if (arr[1] && province && province.children.length < 1) {
          this.loadCity(province).then(len => {
            let city = _.find(province.children, {'id': arr[1]})
            if (arr[2]) {
              this.loadCity(city).then(() => {
                this.getAddressTitle()
              })
            } else {
              this.getAddressTitle()
            }
          })
        } else if (arr[2] && province) {
          let city = _.find(province.children, {'id': arr[1]})
          this.loadCity(city).then(() => {
            this.getAddressTitle()
          })
        }
        this.val = arr
      },
      getTextValue () {
        let arrData = this.options
        let textValue = []
        for (let i in this.val) {
          arrData = _.find(arrData, {'id': this.val[i]})
          textValue[i] = arrData['name']
          arrData = arrData.children
        }
        return textValue
      },
      getAddressTitle () {
        let addressTitleArray = this.getTextValue()
        this.addressTitle = addressTitleArray.join().replace(/,/g, '/')
      }
    },
    watch: {
      watchValue (val) {
        if (this.UTILS.arrContrast(val, this.val)) return false
        if (val.length < 1) {
          this.val = []
        } else {
          this.setValue(val)
        }
      }
    },
    computed: {
      watchValue () {
        let val = []
        if (this.type === 'text') {
          try {
            val = JSON.parse(this.value)
          } catch (e) {}
        } else if (this.type === 'array') {
          val = this.value
        } else {
          this.value[this.settings.province] && val.push(this.value[this.settings.province])
          this.value[this.settings.city] && val.push(this.value[this.settings.city])
          this.value[this.settings.area] && val.push(this.value[this.settings.area])
        }
        if (val === null) val = []
        return val
      }
    },
    data () {
      return {
        settings: {
          province: 'province', // 省字段 针对auto类型有效
          city: 'city', // 市字段 针对auto类型有效
          area: 'area', // 区字段 针对auto类型有效
          label: 'name', // 同el-cascader
          value: 'id' // 同el-cascader
        },
        cascader: null, // el-cascader的ref
        val: [], // el-cascader的 value
        addressTitle: '',
        options: []
      }
    }
  }
</script>

<style scoped>
  .dist-picker {
    display: inline-block;
  }

  .el-cascader {
    width: 100%;
  }
</style>
