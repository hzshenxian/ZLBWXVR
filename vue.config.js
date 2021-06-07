


//配置路径别名
module.exports = {
  lintOnSave: true,
  assetsDir: "./",
  outputDir: "build",
  publicPath:"./",
  configureWebpack: (config) => {
    config["externals"] = {
      AMap: "AMap", // 高德地图配置
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-pxtorem")({
            rootValue: 37.5, // 换算的基数(设计图750的根字体为32)
            selectorBlackList: ["weui", "mu"], // 忽略转换正则匹配项
            propList: ["*"],
          }),
        ],
      },
    },
  },
  devServer: {
    disableHostCheck: true,
    open: true,
    port: 8080,
    proxy: {
      "/wxapi": {
        target: "https://newhouse.zjlaishang.com", //线上后台数据请求接口
        ws: false, //如果要代理 websockets，配置这个参数
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
        pathRewrite: {
          "^/wxapi": "/",
        },
      },
    },
  },
}
