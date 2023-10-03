import { createRouter, createWebHistory } from "vue-router";
import Email from './views/Email.vue'
import Home from './views/Home.vue'


const routes = [
  { path: '/', component: Home, name: 'home' },
  { path: '/emails/:id', component: Email, name: 'emails.show', props: true },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Home },
]
const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router;