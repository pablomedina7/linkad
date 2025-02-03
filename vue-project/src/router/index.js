import { createRouter, createWebHashHistory } from "vue-router";
import LinkList from "../components/LinkList.vue";
import LinkDetail from "../components/LinkDetail.vue";

const routes = [
  { path: "/", component: LinkList },
  { path: "/link/:id", component: LinkDetail, props: true }, // 📌 Importante: `props: true`
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
