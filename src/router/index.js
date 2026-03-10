import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../utils/supabase'
import PostList from '../views/PostList.vue'
import PostDetail from '../views/PostDetail.vue'
import PostCreate from '../views/PostCreate.vue'
import PostEdit from '../views/PostEdit.vue'
import Admin from '../views/Admin.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const routes = [
  {
    path: '/',
    name: 'PostList',
    component: PostList,
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: PostDetail,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
  },
  {
    path: '/post/create',
    name: 'PostCreate',
    component: PostCreate,
  },
  {
    path: '/post/:id/edit',
    name: 'PostEdit',
    component: PostEdit,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 인증 가드 제거 - 모든 사용자가 접근 가능

export default router
