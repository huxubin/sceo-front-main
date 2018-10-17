<template>
  <span class="colume-content" v-if="!editAble"  @click="expand">
    <div :style="{
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        paddingLeft: row.level * 10 + 'px'}" v-if="isTreeNode">
      <span style="color:#777;"
        :title="row.expand ? '收缩' : '展开'">
        <i v-if="isTreeNode && row.children && !row.isLeaf"
        :class="row.expand ? 'el-icon-minus' : 'el-icon-plus'"></i>
        <span v-else style="padding-left:17px;"></span>
      </span>
      <span>
        <span v-html="contentData"></span>
        <i class="el-icon-loading" v-if="row.loading"></i>
      </span>
    </div>
    <span v-else v-html="contentData">
    </span>
  </span>
  <rx-table-editor
    ref="editor"
    v-else
    v-model="row.nodeData[column.field]"
    @change="cellChange"
    :options="column.editOptions"
    :row="row.nodeData"
    :node="row">
  </rx-table-editor>
</template>
<script>
  import RxTableEditor from './RxTableEditor'

  export default {
    props: {
      scope: Object,
      column: Object,
      isTreeNode: Boolean
    },
    components: {
      RxTableEditor
    },
    watch: {
    },
    computed: {
      row () {
        return this.scope.row
      },
      contentData () {
        if (this.column.formatter && typeof this.column.formatter === 'function') {
          return this.column.formatter(this.row.nodeData[this.column.field], this.row.nodeData)
        } else {
          return this.row.nodeData[this.column.field]
        }
      },
      editAble () {
        if (typeof this.column.editAble === 'boolean') {
          return this.column.editAble
        } else if (typeof this.column.editAble === 'function') {
          return this.column.editAble(this.row.nodeData)
        } else {
          return false
        }
      }
    },
    data () {
      return {
      }
    },
    methods: {
      cellChange (newValue, obj, oldValue) {
        this.$emit('cellChange', this.scope.row, this.column, obj, oldValue)
      },
      expand () {
        if (this.isTreeNode) {
          this.$emit('expandChange', this.scope.row)
        }
      },
      validate () {
        return new Promise((resolve, reject) => {
          if (this.editAble) {
            this.$refs.editor.validate().then(() => {
              resolve()
            }).catch(err => {
              reject(err)
            })
          } else {
            resolve()
          }
        })
      },
      // 清空效验状态
      resetValidateState () {
        if (this.$refs.editor) {
          this.$refs.editor.resetValidateState()
        }
      }
    }
  }
</script>
<style scoped>
  .edit-flag{
    color: #999;
  }
</style>
