<template>
  <div class="Singer-box">
    <!-- 循环歌曲列表 -->
    <div
      class="Singer-item van-hairline--top"
      v-for="(item, index) in SingerList"
      :key="index"
      @click="gotoSinger(item.id)"
    >
      <van-image width="50" height="50" radius="5" :src="item.img1v1Url" />
      <div class="Singer-info">
        {{ item.name }}
        <span v-if="item.alias != ''">({{ item.alias[0] }})</span>
      </div>
    </div>
  </div>
</template>

<script>
import { List } from "vant";
export default {
  name: "SingerItem",
  props: {
    SingerList: List,
  },
  methods: {
    // 点击歌手列表，进入对应歌手详细内容页面
    gotoSinger(id) {
      this.$router.push({
        path: "/singer",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.Singer-box {
  background-color: white;
  padding: 5px 16px;
  font-size: 18px;
  .Singer-item {
    display: flex;
    align-items: center;
    padding: 5px 0;
    .Singer-info {
      padding: 0 10px;
      span {
        color: gray;
      }
    }
  }
}
</style>