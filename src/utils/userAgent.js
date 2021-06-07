
const userAgentType = () => {
  const sUserAgent = window.navigator.userAgent.toLowerCase()
  if (sUserAgent.indexOf("dtdreamweb") > -1) {
    // 浙里办APP
    return "ZLBAPP"
  } else if (
    sUserAgent.indexOf("miniprogram") > -1 &&
    sUserAgent.indexOf("alipay") > -1
  ) {
    // 浙里办支付宝小程序
    return "ZLBALIPAY"
  } else {
    return "OTHER"
  }
}
export { userAgentType }
