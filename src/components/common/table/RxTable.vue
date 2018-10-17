<template>
  <!-- 最多支持三级表头 -->
  <el-table
    v-bind="tableOptions" :data="tableData" ref="$table" :span-method="spanMethod"
    :summary-method="tableOptions.getSummaries"
    :row-class-name="rowClassName"
    :header-row-style="{
      backgroundColor: '#F5F6F8'
    }"
    row-key="id"
    @select="select"
    @select-all="selectAll"
    @selection-change="selectionChange"
    @cell-mouse-enter="cellMouseEnter"
    @cell-click="cellClick"
    @cell-dblclick="cellDblclick"
    @row-click="rowClick"
    @row-contextmenu="rowContextmenu"
    @row-dblclick="rowDblclick"
    @header-click="headerClick"
    @sort-change="sortChange"
    @current-change="currentChange">
    <el-table-column type="selection" reserve-selection align="center" v-if="tableOptions.selection"  :selectable="selectable" prop="$selection"
      width="40"></el-table-column>
    <el-table-column v-if="tableOptions.showIndex" label="序号" :width="indexWidth" prop="$index" align="center">
      <template slot-scope="scope">
        <div>
          <div style="text-align:center;">{{getIndex(scope.row.index)}}</div>
        </div>
      </template>
    </el-table-column>
    <!-- 一级表头 -->
    <el-table-column
      v-for="column_1 in columns"
      v-if="!column_1.hidden"
      :key="column_1.field"
      :prop="column_1.field"
      v-bind="column_1"
      :label="column_1.name">
      <!-- 二级表头 -->
      <el-table-column
        v-for="column_2 in column_1.children"
        v-bind="column_2"
        :key="column_2.field"
        :prop="column_2.field"
        :label="column_2.name">
        <!-- 三级表头 -->
        <el-table-column
          v-for="column_3 in column_2.children"
          v-bind="column_3"
          :key="column_3.field"
          :prop="column_3.field"
          :label="column_3.name">
          <template slot-scope="scope">
            <rx-table-content :scope="scope" :column="column_3" ref="content"
             @cellChange="cellChange"
             :editing="currentEditRow === scope.row && currentEditField === column_3.field"
             :is-tree-node="nodeOptions && nodeOptions.node === column_3.field"
             @expandChange="expandChange"></rx-table-content>
          </template>
        </el-table-column>
        <template v-if="!column_2.children" slot-scope="scope">
          <rx-table-content :scope="scope" :column="column_2" ref="content"
           @cellChange="cellChange"
           :editing="currentEditRow === scope.row && currentEditField === column_2.field"
           :is-tree-node="nodeOptions && nodeOptions.node === column_2.field"
           @expandChange="expandChange"></rx-table-content>
        </template>
      </el-table-column>
      <template v-if="!column_1.children" slot-scope="scope">
        <rx-table-content :scope="scope" :column="column_1" ref="content"
         @cellChange="cellChange"
         :editing="currentEditRow === scope.row && currentEditField === column_1.field"
         :is-tree-node="nodeOptions && nodeOptions.node === column_1.field"
         @expandChange="expandChange"></rx-table-content>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import RxTableContent from './RxTableContent'
  import TableTreeNode from './TableTreeNode'

  export default {
    props: {
      // 表格参数
      tableOptions: Object,
      // 列参数
      columns: Array,
      // 树节点定义参数
      // 包含node，key，children, getChildren方法
      // 分别代表可以展开的节点字段，唯一标识字段，子节点字段
      // 其中node必填，key默认id，children默认children
      // getChildren方法是在节点为空数组，且加载状态为false时，调用
      nodeOptions: Object,
      // 当前展开层数
      expandLevel: {
        type: Number,
        default: 1
      },
      // 当前展开节点ID
      defaultExpandKeys: Array,
      indexWidth: {
        type: Number | String,
        default: '40'
      },
      // currentPage // 当前显示的页数
      // pageSize // 每页显示的条数
      pageParam: Object
    },
    components: {
      RxTableContent
    },
    created () {
      this.tableOptions.rowKey = 'id'
      if (this.tableOptions.data) {
        this.initData()
      }
    },
    mounted () {
      this.$refs.$table.doLayout()
      // console.log(this.columns)
    },
    computed: {
      leafColumn () {
        const leafColumn = [];
        (function intoLeaf (columns) {
          for (let column of columns) {
            if (column.children) {
              intoLeaf(column.children)
            } else {
              leafColumn.push(column)
            }
          }
        })(this.columns)
        return leafColumn
      },
      mergeColumn () {
        const mergeColumn = []
        this.leafColumn.forEach(item => {
          if (item.merge) {
            mergeColumn.push(item.field)
          }
        })
        return mergeColumn
      }
    },
    watch: {
      'tableOptions.data': {
        handler () {
          if (this.tableNodes && this.tableNodes.length > 0) {
            // 更新当前数据
            this.updateData()
            this.$nextTick(() => {
              // 重置当前选中行
              this.resetSelectRow()
            })
          } else {
            // 初始化数据
            this.initData()
          }
          this.$nextTick(() => {
            this.$refs.$table.doLayout()
          })
        },
        deep: true
      },
      expandLevel () {
        this.updateData()
      },
      defaultExpandKeys () {
        this.updateData()
      }
    },
    data () {
      return {
        // 表格数据，树形
        tableNode: [],
        // 当前绑定表格数据
        tableData: [],
        // 当前编辑的表格
        currentEditRow: {},
        // 当前编辑的字段
        currentEditField: '',
        // 当前选中行
        selectRows: [],
        // 合并状态
        mergeState: {}
      }
    },
    methods: {
      toggleCellCheck (row) {
        this.$emit('toggle-cell-check', row)
      },
      getIndex (index) {
        if (this.pageParam) {
          return (Number(this.pageParam.currentPage) - 1) * this.pageParam.pageSize + Number(index)
        } else {
          return index
        }
      },
      // 清空行效验状态
      resetRowValidateState (row) {
        const contents = this.$refs.content
        if (contents && contents.length) {
          contents.forEach(item => {
            if (item.row.nodeData === row) {
              item.resetValidateState()
            }
          })
        }
      },
      // 清空所有效验状态
      resetAllValidateState () {
        const contents = this.$refs.content
        if (contents && contents.length) {
          contents.forEach(item => {
            item.resetValidateState()
          })
        }
      },
      doLayout () {
        this.$refs.$table.doLayout()
      },
      selectable (row, index) {
        if (this.tableOptions.selectable && typeof this.tableOptions.selectable === 'function') {
          return this.tableOptions.selectable(row.nodeData, index)
        } else {
          return true
        }
      },
      setTableData () {
        const that = this
        const tableData = [];
        (function setData (nodes, currentIndex) {
          for (let index = 0; index < nodes.length; index++) {
            const item = nodes[index]
            tableData.push(item)
            // 当前存在和并列
            if (that.nodeOptions && that.mergeColumn.indexOf(that.nodeOptions.node) >= 0) {
              // 判断下一级
              while (nodes[index + 1] &&
                nodes[index + 1].nodeData[that.nodeOptions.node] === item.nodeData[that.nodeOptions.node]) {
                tableData.push(nodes[++index])
              }
            }
            // 添加下级数据
            if (item.loaded && item.expand && item.children && item.children.length > 0) {
              setData(item.children, item.index + '.')
            }
          }
        })(this.tableNodes, '')
        this.tableData = tableData
      },
      // 2018-06-07 add 4 select row by ids
      setSelectRowsById (selectRowIds) {
        const currentSelectRow = []
        selectRowIds.forEach(itemId => {
          for (let index = 0, length = this.tableData.length; index < length; index++) {
            const dataItem = this.tableData[index]
            if (dataItem.id === itemId) {
              currentSelectRow.push(dataItem)
            }
          }
        })
        this.resetSelectRow()
        this.$refs.$table.clearSelection()
        currentSelectRow.forEach(item => {
          this.$refs.$table.toggleRowSelection(item, true)
        })
      },
      resetSelectRow () {
        const currentSelectRow = []
        this.selectRows.forEach(item => {
          for (let index = 0, length = this.tableData.length; index < length; index++) {
            const dataItem = this.tableData[index]
            if (dataItem === item) {
              currentSelectRow.push(item)
            }
          }
        })
        // console.log(currentSelectRow)
        this.$refs.$table.clearSelection()
        currentSelectRow.forEach(item => {
          this.$refs.$table.toggleRowSelection(item, true)
        })
        this.selectRows = currentSelectRow
      },
      clearAllEditingState () {
        for (let item of this.tableData) {
          if (item.editState) {
            for (let key in item.editState) {
              this.$set(item.editState, key, false)
            }
          }
        }
      },
      initData () {
        this.tableNodes = []
        this.tableOptions.data.forEach((item, index) => {
          this.tableNodes.push(new TableTreeNode({
            nodeData: item,
            nodeOptions: this.nodeOptions,
            level: 1,
            index: index + 1,
            isExpand: this.isExpand
          }))
        })
        this.setTableData()
      },
      updateData () {
        // 找出需要删除的节点
        for (let index = 0; index < this.tableNodes.length; index++) {
          const item = this.tableNodes[index]
          let flag = true
          for (let data of this.tableOptions.data) {
            if (data[this.nodeOptions && this.nodeOptions.key || 'id'] === item.id) {
              flag = false
              break
            }
          }
          if (flag) {
            // 删除节点数据
            this.tableNodes.splice(index--, 1)
          }
        }

        // 按顺序更新或者插入节点
        this.tableOptions.data.forEach((data, index) => {
          let flag = true
          for (let j = 0; j < this.tableNodes.length; j++) {
            const node = this.tableNodes[j]
            if (node.id === data[this.nodeOptions && this.nodeOptions.key || 'id']) {
              // 节点插入到新的位置
              this.tableNodes.splice(index, 0, node)
              // 删除原位置上的数据
              if (j >= index) {
                this.tableNodes.splice(j + 1, 1)
              } else {
                this.tableNodes.splice(j, 1)
              }
              // 更新节点
              node.update(data, index + 1)
              flag = false
              break
            }
          }
          if (flag) {
            // 新增节点
            const node = new TableTreeNode({
              nodeData: data,
              nodeOptions: this.nodeOptions,
              level: 1,
              index: index + 1,
              isExpand: this.isExpand
            })
            this.tableNodes.splice(index, 0, node)
          }
        })
        // 重新展示数据
        this.setTableData()
      },
      isExpand (node) {
        if (node.level < this.expandLevel) {
          return true
        } else {
          if (this.defaultExpandKeys && this.defaultExpandKeys.indexOf(node.id) >= 0) {
            return true
          } else {
            return false
          }
        }
      },
      spanMethod ({row, column, rowIndex, columnIndex}) {
        let currentColumnIndex = columnIndex
        if (this.tableOptions.selection) {
          if (column.property === '$selection') {
            const spanOptions = {
              rowspan: 1,
              colspan: 1
            }
            this.updateMergeState(spanOptions, rowIndex, columnIndex)
            return spanOptions
          } else {
            currentColumnIndex--
          }
        }
        if (this.tableOptions.showIndex) {
          if (column.property === '$index') {
            const spanOptions = {
              rowspan: 1,
              colspan: 1
            }
            this.updateMergeState(spanOptions, rowIndex, columnIndex)
            return spanOptions
          } else {
            currentColumnIndex--
          }
        }
        const currentColumn = this.leafColumn[currentColumnIndex]
        const mergeField = currentColumn.mergeField || currentColumn.field
        // 判断当前列是否是合并列
        if (currentColumn.merge) {
          if (currentColumn.mergeAsIndex) {
            const spanOptions = this.mergeState[rowIndex][currentColumn.mergeAsIndex - 1]
            if (spanOptions) {
              this.updateMergeState(spanOptions, rowIndex, columnIndex)
              return spanOptions
            }
          }
          if (rowIndex > 0 && this.tableData[rowIndex - 1].nodeData[mergeField] === row.nodeData[mergeField]) {
          // 向上寻找相同项
            const spanOptions = {
              rowspan: 0,
              colspan: 0
            }
            this.updateMergeState(spanOptions, rowIndex, columnIndex)
            return spanOptions
          } else {
            // 向下寻找相同项
            let rowspan = 1
            while (this.tableData[rowIndex + rowspan] &&
              this.tableData[rowIndex + rowspan].nodeData[mergeField] === row.nodeData[mergeField]) {
              rowspan++
            }
            const spanOptions = {
              rowspan,
              colspan: 1
            }
            this.updateMergeState(spanOptions, rowIndex, columnIndex)
            return spanOptions
          }
        }
      },
      // 表格展开事件
      expandChange (node) {
        if (!node.loaded) {
          node.loading = true
          this.nodeOptions.addChildren(node.nodeData, (data) => {
            node.expand = !node.expand
            node.appendChild(data)
            this.updateData()
          })
        } else {
          node.expand = !node.expand
          this.setTableData()
        }
      },
      rowClassName ({row, rowIndex}) {
        if (this.tableOptions.rowClassName &&
          typeof this.tableOptions.rowClassName === 'function') {
          this.tableOptions.rowClassName({row: row.nodeData, rowIndex})
        }
      },
      // 修改内容
      cellChange (newRow, column, obj, oldValue) {
        this.$emit('cell-change', newRow.nodeData, column, obj, oldValue)
      },
      // 选择事件
      select (selection, row) {
        this.$emit('select', this.getRowDataFromNodes(selection), row.nodeData)
      },
      // 全选事件
      selectAll (selection) {
        this.$emit('select-all', this.getRowDataFromNodes(selection))
      },
      // 选择发生变化
      selectionChange (selection) {
        this.selectRows = selection
        this.$emit('selection-change', this.getRowDataFromNodes(selection))
      },
      // 单元格鼠标进入
      cellMouseEnter (row, column, cell, event) {
        this.$emit('cell-mouse-enter', row.nodeData, this.findColumnByTableColumn(column), cell, event)
      },
      // 点击单元格
      cellClick (row, column, cell, event) {
        this.$emit('cell-click', row.nodeData, this.findColumnByTableColumn(column), cell, event)
      },
      // 单元格双击
      cellDblclick (row, column, cell, event) {
        this.$emit('cell-dblclick', row.nodeData, this.findColumnByTableColumn(column), cell, event)
      },
      // 行点击
      rowClick (row, event, column) {
        if (column) {
          this.$emit('row-click', row.nodeData, event, this.findColumnByTableColumn(column))
        }
      },
      // 行右击
      rowContextmenu (row, event) {
        this.$emit('row-contextmenu', row.nodeData, event)
      },
      // 行双击
      rowDblclick (row, event) {
        this.$emit('row-dblclick', row.nodeData, event)
      },
      // 头部点击
      headerClick (column, event) {
        this.$emit('header-click', this.findColumnByTableColumn(column), event)
      },
      // 排序变化
      sortChange (column, prop, order) {
        this.$emit('sort-change', this.findColumnByTableColumn(column), prop, order)
      },
      // 选中变化
      currentChange (currentRow, oldCurrentRow) {
        this.$emit('current-change',
          currentRow ? currentRow.nodeData : null,
          oldCurrentRow ? oldCurrentRow.nodeData : null)
      },
      getRowDataFromNodes (nodes) {
        const rows = []
        nodes.forEach(item => {
          rows.push(item.nodeData)
        })
        return rows
      },
      findColumnByTableColumn (column) {
        for (let item of this.leafColumn) {
          if (item.field === column.property) {
            return item
          }
        }
      },
      // 展开行
      expandRow (row) {
        const id = row[this.nodeOptions && this.nodeOptions.key || 'id']
        const node = this.findNodeById(id)
        if (!node.expand) {
          this.expandChange(node)
        }
      },
      // 收缩行
      colspanRow (row) {
        const id = row[this.nodeOptions && this.nodeOptions.key || 'id']
        const node = this.findNodeById(id)
        if (node.expand) {
          this.expandChange(node)
        }
      },
      // 删除行
      deleteRow (row) {
        const that = this
        delRow(this.tableOptions.data)
        this.updateData()
        function delRow (list) {
          for (var index = 0; index < list.length; index++) {
            const item = list[index]
            if (item === row) {
              list.splice(index, 1)
              return
            }
            const children = item[that.nodeOptions && that.nodeOptions.children || 'children']
            if (children && children.length > 0) {
              delRow(children)
              if (children.length === 0) {
                item[that.nodeOptions && that.nodeOptions.children || 'children'] = null
              }
            }
          }
        }
      },
      // 根据ID查找Node
      findNodeById (id) {
        return find(this.tableNodes)

        function find (list) {
          for (let item of list) {
            if (item.id === id) {
              return item
            } else {
              if (item.children && item.children.length > 0) {
                const result = find(item.children)
                if (result) {
                  return result
                }
              }
            }
          }
        }
      },
      validate () {
        return new Promise((resolve, reject) => {
          const contents = this.$refs.content
          if (contents && contents.length) {
            const promiseList = []
            contents.forEach(item => {
              promiseList.push(item.validate())
            })
            Promise.all(promiseList).then(() => {
              resolve()
            }).catch(err => {
              reject(err)
            })
          }
        })
      },
      reValidates () {
        return this.$refs.content
      },
      // 更新合并状态
      updateMergeState (state, rowIndex, columnIndex) {
        if (!this.mergeState[rowIndex]) {
          this.mergeState[rowIndex] = {}
        }
        this.mergeState[rowIndex][columnIndex] = state
      }
    }
  }
</script>
<style scoped>
.table-edit-input{
  width: 100%;
  height: 28px;
  line-height:28px;
  background-color: rgba(0,0,0,0);
  border: none;
  outline: medium;
}
</style>
