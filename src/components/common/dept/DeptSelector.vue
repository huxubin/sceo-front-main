<template>
  <div>
    <el-input v-bind="$props" v-model="currentView"
      placeholder="请选择部门"
      readonly
      prefix-icon="el-icon-edit"
      @focus="showSelecter = true">
      <i slot="suffix" class="el-icon-close"
      style="cursor:pointer;line-height: 35px;"
      v-show="!disabled && !!currentView && canClear"
      @click="clear"></i>
    </el-input>
    <el-dialog :visible.sync="showSelecter" title="选择部门" width="400px"
      append-to-body>
      <div class="dept-tree">
        <el-tree v-if="showSelecter" v-loading="!loaded" ref="tree"
          node-key="id"
          highlight-current
          lazy
          :load="loadData"
          :props="{
            label: 'mdepName',
            children: 'childDeptList'
          }"
          :default-expanded-keys="[deptRoot]"
          @current-change="currentChage"></el-tree>
      </div>
      <div slot="footer" style="padding-right:10px;">
        <el-button type="primary" icon="el-icon-success" @click="select">确认</el-button>
        <el-button icon="el-icon-error" @click="showSelecter = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import moment from 'moment'

  export default {
    props: {
      value: String,
      deptName: String,
      deptRoot: {
        type: String,
        default: '1234567890abcdefghijkadcesadewds'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      filter: Function,
      beginDate: {
        type: String,
        default: moment().format('YYYY-MM-DD')
      },
      canClear: {
        type: Boolean,
        default: true
      }
    },
    created () {
      this.currentValue = this.value
      this.currentView = this.deptName
    },
    watch: {
      value (value) {
        this.currentValue = value
      },
      deptName (value) {
        this.currentView = value
      }
    },
    data () {
      return {
        // 当前值
        currentValue: null,
        // 当前显示值
        currentView: null,
        // 树数据
        treeData: null,
        // 弹框展示
        showSelecter: false,
        // 默认数据加载完毕
        loaded: false,
        // 当前值
        currentData: null
      }
    },
    methods: {
      getName () {
        return this.currentView
      },
      loadData (node, resolve) {
        if (node.level === 0) {
          // 初始加载
          this.UTILS.execUtil('depttree', 'deptTreeList', {
            level: 1,
            id: this.deptRoot,
            beginDate: this.beginDate,
            complement: 0
          }).then(data => {
            // 数据过滤
            if (this.filter) {
              if (this.filter(data)) {
                resolve([data])
              }
            } else {
              resolve([data])
            }
            this.$nextTick(() => {
              this.loaded = true
            })
          })
        } else {
          this.UTILS.execUtil('depttree', 'deptTreeList', {
            level: 1,
            id: node.key,
            beginDate: this.beginDate,
            complement: 0
          }).then(data => {
            if (data.childDeptList && data.childDeptList.length > 0) {
              if (this.filter) {
                const _data = []
                data.childDeptList.forEach(item => {
                  if (this.filter(item)) {
                    _data.push(item)
                  }
                })
                if (_data.length > 0) {
                  resolve(_data)
                } else {
                  resolve([])
                }
              } else {
                resolve(data.childDeptList)
              }
            } else {
              resolve([])
            }
          })
        }
      },
      currentChage (data, node) {
        this.currentData = data
      },
      select () {
        if (this.currentData) {
          const old = this.currentValue
          this.currentView = this.currentData.mdepName
          this.currentValue = this.currentData.id
          this.$emit('input', this.currentValue)
          this.$emit('change', this.currentValue, old, this.currentData)
          this.showSelecter = false
        } else {
          this.$message.warning('请选择部门')
        }
      },
      clear () {
        const old = this.currentValue
        this.currentView = null
        this.currentValue = null
        this.$emit('input', this.currentValue)
        this.$emit('change', this.currentValue, old)
      }
    }
  }
</script>
<style scoped lang="scss">
  .dept-tree{
    height: 400px;
    overflow: auto;
  }
</style>
