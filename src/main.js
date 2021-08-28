import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import HelloWorld from "./components/HelloWorld";
import classification from "./components/classementPhrase";
import sortPhrase from "./components/sortPhrase";
import selectText from "./components/selectText";
Vue.use(VueRouter);

const routes = [
  { path: "/HelloWorld", component: HelloWorld },
  { path: "/classification", component: classification },
  { path: "/sortPhrase", component: sortPhrase },
  { path: "/selectText", component: selectText }
];
const router = new VueRouter({
  routes // short for `routes: routes`
});
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App)
}).$mount("#app");
