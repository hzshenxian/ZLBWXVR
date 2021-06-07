
import Vue from "vue"
import VueRouter from "vue-router"
import { ZWJSSetTitle } from "@/utils/zwjsbridge"
Vue.use(VueRouter)

const Home = () => import("@/views/Home")
const Vr = () => import("@/views/Vr")
const Search = () => import("@/views/Search")
const Navigation = () => import("@/views/Navigation")

const routes = [
  {
    path: "/",
    redirect: "/Home",
  },
  {
    path: "/Home",
    name: "Home",
    component: Home,
    meta: {
      title: "吴兴云上安全",
      keepAlive: true,
    },
  },
  {
    path: "/Vr",
    name: "Vr",
    component: Vr,
    meta: {
      title: "吴兴云上安全",
      keepAlive: false,
    },
  },
  {
    path: "/Search",
    name: "Search",
    component: Search,
    meta: {
      title: "吴兴云上安全",
      keepAlive: false,
    },
  },
  {
    path: "/Navigation",
    name: "Navigation",
    component: Navigation,
    meta: {
      title: "吴兴云上安全",
      keepAlive: false,
    },
  },
  {
    path: "*",
    redirect: "/Home",
  },
]

const router = new VueRouter({
  mode: "hash",
  routes,
  scrollBehavior(to, from, savePosition) {
    if (savePosition) {
      return savePosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

router.beforeEach((to, from, next) => {
  next()
})

router.afterEach((to, from) => {
  to.meta.title && (document.title = to.meta.title)
  let { $userAgent } = router.app
  if ($userAgent === "ZLBALIPAY" || $userAgent === "ZLBAPP") {
    to.meta.title && ZWJSSetTitle(to.meta.title)
  }
})

export default router
