<template>
  <div class="Body">
    <transition>
      <loading v-if="pageLoading" />
    </transition>
    <div class="pageM">
      <audio :src="Detail.audio" ref="audio" v-if="audioShow"></audio>
      <div class="notic">
        <div class="noticL">公告</div>
        <div class="noticR">
          <van-notice-bar
            left-icon
            :scrollable="false"
            background="transparent"
            color="#fff"
          >
            <van-swipe
              vertical
              class="notice-swipe"
              :autoplay="3000"
              :show-indicators="false"
            >
              <van-swipe-item
                v-for="(item, index) in noticeList"
                :key="index"
                >{{ item.title }}</van-swipe-item
              >
            </van-swipe>
          </van-notice-bar>
        </div>
      </div>
      <div class="map" id="map" ref="refMap"></div>
      <div class="rightTool">
        <div @click="toSearch">
          <img src="@/assets/images/search.png" alt />
          <p>搜索</p>
        </div>
        <div @click="toPano">
          <img src="@/assets/images/vr.png" alt />
          <p>全景</p>
        </div>
      </div>
      <!-- bottombar -->
      <div class="bottomRar">
        <div>
          <van-tabs
            swipeable
            animated
            v-model="activeTab"
            background="none"
            title-active-color="#fff"
            ref="refTab"
            @change="tabChange"
          >
            <van-tab
              v-for="(item, index) in tabsList"
              :name="index"
              :title="item.tab"
            >
              <div class="tabBox">
                <div
                  class="thumb"
                  :style="{ background: 'url(' + item.image + ')' }"
                ></div>
                <div class="tabTxt">
                  <div>
                    <h2>{{ item.title }}</h2>
                    <p>距您 {{ item.distance }}</p>
                  </div>
                  <div>
                    <span class="navgate" @click="navDetail(item, index)">
                      <i>
                        <img src="@/assets/images/navgate.png" alt />
                      </i>
                      <span>详情</span>
                    </span>
                  </div>
                </div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
    <!-- 提供信息 -->
    <div class="Copyright">
      <div>
        <p>本服务由浙江政务服务网、湖州市吴兴区政府提供</p>
        <p>
          服务咨询热线:<span class="tel" @click="telCall('0572-2595853')"
            >0572-2595853</span
          >
        </p>
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
import { ZWJSOpenLocation, ZWJSTelCall } from "../utils/zwjsbridge"
export default {
  data() {
    return {
      pageLoading: true,
      PopShow: false,
      playing: false,
      noticeList: [],
      tabsList: [],
      activeTab: 0,
      Detail: {},
      locationPoint: [],
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
      map: null,
      mapMarkers: [],
      audioList: [],
      audioShow: false,
    }
  },
  created() {},
  mounted() {
    this.map = new AMap.Map("map", {
      resizeEnable: true,
      mapStyle: "amap://styles/normal",
      zoom: 13,
    })
    this.map.panBy(-10, -100)
    this.map.setZoom(13)
    this.getApamLocation()
  },
  methods: {
    telCall(tel) {
      let { $userAgent } = this
      if ($userAgent === "ZLBALIPAY") {
        ap.makePhoneCall(tel)
      } else if ($userAgent === "ZLBAPP") {
        ZWJSTelCall(tel)
      }else{
        window.location.href = "tel:" + tel
      }
    },
    //定位点距离换算
    GetDistance([lng1, lat1], [lng2, lat2]) {
      let radLat1 = (lat1 * Math.PI) / 180.0
      let radLat2 = (lat2 * Math.PI) / 180.0
      let a = radLat1 - radLat2
      let b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
      let s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        )
      s = s * 6378.137
      s = Math.round(s * 10000) / 10000
      if (s < 1) {
        return (s * 1000).toFixed(2) + "米"
      } else {
        return s.toFixed(2) + "公里"
      }
    },
    //坐标点转换Number类型
    transLngLat(lnglat) {
      return [Number(lnglat.split(",")[0]), Number(lnglat.split(",")[1])]
    },
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
    //地图右上角去往全景
    toPano() {
      this.$router.push({
        path: "/Vr",
        query: {
          vrLink: this.tabsList[0].vrLink,
          title: this.tabsList[0].title,
        },
      })
    },
    //地图右上角去往搜索
    toSearch() {
      this.$router.push("/Search")
    },
    //点击关闭详情弹窗
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
    //自定义语音播放事件
    rouertAudioPause() {
      this.audioShow = false
      this.playing = false
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
    //详情
    navDetail(detail) {
      this.audioShow = true
      this.Detail = detail
      this.PopShow = true
      this.audioList = []
      this.audioList.push({
        url: detail.audio,
      })
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
        //浙里办支付宝小程序 调用AlipayJSApi导航
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
          // 解决jsbridge openLink 兼容问题安卓端能用 iOS 无法打开
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
    //详情全景
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
    //坐标点点击事件
    markClick(e) {
      let currentTab
      if (e.originEvent.target.classList.contains("markBox")) {
        currentTab = Number(e.originEvent.target.dataset.index)
      } else {
        currentTab = Number(e.originEvent.target.parentNode.dataset.index)
      }
      this.$refs.refTab.scrollTo(currentTab)
    },
    //地图添加坐标点
    addMark(map, markers) {
      markers.forEach((item, index) => {
        let marker = new AMap.Marker({
          map: map,
          content: `
                <div class="markBox ${
                  index === this.activeTab ? "active" : ""
                }" data-index="${index}">
                  <div class="markImg" style="background:url(${
                    item.image
                  })" ></div>
                  <div class="markTitle">${item.title}</div>
                  <div class="sj"></div>
                </div>
              `,
          position: item.lnglat,
        })
        marker.on("click", this.markClick)
        this.mapMarkers.push(marker)
      })
    },
    //tabchange事件
    tabChange() {
      this.map.remove(this.mapMarkers)
      this.addMark(this.map, this.tabsList)
      this.map.setCenter(this.tabsList[this.activeTab].lnglat)
      this.map.panBy(-10, -100)
      this.map.setZoom(13)
    },
    getApiData() {
      getData().then((res) => {
        this.pageLoading = false
        if (res.code === 200 && res.data.length) {
          console.log(res)
          res.data.forEach((item) => {
            this.tabsList.push({
              tab: item.addr,
              title: item.title,
              image: item.image.split(":")[1],
              Introduction: item.Introduction,
              addr: item.addr,
              detail: item.detail,
              local_name: item.local_name,
              lnglat: this.transLngLat(item.local),
              vrLink: item.panoramic,
              distance: this.GetDistance(
                this.locationPoint,
                this.transLngLat(item.local)
              ),
              audio: item.video.split(":")[1],
            })
            this.noticeList.push({
              title: item.Introduction,
            })
          })
          this.addMark(this.map, this.tabsList)
          this.map.setCenter(this.tabsList[this.activeTab].lnglat)
          this.map.panBy(-10, -100)
        }
      })
    },
    //高德地图定位
    getApamLocation() {
      let _this = this
      AMap.plugin("AMap.Geolocation", () => {
        let geolocation = new AMap.Geolocation({
          timeout: 3000,
          showButton: false,
        })
        this.map.addControl(geolocation)
        geolocation.getCurrentPosition((status, result) => {
          console.log(result)
          if (status == "complete") {
            //定位成功
            this.locationPoint = [
              Number(result.position.lng),
              Number(result.position.lat),
            ]
            this.getApiData()
          } else {
            //定位失败
            console.log(result)
            this.getApiData()
          }
        })
      })
    },
  },
}
</script>
<style lang="scss">
.Body {
  height: 100vh;
  overflow-y: hidden;
}
.pageM {
  height: calc(100vh - 2rem);
  width: 100vw;
  position: relative;
  .notic {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    height: 0.78rem;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 2;
    padding-left: 0.3rem;
    padding-right: 0.2rem;
    .noticL {
      float: left;
      width: 0.9rem;
      background-color: #5e9bfc;
      color: #fff;
      font-size: 0.3rem;
      height: 0.56rem;
      line-height: 0.56rem;
      text-align: center;
      border-radius: 0.05rem;
      margin-top: 0.11rem;
    }
    .van-notice-bar {
      height: 0.78rem;
      line-height: 0.78rem;
      font-size: 0.33rem;
      .notice-swipe {
        height: 0.78rem;
        line-height: 0.78rem;
        .van-swipe-item {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
      }
    }
  }
  .map {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 1;
  }
  .rightTool {
    position: absolute;
    top: 1.3rem;
    right: 0.2rem;
    z-index: 2;
    > div {
      background-color: #fff;
      width: 1rem;
      height: 1rem;
      border-radius: 0.22rem;
      box-shadow: 0 0 0.12rem 0 rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-bottom: 0.3rem;
      img {
        height: 0.37rem;
      }
      p {
        color: #333;
        font-size: 0.26rem;
        margin-top: 0.02rem;
        margin-bottom: 0;
      }
    }
  }
  // bottomBar

  .bottomRar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    .tabBox {
      background-color: #fff;
      height: 3rem;
      margin: 0.12rem 0.2rem;
      margin-bottom: 0.2rem;
      border-radius: 0.2rem;
      box-shadow: 0 0 0.22rem 0 rgba(0, 0, 0, 0.15);
      overflow: hidden;
      .thumb {
        float: left;
        height: 3rem;
        width: 3rem;
        background-size: cover !important;
        background-repeat: no-repeat !important;
        background-position: center center !important;
      }
      .tabTxt {
        height: 3rem;
        margin-left: 3rem;
        padding: 0 0.22rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        h2 {
          font-weight: normal;
          font-size: 0.4rem;
          color: #000;
          margin: 0.25rem 0 0.15rem 0;
        }
        p {
          color: #999;
          font-size: 0.3rem;
        }
        .navgate {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #5e9bfc;
          color: #5e9bfc;
          height: 0.8rem;
          border-radius: 0.8rem;
          width: 2rem;
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
      }
    }
  }
}
// pop
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
      font-size: 0.42rem;
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
// 地图点坐标
.markBox {
  position: relative;
  width: 1rem;
  height: 1rem;
  z-index: 2;
  .sj {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-left: 0.12rem solid transparent;
    border-right: 0.12rem solid transparent;
    border-top: 0.23rem solid #666;
    position: absolute;
    left: 55%;
    top: 1rem;
    transform: translateX(-50%);
    z-index: -1;
  }
  .markImg {
    width: 1rem;
    height: 1rem;
    border: 2px solid #666;
    background-color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 5;
    border-radius: 100%;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center center !important;
  }
  .markTitle {
    color: #fff;
    font-size: 0.32rem;
    height: 1rem;
    line-height: 1rem;
    width: auto;
    display: none;
    padding: 0 0.3rem 0 1.25rem;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 1rem;
    position: absolute;
    left: 0.05rem;
    top: 0;
    z-index: 1;
  }
}
.markBox.active {
  .sj {
    border-top: 0.23rem solid #5e9bfc;
  }
  .markImg {
    border: 2px solid #5e9bfc;
  }
  .markTitle {
    display: inline-block;
  }
}
// audioPlayer
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
.Copyright {
  position: relative;
  text-align: center;
  height: 2rem;
  width: 100%;
  background-color: #f7f7f7;
  color: #999;
  > div {
    width: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    p {
      display: block;
      font-size: 0.35rem;
    }
  }
}
.tel {
  color: #5584ff;
  text-decoration: underline;
  margin-left: 0.08rem;
}
</style>
