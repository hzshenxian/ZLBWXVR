/*
 * @Author: your name
 * @Date: 2021-05-29 09:41:17
 * @LastEditTime: 2021-05-29 11:12:28
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \gover\src\utils\utils.js
 */
/*
 * JS 时间格式化
 * type 时间格式（yyyy-mm-dd hh:ii:ss / mm-dd / hh:ii / yyyy-mm）可自定义
 * date 毫秒时间戳（1554954127000）
 * 使用：timeFormat('yyyy-mm-dd hh:ii:ss',1554954127000)
 * 说明：紧支持毫秒级时间戳，传统秒级 Unix 时间戳需要乘以 1000 转换为毫秒
 */
export function timeFormat(type, date) {
  var date = new Date(date)
  var o = {
    "m+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "i+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
  }
  if (/(y+)/.test(type)) {
    type = type.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(type)) {
      type = type.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      )
    }
  }
  return type
}

/*
 localStorage封装
 * 批量获取
 * storage.batchGet('a', 'b')
 * 单个获取
 * storage.get('token')
 * 清空
 * storage.clear()
 * 批量设置
 * storage.batchSet({
   a: aValue,
   b: bValue    
 }
 * 单个设置
 * storage.set(a, aValue)
 * 获取全部
 * storage.getAll()
 * 删除一个
 * storage.remove(a)
 */
export class storage {
  constructor(name) {
    this.store = window.localStorage
    this.storeName = name
  }
  // 设置一个local
  set(key, value) {
    //存储
    let storeData = this.store.getItem(this.storeName)
    if (!storeData) {
      this.init()
      storeData = this.store.getItem(this.storeName)
    }
    storeData = JSON.parse(storeData)
    storeData.data[key] = value
    this.store.setItem(this.storeName, JSON.stringify(storeData))
    return storeData.data
  }
  // 批量设置local
  batchSet(obj) {
    if (!objectTool.isObject(obj)) {
      return
    }
    for (const key in obj) {
      this.set(key, obj[key])
    }
  }
  // 获取一个local
  get(key) {
    //读取
    let result = this.getAll()
    if (!result) {
      return null
    }
    return result[key]
  }
  // 批量获取local
  batchGet() {
    let result = {}
    const allLocal = this.getAll()
    if (!allLocal) {
      return result
    }
    for (var i = 0; i < arguments.length; i++) {
      const item = arguments[i]
      result[item] = allLocal[item]
    }
    return result
  }
  // 获取全部
  getAll() {
    let storeData = this.store.getItem(this.storeName)
    if (!storeData) {
      return null
    }
    storeData = JSON.parse(storeData)
    return storeData.data
  }
  // 删除一个
  remove(key) {
    //读取
    let storeData = this.store.getItem(this.storeName)
    if (!storeData) {
      return
    }
    storeData = JSON.parse(storeData)
    delete storeData.data[key]
    this.store.setItem(this.storeName, JSON.stringify(storeData))
    return storeData.data
  }
  // 清除
  clear() {
    //清除对象
    this.store.removeItem(this.storeName)
  }
  // 初始化
  init() {
    this.store.setItem(this.storeName, '{"data":{}}')
  }
}

/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
export const Debounce = (fn, t) => {
  const delay = t || 500
  let timer
  return function() {
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, delay)
  }
}
