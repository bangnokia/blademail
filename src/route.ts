import { createRouter, createWebHashHistory } from "vue-router";
import Email from './views/Email.vue'
import Home from './views/Home.vue'


const routes = [
  { path: '/emails/:id', component: Email, name: 'emails.show' },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Home },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router;