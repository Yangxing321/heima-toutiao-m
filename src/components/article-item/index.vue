<template>
  <van-cell class="article-item" :to="'/article/' + article.art_id">
    <!-- 最多显示两行并省略：van-multi-ellipsis--l2 -->
    <div slot="title" class="title van-multi-ellipsis--l2">{{ article.title }}</div>
    <div slot="label">
      <div v-if="article.cover.type === 3" class="cover-wrap">
        <div class="cover-item" v-for="(img, index) in article.cover.images" :key="index">
          <van-image class="cover-item-img" fit="cover" :src="img" />
        </div>
      </div>
      <!-- 作者 评论数量 发布时间：相对时间 -->
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <van-image v-if="article.cover.type === 1" slot="default" class="right-cover" fit="cover" :src="article.cover.images[0]" />
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {}
}
</script>

<style scoped lang="less">
.article-item {
  // align-items: flex-start;
  .title {
    font-size: 32px;
    color: #3a3a3a;
    text-align: left;
  }
  .van-cell__label {
    text-align: left;
  }
  // 右侧图片box
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  // 右侧图片
  .right-cover {
    width: 232px;
    height: 146px;
  }

  // 底部信息
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }

  .cover-wrap {
    display: flex;
    padding: 20px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
