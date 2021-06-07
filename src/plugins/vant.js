
import "vant/lib/index.css"
import "lib-flexible/flexible"
import {
  Popup,
  Toast,
  Empty,
  NoticeBar,
  Tab,
  Tabs,
  Search,
  Icon,
  Swipe,
  SwipeItem,
} from "vant"

export default (app) => {
  app.use(Popup)
    .use(Toast)
    .use(Empty)
    .use(NoticeBar)
    .use(Tab)
    .use(Tabs)
    .use(Search)
    .use(Icon)
    .use(Swipe)
    .use(SwipeItem)
}