<template>
  <el-autocomplete
    v-model="currentView"
    :fetch-suggestions="querySearch"
    placeholder="输入员工姓名或工号"
    :disabled="disabled"
    @mouseenter.native="showClear = true"
    @mouseleave.native="showClear = false"
    @select="handleSelect"
    @blur="cancelSelect"
  >
    <!--<i class="el-icon-edit" style="width:25px;line-height: 35px;"-->
      <!--slot="prefix">-->
    <!--</i>-->
    <i key="edit" slot="suffix" class="el-icon-edit"
       style="cursor:pointer;line-height: 35px;"
       v-if="(!showClear || !currentView) && !disabled"
       @click="clear"></i>
    <i key="clear" slot="suffix" class="el-icon-circle-close"
      style="cursor:pointer;line-height: 35px;"
      v-if="!disabled && !!currentView && showClear"
      @click="clear"></i>
  </el-autocomplete>
</template>
<script>
  export default {
    props: {
      value: String,
      staffName: String,
      disabled: Boolean,
      deptId: String
    },
    created () {
      this.currentValue = this.value
      this.currentView = this.staffName
      if (this.currentValue) {
        this.currentStaff = {
          id: this.value,
          value: this.staffName
        }
      }
    },
    watch: {
      value () {
        this.currentValue = this.value
      },
      staffName (val) {
        this.currentView = this.staffName
        this.currentStaff = {value: val}
      }
    },
    data () {
      return {
        currentValue: null,
        currentView: null,
        currentStaff: null,
        showClear: false
      }
    },
    methods: {
      getName () {
        return this.currentView
      },
      querySearch (value, resolve) {
        if (value && value.trim()) {
          this.UTILS.execUtil('employee', 'queryEmployee', {
            searchName: value.trim(),
            deptId: this.deptId,
            removeLeav: 1,
            // 默认查询前100条数据
            startPage: 1,
            rows: 100
          }).then(data => {
            data.list.forEach(item => {
              item.value = `${item.remp_name.trim()} / ${item.remp_no.trim()}`
            })
            resolve(data.list)
          })
        } else {
          // if (this.currentValue) {
          //   this.clear()
          // }
          resolve([])
        }
      },
      handleSelect (staff) {
        this.currentStaff = staff
        const old = this.currentValue
        this.currentValue = staff.id
        this.$emit('input', this.currentValue)
        this.$emit('change', this.currentValue, old, this.currentView, staff)
      },
      clear () {
        const old = this.currentValue
        this.currentValue = ''
        this.currentView = ''
        this.currentStaff = null
        this.$emit('input', this.currentValue)
        this.$emit('change', this.currentValue, old, this.currentView)
      },
      cancelSelect () {
        setTimeout(() => {
          if (this.currentStaff) {
            this.currentView = this.currentStaff.value
          } else {
            this.currentView = ''
          }
        }, 300)
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
