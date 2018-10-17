<template>
  <div>
    <el-autocomplete
      :disabled="disable"
      v-model="value"
      :fetch-suggestions="querySearchAsync"
      :placeholder="placeholder"
      @mouseenter.native="showClear = true"
      @mouseleave.native="showClear = false"
      @blur="cancelSelect"
      @focus="focus"
      @select="handleSelect">
      <i
        v-if="!(!disable && !!value && canClear && showClear)"
        key="noClear"
        style="cursor:pointer;"
        class="el-icon-edit"
        slot="suffix">
      </i>
      <i
        @click="clear"
        style="cursor:pointer;"
        v-if="!disable && !!value && canClear && showClear" key="canClear"
        class="el-icon-circle-close"
        slot="suffix">
      </i>
    </el-autocomplete>
  </div>
</template>
<script>
  export default {
    name: 'provider',
    props: {
      disable: {
        type: Boolean,
        default: false
      },
      model: {
        type: String,
        default: ''
      },
      // 园区id
      parkid: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: '输入供应商编号/名称'
      },
      // 1为客户2，为供应商
      type: {
        type: String,
        default: ''
      },
      // 查询的供应商状态 :1,2,3便是查询供应商状态为1或2或3
      status: {
        type: String,
        default: ''
      },
      canClear: {
        type: Boolean,
        default: false
      },
      // 剔除用户类别为0零售的客户
      excludeCustType: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        supplier: {value: this.model},
        value: this.model,
        showClear: false
      }
    },
    watch: {
      model (val) {
        this.value = val
        this.supplier.value = val
      }
    },
    methods: {
      querySearchAsync (queryString, cb) {
        if (queryString && queryString.trim()) {
          let params = {
            keyword: queryString,
            type: this.type,
            status: this.status,
            excludeCustType: this.excludeCustType
          }
          this.UTILS.execUtil('relation', 'fuzzyQuery', params).then((data) => {
            if (data && data.length > 0) {
              data.forEach(item => {
                item.value = item.relaCode + '-' + item.relaShortName
              })
              cb(data)
            } else {
              cb([])
            }
          })
        } else {
          cb([])
        }
      },
      handleSelect (item) {
        // item.parkId = this.parkid
        this.supplier = item
        this.value = item.value
        this.$emit('input', this.value)
        this.$emit('change', this.value, item)
        // this.$eventBus.$emit('selectProvider', item)
      },
      clear () {
        this.supplier = {}
        this.value = ''
        this.$emit('input', '')
        this.$emit('change', '', {})
      },
      focus () {
        this.$emit('focus', this.value)
      },
      cancelSelect () {
        this.$emit('blur', this.value)
        setTimeout(() => {
          this.value = this.supplier.value
        }, 0)
      },
      mounted () {
        this.supplier.value = this.model
        this.value = this.model
      }
    }
  }
</script>
