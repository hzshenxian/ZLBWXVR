/*
 * @Author: hzshenxian
 * @Date: 2021-05-28 12:40:50
 * @LastEditTime: 2021-06-07 15:08:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \吴兴云上安全\src\request\config.js
 */


let baseUrl

if (process.env.NODE_ENV === "development") {
  baseUrl = "/wxapi"
} else if (process.env.NODE_ENV === "debug") {
} else if (process.env.NODE_ENV === "production") {
  baseUrl = "https://newhouse.zjlaishang.com"
}
export { baseUrl }
