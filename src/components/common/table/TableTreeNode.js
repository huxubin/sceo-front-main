class TableTreeNode {
  constructor ({nodeData, nodeOptions, level, parentNode, isExpand, index}) {
    // 节点数据
    this.nodeData = nodeData
    // 下级节点属性名
    this.childrenField = nodeOptions && nodeOptions.children || 'children'
    // 节点唯一标志
    this.id = this.nodeData[nodeOptions && nodeOptions.key ? nodeOptions.key : 'id']
    // 节点层级
    this.level = level
    // 展开状态，根据函数判断
    if (typeof isExpand === 'boolean') {
      this.expand = isExpand
    } else if (typeof isExpand === 'function') {
      const expand = isExpand(this)
      if (typeof expand === 'boolean') {
        this.expand = expand
      } else {
        this.expand = true
      }
    } else {
      this.expand = true
    }
    // 父节点
    this.parentNode = parentNode
    // 子节点, 默认为空
    this.children = null
    // 是否是叶子节点
    this.isLeaf = false
    // 子节点数据加载状态
    this.loaded = true
    // 正在加载中
    this.loading = false
    // 当前序号
    if (!this.parentNode) {
      this.index = index + ''
    } else {
      this.index = `${this.parentNode.index}.${index}`
    }
    this.nodeOptions = nodeOptions
    this.isExpand = isExpand
    // 执行数据初始化操作
    this.init()
  }

  init () {
    // 展开父节点
    let _parentNode = this.parentNode
    while (_parentNode && this.expand) {
      _parentNode.expand = true
      _parentNode = _parentNode.parentNode
    }
    const children = this.nodeData[this.childrenField]
    if (children && children instanceof Array) {
      this.children = []
      if (children.length === 0) {
        // 子节点为空，未加载数据
        this.loaded = false
        this.expand = false
      } else {
        // 初始化子节点
        children.forEach((item, index) => {
          this.children.push(new TableTreeNode({
            nodeData: item,
            nodeOptions: this.nodeOptions,
            level: this.level + 1,
            parentNode: this,
            isExpand: this.isExpand,
            index: index + 1
          }))
        })
      }
    } else {
      // 是叶子节点
      this.isLeaf = true
    }
  }

  update (data, index) {
    // 更新列表数据
    this.nodeData = data
    // 更新序号
    if (!this.parentNode) {
      this.index = index + ''
    } else {
      this.index = `${this.parentNode.index}.${index}`
    }
    // 更新下级
    const childrenField = this.nodeOptions && this.nodeOptions.children || 'children'
    const key = this.nodeOptions && this.nodeOptions.key || 'id'
    if (data[childrenField] && data[childrenField].length > 0) {
      // 先展开节点
      this.loaded = true
      this.isLeaf = false
      // 找出需要删除的节点
      if (this.children && this.children.length > 0) {
        for (let index = 0; index < this.children.length; index++) {
          const item = this.children[index]
          let flag = true
          for (let dataItem of data[childrenField]) {
            if (dataItem[this.nodeOptions.key || 'id'] === item.id) {
              flag = false
              break
            }
          }
          if (flag) {
            // 删除节点数据
            this.children.splice(index--, 1)
          }
        }
      }
      // 按顺序更新或者插入节点
      data[childrenField].forEach((dataItem, index) => {
        let flag = true
        if (this.children && this.children.length > 0) {
          for (let j = 0; j < this.children.length; j++) {
            const node = this.children[j]
            if (node.id === dataItem[key]) {
              // 节点插入到新的位置
              this.children.splice(index, 0, node)
              // 删除原位置上的数据
              if (j >= index) {
                this.children.splice(j + 1, 1)
              } else {
                this.children.splice(j, 1)
              }
              // 更新节点
              node.update(dataItem, index + 1)
              flag = false
              break
            }
          }
        }
        if (flag) {
          // 新增节点
          const node = new TableTreeNode({
            parentNode: this,
            nodeData: dataItem,
            nodeOptions: this.nodeOptions,
            level: this.level + 1,
            index: index + 1,
            isExpand: this.isExpand
          })
          if (!this.children) {
            this.children = []
          }
          this.children.splice(index, 0, node)
        }
      })
    } else {
      if (data[childrenField]) {
        this.loaded = false
        this.isLeaf = false
        this.expand = false
      } else {
        this.loaded = true
        this.children = null
        this.isLeaf = true
      }
    }
  }

  updateIndex (index) {
    if (!this.parentNode) {
      this.index = index + ''
    } else {
      this.index = `${this.parentNode.index}.${index}`
    }
  }

  appendChild (data) {
    if (this.loaded) return
    if (data && data.length > 0) {
      this.isLeaf = true
      this.nodeData[this.nodeOptions && this.nodeOptions.children || 'children'] = data
    } else {
      this.nodeData[this.nodeOptions && this.nodeOptions.children || 'children'] = null
    }
    this.loaded = true
    this.loading = false
  }
}

export default TableTreeNode
