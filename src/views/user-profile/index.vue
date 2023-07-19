<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()" />
    <!-- /导航栏 -->
    <!-- 上传文件  隐藏 手动出发 需要操作其dom  $refs.file.click() -->
    <input type="file" hidden ref="file" @change="onFileChange">
    <!-- 个人信息 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image :src="user.photo" class="avatar" fit="cover" round />
    </van-cell>
    <van-cell title="昵称" is-link :value="user.name" @click="isUpdateNameShow = true" />
    <van-cell title="性别" is-link :value="user.gender === 0 ? '男' : '女'" @click="isUpdateGenderShow = true" />
    <van-cell title="生日" is-link :value="user.birthday" @click="isUpdateBirthdayShow = true" />
    <!-- 个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup v-model="isUpdateNameShow" style="height: 100%;" position="bottom">
      <UpdateName v-if="isUpdateNameShow" v-model="user.name" @close="isUpdateNameShow = false" />
    </van-popup>
    <!-- /编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <UpdateGender v-if="isUpdateGenderShow" v-model="user.gender" @close="isUpdateGenderShow = false" />
    </van-popup>
    <!-- /编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <UpdateBirthday v-if="isUpdateBirthdayShow" v-model="user.birthday" @close="isUpdateBirthdayShow = false" />
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup v-model="isUpdatePhotoShow" style="height:100%;" position="bottom">
      <UpdatePhoto @update-photo="user.photo=$event" :img="img" v-if="isUpdatePhotoShow" @close="isUpdatePhotoShow = false" />
    </van-popup>
    <!-- /编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/UpdateName.vue'
import UpdateGender from './components/UpdateGender.vue'
import UpdateBirthday from './components/UpdateBirthday.vue'
import UpdatePhoto from './components/UpdatePhoto.vue'
export default {
  components: { UpdateName, UpdateGender, UpdateBirthday, UpdatePhoto },
  data () {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: ''
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (error) {
        this.$toast('获取失败')
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取blob数据
      this.img = window.URL.createObjectURL(file)
      this.isUpdatePhotoShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile {
  .van-cell {
    align-items: center;
  }
  .van-cell__title {
    padding-left: 30px;
    text-align: left;
  }
  .avatar {
    width: 60px;
    height: 60px;
  }

  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
