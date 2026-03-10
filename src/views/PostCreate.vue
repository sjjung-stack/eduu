<template>
  <div class="post-create">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">New Post</h1>
        <router-link to="/admin" class="back-link">← Back to admin list</router-link>
      </div>
      
      <div class="form-container">
        <PostForm
          :loading="loading"
          :error="error"
          submit-text="Create Post"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { usePosts } from '../composables/usePosts'
import PostForm from '../components/PostForm.vue'

const router = useRouter()
const { createPost, loading, error } = usePosts()

const handleSubmit = async (formData) => {
  const { data, error: err } = await createPost(
    formData.title,
    formData.slug,
    formData.excerpt,
    formData.content,
    formData.published
  )
  
  if (err) {
    // error는 composable에서 설정됨
    return
  }
  
  if (data) {
    router.push('/admin')
  }
}

const handleCancel = () => {
  router.push('/admin')
}
</script>

<style scoped>
.post-create {
  min-height: calc(100vh - 80px);
  background-color: #f5f5f5;
  padding: 2rem 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.back-link {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover {
  text-decoration: underline;
}

.form-container {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .form-container {
    padding: 1.5rem;
  }
}
</style>
