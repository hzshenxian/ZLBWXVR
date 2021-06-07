<template>
  <div class="pageLoading">
    <div class="loadingBox">
      <div class="square-rolling">
        <i class="rolling"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.pageLoading {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000000;
  background-color: #fff;
  .loadingBox {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0;
    overflow: hidden;
    border: 0;
    background-color: transparent;
    .square-rolling {
      position: relative;
      width: 75px;
      height: 75px;
      overflow: visible;
      display: flex;
      align-items: center;
      justify-content: center;
      .rolling {
        position: absolute;
        display: block;
        height: 1.1rem;
        width: 1.1rem;
        transform: rotateZ(0deg);
        background-color: #41adef;
        border-radius: 5%;
        animation: rotateRolling 2s infinite linear;
      }
    }
  }
}
//
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.v-leave-active {
  animation: fadeOut 0.3s;
}

@keyframes rotateRolling {
  0% {
  }
  20% {
    transform: rotateZ(40deg);
    border-radius: 50%;
    background-color: #f13b09;
    height: 1.1rem;
    width: 1.1rem;
  }
  30% {
    transform: rotateZ(80deg);
    border-radius: 50%;
    height: 0.7rem;
    width: 0.7rem;
    background-color: #f13b09;
  }
  40% {
    transform: rotateZ(100deg);
    border-radius: 50%;
    height: 0.4rem;
    width: 0.4rem;
    background-color: #f13b09;
  }
  50% {
    transform: rotateZ(100deg);
    border-radius: 50%;
    height: 0.3rem;
    width: 0.3rem;
    background-color: #f13b09;
  }
  60% {
    transform: rotateZ(50deg);
    border-radius: 30%;
    height: 0.7rem;
    width: 0.7rem;
    background-color: #f13b09;
  }
  70% {
    transform: rotateZ(30deg);
    border-radius: 10%;
    height: 1.1rem;
    width: 1.1rem;
    background-color: #f13b09;
  }
  80% {
    transform: rotateZ(0deg);
    border-radius: 5%;
  }
  100% {
    transform: rotateZ(0deg);
    border-radius: 5%;
  }
}
</style>
