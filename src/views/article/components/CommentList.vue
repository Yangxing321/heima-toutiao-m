<template>
  <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error" error-text="加载失败，请点击重试" :immediate-check="false">
    <CommentItemVue @reply-click="$emit('reply-click', $event)" v-for="(item,index) in list" :key="index" :commentItem="item" />
  </van-list>
</template>

<script>
import { getComment } from '@/api/comment'
import CommentItemVue from './CommentItem.vue'
export default {
  name: 'CommentList',
  components: { CommentItemVue },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义prop数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10,
      error: false
    }
  },
  created () {
    // 当你手动初始onload时，它不会自动开始初始的loading，所以要手动开启初始loading
    this.loading = true
    this.onLoad() // 不在created中加载的话 滑动到可视区域才会加载
  },
  mounted () { },
  methods: {
    async onLoad () {
      // 请求获取数据 将数据添加列表 将loading设置为false 判断是否还有数据
      try {
        // 获取文章的评论和获取评论的回复是同一个接口
        // 唯一的区别是接口参数不一样
        //    type
        //      a 文章的评论
        //      c 评论的回复
        //    source
        //      文章的评论，则传递文章的 ID
        //      评论的回复，则传递评论的 ID

        const { data } = await getComment({
          type: this.type, // 评论类型
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 评论数据的偏移量
          limit: this.limit
        })
        const { results } = data.data
        this.list.push(...results)
        console.log(data.data)
        // 把文章评论总量传递到外部
        this.$emit('onload-success', data.data)
        this.loading = false
        if (results.length) {
          this.offset = data.data.lase_id
        } else {
          this.finished = true
        }
      } catch (error) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
