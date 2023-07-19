<template>
  <van-cell class="comment-item">
    <van-image slot="icon" class="avatar" round fit="cover" :src="commentItem.aut_photo" />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{commentItem.aut_name}}</div>
      <van-button class="like-btn" :class="{
          liked: commentItem.is_liking
        }" :icon="commentItem.is_liking ? 'good-job' : 'good-job-o'" :loading="commentLoading" @click="onCommentLike()">{{commentItem.like_count || '赞'}}</van-button>
    </div>

    <div slot="label">
      <p class="comment-content">{{commentItem.content}}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{commentItem.pubdate | relativeTime}}</span>
        <!-- 点击回复时弹出父组件index的弹窗 -->
        <van-button class="reply-btn" round @click="$emit('reply-click',commentItem)">回复 {{commentItem.reply_count}}</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  name: 'CommentItem',
  components: {},
  props: {
    commentItem: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      commentLoading: false
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onCommentLike () {
      // 点赞：loading 接口改变if else；点赞的数量+-；样式改变
      this.commentLoading = true
      try {
        if (this.commentItem.is_liking) {
          // 已赞
          await deleteCommentLike(this.commentItem.com_id)
          this.commentItem.like_count--
        } else {
          // 未赞
          await addCommentLike(this.commentItem.com_id)
          this.commentItem.like_count++
        }
        this.commentItem.is_liking = !this.commentItem.is_liking
      } catch (error) {
        this.$toast('操作失败')
      }
      this.commentLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    // width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
    &.liked {
      color: #e5645f;
    }
  }
}
</style>
