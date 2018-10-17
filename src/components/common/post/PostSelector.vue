<template>
  <div>
    <el-input v-bind="$props" v-model="currentView"
      placeholder="请选择汇报岗位"
      readonly
      prefix-icon="el-icon-edit"
      @focus="showSelecter = true">
      <i slot="suffix" class="el-icon-close"
      style="cursor:pointer;line-height: 35px;"
      v-show="!!currentView && !disabled"
      @click="clear"></i>
    </el-input>
    <el-dialog :visible.sync="showSelecter" title="选择岗位" width="400px"
      append-to-body>
      <div class="post-tree">
        <el-tree v-if="showSelecter" v-loading="!loaded" ref="tree"
          node-key="id"
          highlight-current
          lazy
          :load="loadData"
          :props="defaultProps"
          :default-expanded-keys="keyArr"
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
  export default {
    props: {
      value: String,
      postName: String,
      postRoot: {
        type: String
      },
      disabled: {
        type: Boolean,
        defalut: false
      },
      filter: Function
    },
    created () {
      this.currentValue = this.value
      this.currentView = this.postName
    },
    watch: {
      value (value) {
        this.currentValue = value
      },
      postName (value) {
        this.currentView = value
      }
    },
    data () {
      return {
        keyArr: [],
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
        currentData: null,
        // 默认设置
        defaultProps: {
          children: 'sub_posts',
          label: 'rpos_name'
        }
      }
    },
    methods: {
      getName () {
        return this.currentView
      },
      loadData (node, resolve) {
        if (node.level === 0) {
          // 初始加载
          let params = {
            parPostId: this.postRoot,
            isSelf: 'true',
            level: 1
          }
          this.UTILS.execUtil('jobposition', 'getPostsTree', params).then((data) => {
            // 数据过滤
            data.forEach(item0 => {
              this.keyArr.push(item0.id)
            })
            if (this.filter) {
              let temp = []
              data.forEach(item => {
                if (this.filter(item)) {
                  temp.push(item)
                }
              })
              resolve(temp)
            } else {
              resolve(data)
            }
            this.$nextTick(() => {
              this.loaded = true
            })
          })
        } else {
          let params = {
            parPostId: node.data.id,
            isSelf: 'false',
            level: 1
          }
          this.UTILS.execUtil('jobposition', 'getPostsTree', params).then(data => {
            if (this.filter) {
              let temp = []
              data.forEach(item => {
                if (this.filter(item)) {
                  temp.push(item)
                }
              })
              resolve(temp)
            } else {
              resolve(data)
            }
            this.$nextTick(() => {
              this.loaded = true
            })
          })
        }
      },
      currentChage (data, node) {
        this.currentData = data
      },
      select () {
        if (this.currentData) {
          const old = this.currentValue
          this.currentView = this.currentData.rpos_name
          this.currentValue = this.currentData.id
          this.$emit('input', this.currentValue)
          this.$emit('change', this.currentValue, old)
          this.showSelecter = false
        } else {
          this.$message.warning('请选择汇报岗位')
        }
      },
      clear () {
        const old = this.currentValue
        this.currentView = null
        this.currentValue = null
        this.$emit('input', this.currentValue)
        this.$emit('change', this.currentValue, null, old)
      }
    }
  }
</script>
<style scoped lang="scss">
  .post-tree{
    height: 400px;
    overflow: auto;
  }
</style>
