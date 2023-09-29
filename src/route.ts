import { createRouter, createWebHashHistory } from "vue-router";
import Email from './views/Email.vue'


const routes = [
  { path: '/emails/:id', component: Email }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router;