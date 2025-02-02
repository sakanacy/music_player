<template>
  <div>
    <!-- 背景图片 -->
    <img :src="musicList.al.picUrl" alt="" class="bgimg" />
    <!-- 顶部标题栏 -->
    <van-nav-bar @click-left="updateplayerShow">
      <div slot="left">
        <van-icon name="arrow-down" size="25px" />
      </div>
    </van-nav-bar>
    <!-- 显示歌曲名、歌手名 -->
    <div class="music-box">
      <div class="music-title">
        <p>{{ musicList.name }}</p>
        <span>{{ musicList.ar[0].name }}</span>
      </div>
      <div class="music-content">
        <!-- 歌曲图片 -->
        <van-image
          class="music-img"
          v-if="imgShow"
          width="250"
          height="250"
          :src="musicList.al.picUrl"
          radius="5"
          @click="isImgShow"
        />
        <!-- 歌词，和歌曲图片互斥显示-->
        <div class="music-lyric" @click="isImgShow" v-else ref="musicLrc">
          <!-- 循环显示歌词，当前播放文字高亮显示 -->
          <p
            v-for="(item, index) in lyricList"
            :key="index"
            :class="{
              active:
                playercurrentTime * 1000 >= item.time &&
                playercurrentTime * 1000 < item.pre,
            }"
          >
            {{ item.lrc }}
          </p>
        </div>
      </div>
    </div>
    <!-- 底部部件 -->
    <div class="music-bottom">
      <!-- 进度条 -->
      <div class="music-range-box">
        <input
          type="range"
          class="music-range"
          min="0"
          :max="musicduration"
          v-model="playercurrentTime"
          step="0.02"
        />
      </div>
      <!-- 播放等按钮 -->
      <van-row type="flex" justify="center" align="center">
        <van-col span="7">
          <van-icon
            @click="playLastSong"
            :name="require('@/assets/icon/左播放.png')"
            size="25px"
          />
        </van-col>
        <van-col span="7">
          <div @click="songPlay">
            <van-icon
              :name="require('@/assets/icon/暂停.png')"
              v-if="isPlay"
              size="35px"
            />
            <van-icon
              :name="require('@/assets/icon/播放.png')"
              v-else
              size="35px"
            />
          </div>
        </van-col>
        <van-col span="7">
          <van-icon
            @click="playNextSong"
            :name="require('@/assets/icon/右播放.png')"
            size="25px"
          />
        </van-col>
      </van-row>
    </div>
    <div></div>
  </div>
</template>

<script>
import { getLyricByIdAPI } from "@/api/index";
import { List } from "vant";
import { mapMutations, mapState } from "vuex";
export default {
  name: "MusicPlayer",
  props: {
    musicList: List,
    songPlay: Function,
    updateTime: Function,
  },
  data() {
    return {
      imgShow: true,
      lyricItem: "",
    };
  },
  computed: {
    ...mapState([
      "isPlay",
      "playListIndex",
      "playList",
      "playercurrentTime",
      "musicduration",
    ]),
    // 歌词列表
    lyricList() {
      let lyric;
      if (this.lyricItem) {
        lyric = this.lyricItem.split(/[\r\n\r\n]+/).map((item, i) => {
          let min = item.slice(1, 3);
          let sec = item.slice(4, 6);
          let mill = item.slice(7, 10);
          let lrc = item.slice(11, item.length);
          let time =
            parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(mill);
          if (isNaN(Number(mill))) {
            mill = item.slice(7, 9);
            lrc = item.slice(10, item.length);
            time =
              parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(mill);
          }
          return { min, sec, mill, lrc, time };
        });
      }
      lyric.forEach((item, i) => {
        if (i === lyric.length - 1 || isNaN(lyric[i + 1].time)) {
          item.pre = 100000;
        } else {
          item.pre = lyric[i + 1].time;
        }
      });
      return lyric;
    },
  },
  methods: {
    ...mapMutations(["updateplayerShow", "updateplayListIndex"]),
    isImgShow() {
      this.imgShow = !this.imgShow;
    },
    // 接口获取歌词
    async getLyricById(id) {
      let res = await getLyricByIdAPI(id);
      this.lyricItem = res.data.lrc.lyric;
      // 测试是否获取到歌词
      // console.log(this.lyricItem);
    },
    // 播放下一首
    playNextSong() {
      if (this.playListIndex == this.playList.length - 1) {
        this.updateplayListIndex(0);
      } else {
        this.updateplayListIndex(this.playListIndex + 1);
      }
    },
    // 播放上一首
    playLastSong() {
      if (this.playListIndex == 0) {
        this.updateplayListIndex(this.playList.length - 1);
      } else {
        this.updateplayListIndex(this.playListIndex - 1);
      }
    },
  },
  mounted() {
    this.getLyricById(this.musicList.id);
  },
  watch: {
    // 当前播放歌曲改变，重新获取歌词
    musicList(val) {
      this.getLyricById(val.id);
    },
    // 歌词滚动效果实现
    playercurrentTime() {
      let p = document.querySelector("p.active");
      // 测试获取到的p标签
      // console.log([p]);
      if (!this.imgShow) {
        if (p != null && p.offsetTop >= 300) {
          this.$refs.musicLrc.scrollTop = p.offsetTop - 300;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.van-hairline--bottom::after {
  border: none;
}
.bgimg {
  width: 100%;
  min-height: 100vh;
  position: fixed;
  z-index: -1;
  filter: blur(30px);
}
.music-box {
  text-align: center;
  .music-title {
    p {
      margin: 0;
      padding: 0;
      color: white;
      font-size: 25px;
      font-weight: bold;
    }
    span {
      color: rgb(250, 250, 250);
      font-size: 15px;
    }
  }
  .music-content {
    height: 400px;
    margin: 25px 0;
    .music-img {
      margin: 60px 0;
      border: 0.3px solid rgba(190, 187, 187, 0.432);
      box-shadow: 2px 2px 3px rgba(192, 191, 191, 0.5);
    }
    .music-lyric {
      width: 100%;
      height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: scroll;
      p {
        margin: 10px 0;
        padding: 0;
        font-size: 15px;
        color: rgb(223, 223, 223);
      }
      .active {
        color: white;
        font-size: 18px;
      }
    }
  }
}
.music-bottom {
  position: absolute;
  height: 90px;
  width: 100%;
  bottom: 0;
  margin: 10px 0;
  text-align: center;
  .music-range-box {
    padding: 10px 0;
    .music-range {
      padding: 0;
      margin: 0;
      width: 100%;
      height: 3px;
    }
  }
}
</style>