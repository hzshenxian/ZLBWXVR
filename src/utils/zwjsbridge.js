//导航
export function ZWJSOpenLocation(url) {
  dd.ready(
    {
      developer: "daip@dtdream.com",
      usage: ["dd.biz.util.openLink"],
    },
    function() {
      dd.biz.util.openLink({
        url: url,
        onSuccess: function(data) {
          console.log("成功回调" + data)
        },
        onFail: function(error) {
          console.log("失败回调" + error)
        },
      })
    }
  )
}

//设置标题
export function ZWJSSetTitle(title) {
  dd.ready(
    {
      developer: "daip@dtdream.com",
      usage: ["dd.biz.navigation.setTitle"],
    },
    function() {
      dd.biz.navigation.setTitle({
        title: title,
        onSuccess: function(data) {},
        onFail: function(error) {},
      })
    }
  )
}

//打电话
export function ZWJSTelCall(tel) {
  dd.ready(
    {
      developer: "daip@dtdream.com",
      usage: ["dd.biz.telephone.call"],
    },
    function() {
      dd.biz.telephone.call({
        corpId: tel,
        onSuccess: function(data) {},
        onFail: function(error) {},
      })
    }
  )
}
