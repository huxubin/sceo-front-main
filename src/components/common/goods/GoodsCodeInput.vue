<template>
  <div>
    <el-autocomplete
      :disabled="disable"
      v-model="value"
      :fetch-suggestions="querySearchAsync"
      placeholder="输入物品编号"
      @blur="cancelSelect"
      @select="handleSelect">
      <i
        class="el-icon-edit-outline el-input__icon"
        slot="suffix">
      </i>
    </el-autocomplete>
  </div>
</template>

<script>
export default {
  name: 'goodscode',
  props: {
    disable: {
      type: Boolean,
      default: false
    },
    model: {
      type: String,
      default: ''
    },
    providerId: {
      type: String,
      default: ''
    },
    parkId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      godsCode: {},
      value: ''
    }
  },
  watch: {
    model (val) {
      this.value = val
      this.godsCode.godsCode = val
      // this.$emit('input', this.value)
      // this.$emit('change', this.value, null)
    }
  },
  methods: {
    querySearchAsync (queryString, cb) {
      if (queryString && queryString.trim()) {
        let params = {
          godsCode: queryString,
          supplierId: this.providerId,
          parkId: this.parkId
        }
        this.UTILS.execUtil('goods', 'queryGoodsCodeList', params).then((data) => {
          if (data && data.length > 0) {
            data.forEach(item => {
              item.value = item.godsCode + '-' + item.godsName
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
      this.godsCode = item
      this.value = item.godsCode
      this.$emit('input', this.value)
      this.$emit('change', this.value, item)
    },
    cancelSelect () {
      setTimeout(() => {
        this.value = this.godsCode.godsCode
      }, 0)
    }
  },
  mounted () {
    this.godsCode.godsCode = this.model
    this.value = this.model
  }
}
</script>
