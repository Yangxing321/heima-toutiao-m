<template>
  <div class="post-comment">
    <!-- .trim可·以自动把首尾空格去掉 -->
    <van-field class="post-field" v-model.trim="message" rows="2" autosize type="textarea" maxlength="50" placeholder="优质评论将会被优先展示" show-word-limit />
    <!-- // 内容为空时禁用按钮 -->
    <van-button :disabled="!message.length" class="post-btn" size="small" @click="onPostComment()">发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'PostComment',
  components: {},
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onPostComment () {
      this.$toast.loading({
        message: '发布中',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await addComment({
          target: this.target, // 评论目标id
          content: this.message, // 评论内容
          art_id: this.articleId ? this.articleId.toString() : this.articleId // 对文章进行评论不需要赋值
        })
        // 关闭弹出层
        // 将发布内容显示倒列表顶部
        // 清空文本框
        this.message = ''
        this.$emit('post-success', data.data) // 子传父
        this.$toast.success('发布成功')
      } catch (error) {
        this.$toast.fail('发布失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.post-comment {
  display: flex;
  padding: 15px;
  align-items: flex-end;
  .post-field {
    background: #f5f7f9;
    margin-right: 15px;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
