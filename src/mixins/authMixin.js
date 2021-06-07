
import { storage } from "@/utils/utils"

export default {
  data() {
    return {}
  },
  created() {
    this.addJsBridge()
    this.setAplus()
    // this.checkToken();
  },
  methods: {
    addJsBridge() {
      let { $userAgent } = this
      if ($userAgent === "ZLBALIPAY") {
        // 浙里办支付宝小程序
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.src =
          "//gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min.js"
        document.getElementsByTagName("head")[0].appendChild(script)
      } else if ($userAgent === "ZLBAPP") {
        //浙里办APP
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.src = "//portal.zjzwfw.gov.cn/assets/jsbridge/1.0.0/jsbridge.js"
        document.getElementsByTagName("head")[0].appendChild(script)
      }
    },
    checkToken() {
      let ticket = this.$route.query.ticket
      let $storage = new storage()
      let token = $storage.get("token")
      if (!token) {
        //没有token
        if (ticket) {
          //去后台换取token 存储到本地
          //$storage.set("token", res.token.token);
        } else {
          //去授权
          this.toZLBAuth()
        }
      }
    },
    toZLBAuth() {
      let { $userAgent } = this
      if ($userAgent === "ZLBALIPAY") {
        // 浙里办支付宝小程序授权
        window.location.href =
          "https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=接入码&goto=回调地址"
      } else if ($userAgent === "ZLBAPP") {
        //浙里办APP授权
        window.location.href =
          "https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=接入码&goto=回调地址"
      }
    },
    setAplus() {
      //添加埋点
      ;(function(w, d, s, q, i) {
        w[q] = w[q] || []
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s)
        j.async = true
        j.id = "beacon-aplus"
        j.src = "https://d.alicdn.com/alilog/mlog/aplus.js?id=202951085"
        f.parentNode.insertBefore(j, f)
      })(window, document, "script", "aplus_queue")
      aplus_queue.push({
        action: "aplus.setMetaInfo",
        arguments: ["aplus-rhost-v", "alog.zjzwfw.gov.cn"],
      })
      aplus_queue.push({
        action: "aplus.setMetaInfo",
        arguments: ["aplus-rhost-g", "alog.zjzwfw.gov.cn"],
      })
      aplus_queue.push({
        action: "aplus.setMetaInfo",
        arguments: ["appId", "60506758"],
      })
      aplus_queue.push({
        action: "aplus.sendPV",
        arguments: [
          {
            is_auto: false,
          },
          {
            miniAppId: "2001815964",
          },
          {
            miniAppName: "吴兴云上安全",
          },
        ],
      })
    },
    beforeRouteEnter(to, from, next) {
      next()
    },
  },
}
