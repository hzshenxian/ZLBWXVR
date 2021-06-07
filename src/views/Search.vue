<template>
  <div class="pageMain">
    <audio :src="Detail.audio" ref="audio" v-if="audioShow"></audio>
    <transition>
      <loading v-if="pageLoading" />
    </transition>
    <div class="searchBox">
      <!-- <div class="back" @click="back">
        <van-icon name="arrow-left" />
      </div> -->
      <div class="searchR">
        <form action="/">
          <van-search
            v-model="searchVal"
            show-action
            placeholder="请输入搜索关键词"
            @search="onSearch"
            @input="onChange"
          >
            <template #action>
              <div @click="onSearch">搜索</div>
            </template>
          </van-search>
        </form>
      </div>
    </div>
    <div class="searchRes">
      <ul v-if="hasResult">
        <li
          v-for="(item, index) in searchResults"
          :key="index"
          @click="showDetail(item)"
        >
          <h2>{{ item.title }}</h2>
        </li>
      </ul>
      <div class="empty" v-else>
        <van-empty description="暂无相关内容" />
      </div>
    </div>

    <!-- 详情弹窗 -->
    <van-popup
      v-model="PopShow"
      position="bottom"
      :style="{ height: '90%' }"
      round
      @close="PopHide"
    >
      <div class="popClose" @click="closePop">
        <img src="@/assets/images/close.png" alt />
      </div>
      <div class="popIntro">
        <div class="imgBox">
          <div
            class="intrImg"
            :style="{ backgroundImage: 'url(' + Detail.image + ')' }"
          ></div>
          <div class="cover"></div>
          <div class="intrAudio" v-if="Detail.audio">
            <h2>语音简介</h2>
            <div class="audio">
              <div class="playBox">
                <div class="play" v-show="!playing" @click="audioPlay"></div>
                <div class="pause" v-show="playing" @click="audioPause"></div>
              </div>
              <div class="audioTime">
                <span v-show="currentTime.hours !== '00'"
                  >{{ currentTime.hours }}:</span
                ><span>{{ currentTime.minutes }}:</span
                ><span>{{ currentTime.seconds }}</span> /
                <span v-show="durationTime.hours !== '00'"
                  >{{ durationTime.hours }}:</span
                ><span>{{ durationTime.minutes }}:</span
                ><span>{{ durationTime.seconds }}</span>
              </div>
              <div class="audioProcess">
                <div class="proceB">
                  <div class="paroline"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="intrTitle">
          <h2>{{ Detail.title }}</h2>
          <div>
            <div class="address">
              <span>{{ Detail.local_name }}</span>
            </div>
            <div class="BtnBox">
              <span class="navgate" @click="openLocation">
                <i>
                  <img src="@/assets/images/navgate.png" alt />
                </i>
                <span>导航</span>
              </span>
              <span class="navgateVr" @click="toVr">
                <i>
                  <img src="@/assets/images/pano.png" alt />
                </i>
                <span>全景</span>
              </span>
            </div>
          </div>
        </div>
        <div class="detailTxt" v-html="Detail.detail"></div>
      </div>
    </van-popup>
    <!-- 详情弹窗end -->
  </div>
</template>

<script>
import { getData } from "../request/api"
import { Toast } from "vant"
import { ZWJSOpenLocation } from "../utils/zwjsbridge"
export default {
  data() {
    return {
      pageLoading: true,
      PopShow: false,
      hasResult: true,
      playing: false,
      searchVal: "",
      Lists: [],
      searchResults: [],
      Detail: {},
      currentTime: {
        hours: "00",
        minutes: "00",
        seconds: "00",
      },
      durationTime: {
        hours: "00",
        minutes: "00",
        seconds: "00",
      },
      audioList: [],
      audioShow: false,
    }
  },
  created() {
    this.getApiData()
  },
  methods: {
    //秒转换
    formatSecond(second) {
      const days = Math.floor(second / 86400)
      const hours = Math.floor((second % 86400) / 3600)
      const minutes = Math.floor(((second % 86400) % 3600) / 60)
      const seconds = Math.floor(((second % 86400) % 3600) % 60)
      const forMatDate = {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      }
      return forMatDate
    },
    //坐标点转换Number类型
    transLngLat(lnglat) {
      return [Number(lnglat.split(",")[0]), Number(lnglat.split(",")[1])]
    },
    //关闭详情弹窗
    closePop() {
      this.PopShow = false
      this.audioShow = false
      this.audioEnd()
    },
    //详情弹窗关闭回调
    PopHide() {
      this.playing = false
      this.audioShow = false
      this.audioEnd()
    },
    rouertAudioPause() {
      this.$refs.audio.pause()
      this.$refs.audio.currentTime = 0
      this.playing = false
      this.$refs.audioPlayer.pause()
      this.$refs.audioPlayer.currentTime = 0
    },
    audioPlay() {
      const Audio = this.$refs.audio
      Audio.play()
      this.playing = true
    },
    audioPause() {
      const Audio = this.$refs.audio
      Audio.pause()
      this.playing = false
    },
    audioEnd() {
      const audioLine = document.querySelector(".paroline")
      audioLine.style.width = 0
      this.$refs.audio.currentTime = 0
      this.playing = false
    },
    showDetail(detail) {
      this.audioShow = true
      this.Detail = detail
      this.PopShow = true
      //自定义语音播放
      setTimeout(() => {
        const Audio = this.$refs.audio
        const audioLine = document.querySelector(".paroline")
        let updateDuration = true
        Audio.addEventListener("loadedmetadata", () => {
          let { hours, minutes, seconds } = this.formatSecond(Audio.duration)
          this.durationTime.seconds = seconds < 10 ? "0" + seconds : seconds
          this.durationTime.minutes = minutes < 10 ? "0" + minutes : minutes
          this.durationTime.hours = hours < 10 ? "0" + hours : hours
          Audio.volume = 0.6
          Audio.addEventListener("timeupdate", () => {
            //浙里办app 安卓端audio必须有交互行为才能获取duration
            if (updateDuration) {
              let { hours, minutes, seconds } = this.formatSecond(
                Audio.duration
              )
              this.durationTime.seconds = seconds < 10 ? "0" + seconds : seconds
              this.durationTime.minutes = minutes < 10 ? "0" + minutes : minutes
              this.durationTime.hours = hours < 10 ? "0" + hours : hours
              updateDuration = false
            }
            setTimeout(() => {
              let perCent = (Audio.currentTime / Audio.duration) * 100
              audioLine.style.width = perCent + "%"
              let { hours, minutes, seconds } = this.formatSecond(
                parseInt(Audio.currentTime)
              )
              this.currentTime.seconds = seconds < 10 ? "0" + seconds : seconds
              this.currentTime.minutes = minutes < 10 ? "0" + minutes : minutes
              this.currentTime.hours = hours < 10 ? "0" + hours : hours
            }, 1000)
          })
        })
      })
    },
    //导航
    openLocation() {
      let { $userAgent, $router } = this
      let { lnglat, title, local_name } = this.Detail
      let amapUrl
      const u = navigator.userAgent
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1
      if ($userAgent === "ZLBALIPAY") {
        //浙里办支付宝小程导航
        ap.openLocation({
          longitude: lnglat[0],
          latitude: lnglat[1],
          name: title,
          address: local_name,
        })
        this.rouertAudioPause()
        this.audioEnd()
      } else if ($userAgent === "ZLBAPP") {
        //浙里办APP 调用jsbridge
        if (isAndroid) {
          amapUrl =
            "androidamap://viewMap?sourceApplication=amap&poiname=" +
            title +
            "&lat=" +
            lnglat[1] +
            "&lon=" +
            lnglat[0] +
            "&dev=0"
          ZWJSOpenLocation(amapUrl)
        } else if (isiOS) {
          // jsbridge iOS无法通过openLink打开 urlscheme
          amapUrl =
            "iosamap://viewMap?sourceApplication=amap&poiname=" +
            title +
            "&lat=" +
            lnglat[1] +
            "&lon=" +
            lnglat[0] +
            "&dev=0"
          window.location.href = amapUrl
        }
      } else {
        //浏览器下拉起高德导航
        $router.push({
          path: "/Navigation",
          query: {
            title: title,
            lnglat: lnglat,
          },
        })
      }
    },
    //全景VR
    toVr() {
      this.$router.push({
        path: "/Vr",
        query: {
          vrLink: this.Detail.vrLink,
          title: this.Detail.title,
        },
      })
      this.rouertAudioPause()
    },
    //自定义语音播放事件
    audioPlay() {
      const Audio = this.$refs.audio
      Audio.play()
      this.playing = true
    },
    audioPause() {
      const Audio = this.$refs.audio
      Audio.pause()
      this.playing = false
    },
    //请求接口数据
    getApiData() {
      getData().then((res) => {
        this.pageLoading = false
        if (res.code === 200 && res.data.length) {
          res.data.forEach((item) => {
            this.Lists.push({
              tab: item.addr,
              title: item.title,
              image: item.image.split(":")[1],
              Introduction: item.Introduction,
              addr: item.addr,
              detail: item.detail,
              local_name: item.local_name,
              lnglat: this.transLngLat(item.local),
              vrLink: item.panoramic,
              distance: 300,
              audio: item.video.split(":")[1],
            })
          })
        }
      })
    },
    //点击搜索
    onSearch() {
      let inpVal = this.searchVal
      if (!inpVal) {
        Toast({
          message: "搜索内容不能为空",
          forbidClick: true,
        })
      } else {
        this.searchResults = this.Lists.filter((item) => {
          return item.title.includes(inpVal)
        })
        if (this.searchResults.length) {
          //搜索到结果
          this.hasResult = true
        } else {
          this.hasResult = false
        }
      }
    },
    //搜索内容change事件
    onChange() {
      if (!this.searchVal) {
        this.searchResults = []
        this.hasResult = true
      }
    },
    back() {
      this.$router.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.pageMain {
  min-height: 100vh;
  .searchBox {
    background-color: #fff;
    .back {
      width: 0.5rem;
      height: 1.5rem;
      line-height: 1rem;
      float: left;
      font-size: 0.5rem;
      display: flex;
      align-items: center;
      padding-left: 0.1rem;
      i {
        color: #555;
      }
    }
  }
  .searchRes {
    position: relative;
    height: calc(100vh - 1.5rem);
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
    padding: 0.22rem 0.28rem;
    .empty {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 18%;
      z-index: 2;
    }
    li {
      padding: 0.23rem 0;
      border-bottom: 1px solid #eee;
      h2 {
        font-weight: normal;
        color: #333;
        font-size: 0.4rem;
      }
    }
  }
  // 弹窗
  .popClose {
    height: 0.5rem;
    text-align: center;
    padding: 0.3rem 0;
    img {
      height: 0.3rem;
    }
  }
  .popIntro {
    height: calc(100% - 0.5rem);
    padding: 0 0.4rem;
    .imgBox {
      position: relative;
      height: 5rem;
      border-radius: 0.2rem;
      overflow: hidden;
      .intrImg {
        position: relative;
        z-index: 1;
        height: 100%;
        background-color: #ccc;
        background-size: cover !important;
        background-repeat: no-repeat !important;
        background-position: center center !important;
      }
      .cover {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        background: rgba(0, 0, 0, 0.12);
      }
      .intrAudio {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        h2 {
          color: #fff;
          font-size: 0.4rem;
          margin-bottom: 0.25rem;
          padding-left: 0.22rem;
        }
        .audio {
          background-color: #464849;
          height: 0.8rem;
          padding: 0 0.25rem;
          audio {
            display: none;
          }
          .playBox {
            position: absolute;
            right: 0.2rem;
            bottom: 1rem;
            z-index: 3;
            width: 1rem;
            height: 1rem;
            background-color: rgba(0, 0, 0, 0.67);
            border-radius: 100%;
            .play {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              z-index: 4;
              background-image: url("~@/assets/images/play.png");
              background-size: 0.4rem;
              background-position: center center !important;
              background-repeat: no-repeat !important;
            }
            .pause {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              z-index: 4;
              background-image: url("~@/assets/images/pause.png");
              background-size: 0.4rem;
              background-position: center center !important;
              background-repeat: no-repeat !important;
            }
          }
          .audioTime {
            color: #fff;
            font-size: 0.3rem;
            line-height: 0.8rem;
            width: 2.75rem;
            float: left;
          }
          .audioProcess {
            height: 100%;
            margin-left: 2.77rem;
            position: relative;
            .proceB {
              position: absolute;
              background-color: #5c5c5c;
              height: 0.18rem;
              left: 0;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              border-radius: 0.18rem;
              .paroline {
                transition: 0.2s all;
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                background-color: #fff;
                border-radius: 0.18rem;
                width: 0;
              }
            }
          }
        }
      }
    }
    .intrTitle {
      height: 2rem;
      h2 {
        font-size: 0.4rem;
        font-weight: normal;
        margin-top: 0.2rem;
        margin-bottom: 0.2rem;
      }
      .address {
        color: #f29235;
        font-size: 0.3rem;
        width: calc(100% - 4.25rem);
        float: left;
        background-image: url("~@/assets/images/add.png");
        background-size: 0.3rem;
        background-repeat: no-repeat;
        background-position-y: 10%;
        padding-left: 0.4rem;
        box-sizing: border-box;
      }
      .BtnBox {
        float: right;
        width: 4.1rem;
        height: 0.8rem;
        display: flex;
        justify-content: space-between;
        .navgate {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #5e9bfc;
          color: #5e9bfc;
          height: 0.8rem;
          border-radius: 0.8rem;
          width: 1.9rem;
          margin-bottom: 0.25rem;
          font-size: 0.3rem;
          span {
            font-size: 0.33rem;
          }
          img {
            height: 0.4rem;
            margin-right: 0.15rem;
          }
        }
        .navgateVr {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #5e9bfc;
          background: linear-gradient(45deg, #62b0fb, #438bf7);
          color: #fff;
          height: 0.8rem;
          border-radius: 0.8rem;
          width: 1.9rem;
          margin-bottom: 0.25rem;
          font-size: 0.3rem;
          span {
            font-size: 0.33rem;
          }
          img {
            height: 0.52rem;
            margin-right: 0.15rem;
          }
        }
      }
    }
    .detailTxt {
      width: 100%;
      height: calc(100% - 7.9rem);
      overflow-y: auto;
      font-size: 0.28rem !important;
    }
  }
}
.audioPlayer {
  background-color: #464849;
  height: 0.8rem;
  padding: 0 0.25rem;
  position: relative;
  .audio__btn-wrap {
    position: absolute;
    overflow: hidden;
    height: 1rem;
    width: 1rem;
    right: 0.2rem;
    bottom: 1rem;
    z-index: 3;
  }
  .audio__play-start {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 3;
    width: 1rem;
    height: 1rem;
    background-color: rgba(0, 0, 0, 0.67);
    border-radius: 100%;
    margin: 0 !important;
    background-image: url("~@/assets/images/play.png");
    background-size: 0.4rem;
    background-position: center center !important;
    background-repeat: no-repeat !important;
    opacity: 1 !important;
    svg {
      display: none;
    }
  }
  .audio__play-pause {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 3;
    width: 1rem;
    height: 1rem;
    background-color: rgba(0, 0, 0, 0.67);
    border-radius: 100%;
    margin: 0 !important;
    background-image: url("~@/assets/images/pause.png");
    background-size: 0.4rem;
    background-position: center center !important;
    background-repeat: no-repeat !important;
    opacity: 1 !important;
    svg {
      display: none;
    }
  }
  .audio__time-wrap {
    position: absolute;
    left: 0.25rem;
    top: 50%;
    transform: translateY(-50%);
    margin-top: 0;
    > div {
      font-size: 0.3rem;
      color: #fff;
      &.audio__current-time {
        position: relative;
        padding-right: 0.17rem;
        margin-right: 0.1rem;
        &:after {
          display: block;
          content: "/";
          color: #fff;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .audio__progress-wrap {
    margin-top: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 2.6rem;
    width: calc(100% - 3rem);
  }
}
</style>
