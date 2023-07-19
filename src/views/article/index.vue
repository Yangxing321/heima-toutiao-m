<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="文章详情" @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate | relativeTime}}</div>
          <!-- 模板中的$event是事件参数
                当我们传递给子组件的数据既要使用 又要修改时
                传递：props  修改：自定义事件
                :isFollowed="article.is_followed"
                @update-is_followed="article.is_followed=$event"
                简写方式：在组件上使用v-model  默认是value input
                给子组件传递value=“article.is_followed”  @input=“article.is_followed=$event”
                ## 如果需要修改v-model的规则名称 可以通过子组件的model属性来配置 model:{prop:'', event:''}
                如果有多个数据实现v-model效果，可以使用.sync修饰符
                -->
          <FollowUser class="follow-btn" v-model="article.is_followed" :userID="article.aut_id"></FollowUser>
          <!-- <van-button v-if="article.is_followed" class="follow-btn" round size="small" @click="onFollow" :loading="followLoading">已关注</van-button>
          <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" @click="onFollow" :loading="followLoading">关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <CommentList @reply-click="onReplyClick" :list="commentList" :source="article.art_id" @onload-success="totalCommentCount=$event.total_count" />

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small" @click="isPostShow = true">写评论</van-button>
          <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
          <CollectArticle :articleId="article.art_id" v-model="article.is_collected"></CollectArticle>
          <!-- <van-icon color="#777" name="star-o" /> -->
          <LikeArticle :articleId="article.art_id" v-model="article.attitude" />
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论 -->
        <van-popup v-model="isPostShow" position="bottom">
          <CommentPost :target="article.art_id" @post-success="onPostSuccess" />
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle()">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复 -->
    <!-- 弹出层是懒渲染，只有在第一次展示的时候才会渲染内容 之后的关闭和显示都是对原有数据的显示和隐藏。即点击其他评论也是原有的回复，并没有销毁内容，在内容上加一个v-if可以解决 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height:100%;">
      <CommentReply v-if="isReplyShow" :comment="currentComment" @close="isReplyShow = false" />
    </van-popup>
    <!-- 评论回复 -->
  </div>
</template>

<script>
// 1.处理内容加载状态： 加载中loading，加载成功显示详情，加载失败显示错误提示
// 2.github-markdown-css 正文样式：复制css文件、引入、排除postcss配置
// 3.图片点击预览：vant中的imagePreview组件 思路：获取所有的img dom节点 、获取文章内容所有的图片地址、遍历img节点 注册点击事件、调用imagepreview预览
// 关注作者功能 显示v-if else  关注取消数据接口 不能关注自己 loading效果
// 关注功能需要在多个页面复用 封装成组件
// 收藏文章功能
// 评论列表封装组件
// TODO:返回文章列表时 不是回到原来的浏览位置？
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/CommentList.vue'
import CommentPost from './components/CommentPost.vue'
import CommentReply from './components/CommentReply'
export default {
  name: 'ArticleIndex',
  components: { FollowUser, CollectArticle, LikeArticle, CommentList, CommentPost, CommentReply },
  // 依赖注入：父组件将数据提供给所有的后代组件
  // 注意：不要滥用，简单的父传子还是用props
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    // 使用props解耦路由参数
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      loading: true, // 加载中
      errStatus: 0,
      article: {}, // 文章详情
      totalCommentCount: 0, // 评论总数
      isPostShow: false, // 评论弹层
      commentList: [], // 评论列表
      isReplyShow: false, // 评论回复弹层
      currentComment: {}
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () { },
  methods: {
    async loadArticle () {
      try {
        const { data } = await getArticleById(this.articleId)
        // 直接传参articleId会显示404，需要json-bigint包解决
        this.article = data.data
        // 初始化图片点击预览
        // 数据驱动视图 不是立即的,所以需要一个延时
        setTimeout(() => {
          // console.log(this.$refs['article-content'])
          this.previewImage()
        }, 0)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errStatus = 404
        }
        this.$toast('文章获取失败')
      }
      this.loading = false
    },
    // 图片预览
    previewImage () {
      // 图片不显示需要挂vpn是网络原因
      // 得到所有的image节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // 获取所有的img地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每个img注册点击事件 在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            images, // 预览的图片数组
            // 起始位置 从0开始
            startPosition: index
          })
        }
      })
    },
    // 评论发布成功调用
    onPostSuccess (data) {
      // 关闭弹出层
      // 将发布内容显示倒列表顶部
      this.isPostShow = false
      this.commentList.unshift(data.new_obj)
      this.totalCommentCount++
    },
    onReplyClick (comment) {
      this.currentComment = comment
      console.log(comment.content)
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css"; // 不需要postcss转换字号
/deep/ .page-nav-bar {
  background-color: #3296fa;
  .van-nav-bar__title {
    max-width: unset;
  }
  .van-nav-bar__title {
    color: #fff !important;
  }
  .van-nav-bar__content .van-icon {
    color: #fff !important;
  }
}

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    text-align: left;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
      text-align: center;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 25px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
