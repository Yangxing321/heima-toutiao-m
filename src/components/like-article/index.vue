<template>
  <van-icon :class="{liked: value === 1}" :icon="value === 1?'like':'like-o'" name="like-o" @click="onCollect()" :loading="loading" />
</template>

<script>
// 文章点赞
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  mounted () {
  },
  methods: {
    async onCollect () {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          // 已点赞，取消点赞
          await deleteLike(this.articleId)
        } else {
          await addLike(this.articleId)
          status = 1
        }
        // 更新视图
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (error) {
        this.$toast.fail('操作失败')
      }
      this.loading = false
    }
  }

}
</script>

<style lang="less" scoped>
.liked {
  color: #e5645f;
}
</style>
