<template>
  <div class="search-suggestion">
    <van-cell icon="search" v-for="(text,index) in suggestions" :key="index" @click="$emit('search', text)">
      <!-- 使用v-html指令可以绑定渲染带有html标签的字符串 -->
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>

  </div>
</template>

<script>
// 根据传来的searchText，实时获取联想建议
// 防抖优化：每个字符都会导致获取数据，需要优化
import { getSearchSuggestion } from '@/api/search.js'
// lodash 支持按需加载，有利于打包结果优化
import { debounce } from 'lodash'
// 搜索词高亮  // 如果想要全文替换，使用正则表达式 g 全局 i 忽略大小写
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [],
      htmlStr: 'Hello <span style="color: red">World</span>'
    }
  },
  computed: {},
  watch: {
    // 监视searchText的内容，实时变化
    searchText: {
      // handler函数名称是固定的,默认只有改变的时候才调用
      // 防抖 debounce 延迟200毫秒 返回防抖之后的函数
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
      // 要想一开始就立即调用 触发：
      immediate: true
    }
  },
  created () { },
  mounted () { },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestion(q)
        this.suggestions = data.data.options
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },
    highlight (text) {
      const hightlightStr = `<span class="highlight">${this.searchText}</span>`
      // 正则表达式 //中间的内容会被当做匹配字符来使用 而不是数据变量
      // 如果需要根据数据变量动态创建正则表达式 需要手动new RegExp 参数1是匹配模式字符串 创建正则对象； 参数2是匹配模式 要写在字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, hightlightStr)
    }
  }

}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.highlight {
    color: #3296fa;
  }
}
</style>
