import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// GitHub Pages SPA 리다이렉트 처리
const app = createApp(App)
app.use(router)

// 404.html에서 리다이렉트된 경로 처리
const path = (location.hash.slice(1) || location.pathname.slice(1)).replace(/^\/eduu\/?\?\/?/, '')
if (path && path !== location.pathname) {
  router.replace('/' + path.replace(/~and~/g, '&'))
}

app.mount('#app')
