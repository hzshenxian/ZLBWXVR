
<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import authMixin from "@/mixins/authMixin"
export default {
  name: "App",
  mixins:[authMixin],
};
</script>
<style>
  html {
  overflow-x: hidden;
}
* {
  padding: 0;
  margin: 0;
}
img {
  vertical-align: middle;
}
audio{
  opacity: 0;
  z-index: -1;
  position: relative;
}
.amap-copyright {
  display: none !important;
}
.amap-logo {
  display: none !important;
}
.amap-copyright {
  opacity: 0;
}
/* 自定义tab */
.bottomRar .van-tabs__line {
  display: none;
}
.bottomRar .van-tabs__wrap--scrollable .van-tab {
  padding: 0 0.11rem;
}
.bottomRar .van-tab span {
  color: #fff;
  display: inline;
  padding: 0 0.53rem;
  height: 0.7rem;
  line-height: 0.7rem;
  text-align: center;
  font-size: 0.35rem;
  border-radius: 0.8rem;
  font-weight: normal;
  background-color: rgba(0, 0, 0, 0.65);
}
.bottomRar .van-tab--active span {
  background-color: #5e9bfc;
}
.van-tabs--line .van-tabs__wrap {
  height: 1rem !important;
}
.van-popup {
  overflow-y: hidden !important;
}
.detailTxt span {
  font-size: 0.34rem !important;
  line-height: 0.5rem !important;
  font-family: "微软雅黑" !important;
  color: #333 !important;
}
.detailTxt p {
  color: #333 !important;
  font-size: 0.34rem !important;
  line-height: 0.5rem !important;
  font-family: "微软雅黑" !important;
  text-indent: 0.72rem !important;
  letter-spacing: 1px !important;
}
iframe {
  border: none;
  outline: none;
}
.van-empty__description {
  padding: 0 0 !important;
  margin-top: 0.22rem !important;
}
</style>
