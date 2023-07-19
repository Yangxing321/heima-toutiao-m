<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <template v-if="isDeleteShow">
        <span @click="searchHistories = []">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </template>
      <van-icon v-else name="delete" @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell v-for="(item,index) in searchHistories" :key="index" :title="item" @click="onHistoryClick(item, index)">
      <van-icon v-show="isDeleteShow" name="close" @click="searchHistories.splice(index, 1)"></van-icon>
    </van-cell>
  </div>
</template>

<script>
// 在发生搜索的时候记录历史记录
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 控制删除相关元素的显示状态
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    onHistoryClick (item, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
      } else {
        // 否则执行搜索操作
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
