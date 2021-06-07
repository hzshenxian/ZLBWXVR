<template>
  <div class="page">
    <transition>
      <loading v-if="pageLoading" />
    </transition>

    <!-- <div class="toolBar">
      <div class="back" @click="back">
        <img src="@/assets/images/mapback.png" alt="" />
      </div>
      <div class="home" @click="toHome">
        <img src="@/assets/images/home.png" alt="" />
      </div>
    </div> -->

    <div class="vrBox">
      <iframe :src="iframeUrl" ref="refIframe"> </iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageLoading: true,
      iframeUrl: "",
      positionTitle: "",
      positionLnglat: [],
    }
  },
  created() {
    this.positionTitle = document.title = this.$route.query.title
    this.positionLnglat = this.$route.query.lnglat
  },
  mounted() {
    setTimeout(() => {
      this.pageLoading = false
    }, 1000)
    this.skipMap(this.positionLnglat, this.positionTitle)
  },
  methods: {
    back() {
      this.$router.back()
    },
    toHome() {
      this.$router.push("/")
    },
    //拉起高德导航
    skipMap(lnglat, title) {
      const u = navigator.userAgent
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1 //android终端
      if (isiOS) {
        window.location.href =
          "iosamap://viewMap?sourceApplication=amap&poiname=" +
          title +
          "&lat=" +
          lnglat[1] +
          "&lon=" +
          lnglat[0] +
          "&dev=0"
        //判断是否跳转
        setTimeout(() => {
          let hidden =
            window.document.hidden ||
            window.document.mozHidden ||
            window.document.msHidden ||
            window.document.webkitHidden
          if (typeof hidden == "undefined" || hidden == false) {
            //调用高德地图
            this.$refs.refIframe.src =
              "https://uri.amap.com/marker?position=" +
              lnglat[0] +
              "," +
              lnglat[1] +
              "&name=" +
              title
          }
        }, 10)
      } else if (isAndroid) {
        window.location.href =
          "androidamap://viewMap?sourceApplication=amap&poiname=" +
          title +
          "&lat=" +
          lnglat[1] +
          "&lon=" +
          lnglat[0] +
          "&dev=0"
          //window.location.href  = "androidamap://navi?sourceApplication=appname&amp;poiname=" + title + "&amp;lat=" + lnglat[1] + "&amp;lon=" + lnglat[0] + "&amp;dev=0&amp;style=2"
        //判断是否跳转
        setTimeout(() => {
          let hidden =
            window.document.hidden ||
            window.document.mozHidden ||
            window.document.msHidden ||
            window.document.webkitHidden
          if (typeof hidden == "undefined" || hidden == false) {
            //调用高德地图
            this.$refs.refIframe.src =
              "https://uri.amap.com/marker?position=" +
              lnglat[0] +
              "," +
              lnglat[1] +
              "&name=" +
              title
          }
        }, 10)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  position: absolute;
  width: 100vw;
  height: 100vh;
  .vrBox {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    iframe {
      width: 100%;
      height: 100%;
    }
  }
  .toolBar {
    background-color: rgba(0, 0, 0, 0.9);
    width: 1.7rem;
    height: 0.7rem;
    border-radius: 0.7rem;
    position: fixed;
    left: 0.2rem;
    top: 0.15rem;
    z-index: 5;
    .back {
      float: left;
      width: 50%;
      height: 100%;
      position: relative;
      &::after {
        content: "";
        display: block;
        border-right: 1px solid rgba(255, 255, 255, 0.7);
        width: 1px;
        height: 60%;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      img {
        height: 0.5rem;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .home {
      float: left;
      width: 50%;
      height: 100%;
      position: relative;
      img {
        height: 0.5rem;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
