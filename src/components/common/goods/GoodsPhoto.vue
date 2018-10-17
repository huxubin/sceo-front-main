<template>
  <div id="goods-photo">
    <div @click="previewPhoto" v-if="urlStart" class="bgurl" :style="bacStyle">
      <!--<img :src="urlStart" style="width:100%;vertical-align: middle;">-->
    </div>
    <el-dialog :visible.sync="pictureDialogVisible" append-to-body width="60%" title="物品图片">
      <div style="height:460px;overflow: auto;">
        <span v-for="(item, index) in urlList" @click="showPreviewVisible(index)" :key="index">
          <img :src="item.gods_doc_url" alt="" style="width:146px;height:auto;margin-right:10px;border-radius:5px;" class="imgStyle">
        </span>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="previewVisible" append-to-body title="物品图片" style="text-align:center">
      <el-carousel arrow="always" :initial-index="imageUrlIndex" :autoplay="false" v-if="previewVisible">
        <el-carousel-item v-for="(item, index) in urlList" :key="index">
          <div :style="{height: '100%', width: 'auto',  background: 'url(' + item.gods_doc_url + ') no-repeat center center',
          'background-size': 'auto 100%'}"></div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    name: 'goodsPhoto',
    props: {
      urlInit: {
        type: String,
        default: ''
      },
      goodsId: {
        type: String,
        default: ''
      },
      mergeNumber: Number
    },
    data () {
      return {
        pictureDialogVisible: false,
        previewVisible: false,
        imageUrlIndex: 0,
        urlList: [],
        urlStart: ''
      }
    },
    created () {
      if (this.urlInit) {
        this.urlStart = this.urlInit
      }
      // if (this.goodsId && !this.urlInit) {
      //   this.queryPhotoList()
      // }
    },
    computed: {
      bacStyle () {
        let sty = {
          backgroundImage: 'url(' + this.urlStart + ') ',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'auto 100%',
          height: this.mergeNumber ? (this.mergeNumber * 36 - 4) + 'px' : '32px',
          width: '100%',
          margin: '2px 0'
        }
        return sty
      }
    },
    watch: {
      // goodsId: function (val) {
      //   if (val && !this.urlInit) {
      //     this.queryPhotoList()
      //   }
      // },
      urlInit: function (val) {
        this.urlStart = val || ''
      }
    },
    methods: {
      queryPhotoList () {
        this.UTILS.execUtil('goods', 'getAllImgById', {id: this.goodsId}).then(data => {
          this.urlList = data
          if (!this.urlInit && data[0] && data[0].gods_doc_url) {
            this.urlStart = data[0].gods_doc_url
          }
        })
      },
      previewPhoto () {
        this.pictureDialogVisible = true
        this.queryPhotoList()
      },
      showPreviewVisible (index) {
        this.imageUrlIndex = index
        this.previewVisible = true
      }
    }
  }
</script>
<style scoped>
  /*.bgurl{*/
    /*height:100%;*/
    /*width:100%;*/
    /*height: 36px;*/
    /*background-image:`${urlStart}`;*/
  /*}*/
</style>
