<template>
  <van-icon :class="{collected: value}" :icon="value?'star':'star-o'" name="star-o" @click="onCollect()" :loading="loading" />
</template>

<script>
// 文章收藏
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Boolean,
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
  methods: {
    async onCollect () {
      this.loading = true
      try {
        if (this.value) {
          await deleteCollect(this.articleId)
        } else {
          await addCollect(this.articleId)
        }
        // 更新视图
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (error) {
        this.$toast.fail('操作失败')
      }
      this.loading = false
    }
  }

}
</script>

<style lang="less" scoped>
.collected {
  color: yellow;
}
</style>
