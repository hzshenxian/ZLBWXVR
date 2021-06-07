
import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import loading from "@/components/common/Loading";
import { userAgentType } from "@/utils/userAgent";
// import Vconsole from "vconsole";
// new Vconsole()

import vant from "@/plugins/vant"


Vue.config.productionTip = false;
Vue.prototype.$userAgent = userAgentType();

Vue.use(vant)
Vue.component("loading", loading);
new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
