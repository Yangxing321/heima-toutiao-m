<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form class="search-form" action="/">
      <van-search background="#3296fa" v-model="searchText" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" @focus="isResultShow = false"></van-search>
    </form>

    <!-- 搜索结果 -->
    <search-result :searchText="searchText" v-if="isResultShow" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <!-- 输入内容时加载联想建议数据；将请求结果绑定到模板,实时变化 -->
    <search-suggestion :searchText="searchText" @search="onSearch" v-else-if="searchText" />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history :searchHistories="searchHistories" v-else @search="onSearch" />
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
// TODO:历史记录、联想建议、搜索结果
import SearchHistory from './components/searchHistory'
import SearchSuggestion from './components/searchSuggestion'
import SearchResult from './components/searchResult'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'SearchPage',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '',
      searchHistories: getItem('serach-histories') || [],
      isResultShow: false // 控制搜索结果的显示状态
    }
  },
  computed: {},
  watch: {
    searchHistories (val) {
      // 同步到本地存储
      setItem('serach-histories', val)
    }
  },
  created () { },
  mounted () { },
  methods: {
    onSearch (val) {
      // 更新文本框内容
      this.searchText = val

      // 存储搜索历史记录
      // 要求：不要有重复数据 最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)

      // 展示搜索结果
      this.isResultShow = true
    },
    onCancel () {
      // 点击取消 回到首页
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
