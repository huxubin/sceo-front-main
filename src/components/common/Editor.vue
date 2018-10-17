<template>
  <div>
    <div v-show="editable" ref="editor"></div>
    <div v-if="!editable"  class="w-e-text-container" :style="viewStyle">
      <div class="w-e-text" style="overflow-y:auto" v-html="editorContent"></div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import E from 'wangeditor'

  export default {
    props: {
      // 初始内容
      content: String,
      // 是否可编辑
      editable: {
        type: Boolean,
        default: true
      },
      // 编辑器高度
      height: {
        type: Number,
        default: 300
      }
    },
    data () {
      return {
        editor: null,
        editorContent: ''
      }
    },
    computed: {
      viewStyle () {
        return {
          height: this.height + 28 + 'px',
          overflow: 'auto'
        }
      }
    },
    watch: {
      height (value) {
        this.$refs.editor.querySelector('.w-e-text-container').style.height = value + 'px'
      }
    },
    created () {
      if (this.content) {
        this.loadContent()
      }
    },
    mounted () {
      this.editor = new E(this.$refs.editor)
      this.editor.customConfig.uploadImgShowBase64 = true
      this.editor.customConfig.onchange = (html) => {
        this.editorContent = html
      }
      this.editor.create()
      this.$refs.editor.querySelector('.w-e-text-container').style.height = this.height + 'px'
    },
    methods: {
      loadContent () {
        axios.create().get(this.CONFIG.ngixHost + this.content).then(data => {
          this.editorContent = data.data
          this.editor.txt.html(data.data)
        })
      },
      upload () {
        return new Promise((resolve, reject) => {
          if (this.editorContent.trim() && this.editorContent !== '<p><br></p>') {
            let params = new FormData()
            const blob = new Blob([this.editorContent], {type: 'text/plain'})
            params.append('className', 'people')
            params.append('methodName', 'uploadFile')
            params.append('paramObj', '')
            params.append('file', blob)
            axios.create().post(`${this.UTILS.getConfig('execHost')}4Upload`, params, {
              headers: {'Content-Type': 'multipart/form-data'}
            }).then(data => {
              resolve(data.data)
            }).catch(err => {
              reject(err)
            })
          } else {
            this.$message.error('请填写文档内容')
            reject()
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  
</style>