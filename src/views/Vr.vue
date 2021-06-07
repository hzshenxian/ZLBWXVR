<template>
  <div class="page">
    <transition>
      <loading v-if="pageLoading" />
    </transition>
    <!-- <div class="back" @click="back">
      <img src="@/assets/images/back.png" alt />
      <p>返回</p>
    </div> -->
    <div class="search" @click="toSearch">
      <img src="@/assets/images/search.png" alt />
      <p>搜索</p>
    </div>
    <div class="vrBox">
      <iframe :src="vrLink"> </iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageLoading: true,
      vrLink: "",
    }
  },
  created() {
    this.vrLink = this.$route.query.vrLink
    document.title = this.$route.query.title
  },
  mounted() {
    setTimeout(() => {
      this.pageLoading = false
    }, 2000)
  },
  methods: {
    toSearch() {
      this.$router.push("/Search")
    },
    back() {
      this.$router.push("/")
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
  .back {
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
    position: fixed;
    top: 2.2rem;
    left: 0.2rem;
    z-index: 2;
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
  .search {
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
    position: fixed;
    top: 2.2rem;
    left: 0.2rem;
    z-index: 2;
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
</style>
