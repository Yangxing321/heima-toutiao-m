<template>
  <van-button v-if="value" class="follow-btn" round size="small" @click="onFollow" :loading="followLoading">已关注</van-button>
  <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" @click="onFollow" :loading="followLoading">关注</van-button>
</template>

<script>
// template下只能有一个根节点：v-if v-else 只会渲染一个
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  props: {
    // 使用props解耦路由参数
    value: {
      type: Boolean,
      required: true
    },
    userID: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      followLoading: false
    }
  },
  methods: {
    // 关注、取消关注
    async onFollow () {
      // 建议所有关于网络请求相关的 都添加loading反馈 数据请求期间禁用按钮 防止一开始没反应 用户继续点
      this.followLoading = true // 展示关注按钮的loading状态
      try {
        if (this.value) {
          // 已关注
          console.log('取消关注', this.userID)
          await deleteFollow(this.userID)
        } else {
          // 未关注
          console.log('关注', this.userID)
          await addFollow(this.userID)
        }
        this.$emit('input', !this.value)
        // this.value = !this.value
      } catch (error) {
        let message = '操作失败'
        if (error.response && error.response.status === 400) {
          message = '你不能关注自己'
        }
        this.$toast(message)
      }
      this.followLoading = false // 关闭关注按钮的loading状态
    }
  }
}
</script>

<style lang="less" scoped>
</style>
