import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './route'
import './style.css'
import App from './App.vue'


if (import.meta.hot) {
  import.meta.hot.on(
    "vite:beforeUpdate",
    /* eslint-disable-next-line no-console */
    () => console.clear()
  );
}

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

app.mount('#app')
