<template>
  <div class="update-photo">
    <img class="img" ref="imgRef" :src="img" alt="">
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import { updateUserPhoto } from '@/api/user'
// 图片裁切：2种方式 后端做裁切 前端做裁切
// cropper.js裁切库:
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
    this.cropImage()
  },
  methods: {
    cropImage () {
      this.cropper = new Cropper(this.$refs.imgRef, {
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1,
        autoCropArea: 1,
        cropBoxMovable: false,
        cropBoxResizable: false,
        background: false,
        movable: true
      })
    },
    onConfirm () {
      // this.cropper.getData() // 若是服务端 获取裁切x y width height信息
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto (blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        // console.log(blob)
        // 如果 Content-Type 要求是application/json，则 data 传普通对象 {}
        // 如果 Content-Type 要求是multipart/form-data，则 data 传 FormData 对象
        // 纵观所有数据接口，你会发现大多数的接口都要求 Content-Type 要求是application/json
        // eslint-disable-next-line no-tabs
        // 一般只有涉及到文件上传的数据接口才要求Content-Type 要求是	multipart/form-data
        // 这个时候传递一个 FormData 对象
        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updateUserPhoto(formData)
        this.$emit('close')
        // 更新视图
        this.$emit('update-photo', data.data.photo)
        // 提示成功
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .img {
    display: block;
    max-width: 100%;
  }
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      text-align: center;
      line-height: 90px;
      font-size: 30px;
      color: #fff;
    }
  }
}
</style>
