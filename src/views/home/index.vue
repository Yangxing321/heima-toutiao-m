<template>
  <div class="home-container">
    <!-- 导航栏fixed固定定位 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button class="search-btn" slot="title" type="info" size="small" round icon="search" to="/search">搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 频道列表 -->
    <!--
      通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签
      通过 animated 属性可以开启切换标签内容时的转场动画
      通过 swipeable 属性可以开启滑动切换标签页
     -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!-- 频道的文章列表 -->
        <article-list :channel="channel" ref="article-list"></article-list>
        <!-- /频道的文章列表 -->
      </van-tab>
      <div class="placeholder" slot="nav-right"></div>
      <div class="hamburger-btn" slot="nav-right" @click="isEditChannelShow = true" style="cursor:pointer;">
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->
    <!-- 频道编辑 -->
    <van-popup class="edit-channel-popu9p" v-model="isEditChannelShow" position="bottom" :style="{ height: '100%' }" closeable close-icon-position="top-left">
      <channel-edit :user-channels="channels" :active="active" @update-active="onUpdateActive" />
    </van-popup>
    <!-- /频道编辑 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'HomePage',
  components: { ArticleList, ChannelEdit },
  props: {},
  data () {
    return {
      active: 0, // 控制被激活的标签项
      channels: [], // 频道列表
      isEditChannelShow: false // 这里我们先设置为 true 就能看到弹窗的页面了
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () { },
  methods: {
    async loadChannels () {
      try {
        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels()
          this.channels = data.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          //    有，拿来使用
          if (!localChannels || localChannels === undefined) {
            console.log('未登录,获取默认频道列表:')
            //    没有，请求获取默认频道列表
            const { data } = await getUserChannels()
            // TODO:在未登录时无法获取默认频道列表，调查接口
            this.channels = data.data.channels
            setItem('TOUTIAO_CHANNELS', this.channels)
          } else {
            this.channels = localChannels
            // console.log('未登录,localChannels:', localChannels)
          }
        }
      } catch (err) {
        this.$toast('获取用户频道失败')
      }
    },
    onUpdateActive (index, isEditChannelShow = true) {
      // 更新激活的频道项
      this.active = index

      // 关闭编辑频道弹层
      this.isEditChannelShow = isEditChannelShow
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px; // 固定定位调整上边距
  // 导航栏
  .page-nav-bar {
    background-color: #3296fa;
    .van-nav-bar__title {
      max-width: unset;
    }
    .van-nav-bar__title,
    .van-icon {
      color: #fff;
    }
    .search-btn {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      font-size: 28px;
      .van-icon {
        font-size: 32px;
      }
    }
  }
  // 频道列表
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      height: 82px;
      // 固定定位：
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3; // 右边框
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
  }
  .placeholder {
    flex-shrink: 0;
    width: 66px;
    height: 82px;
  }

  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.902;
    i.toutiao {
      font-size: 33px;
    }
    &:before {
      content: "";
      position: absolute;
      left: 0;
      width: 1px;
      height: 100%;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
  .edit-channel-popup {
    padding-top: 100px;
    box-sizing: border-box;
  }
}
</style>
