import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// GitHub Pages SPA 리다이렉트 처리
const app = createApp(App)
app.use(router)

// 404.html에서 리다이렉트된 경로 처리 (?/path 형태)
if (location.search.includes('?/')) {
  const path = location.search.slice(2).split('&')[0].replace(/~and~/g, '&')
  router.replace('/' + path)
}

app.mount('#app')
