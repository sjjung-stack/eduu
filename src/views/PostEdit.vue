<template>
  <div class="post-edit">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Edit Post</h1>
        <router-link to="/admin" class="back-link">← Back to admin list</router-link>
      </div>
      
      <div v-if="loadingPost" class="loading">로딩 중...</div>
      <div v-else-if="errorPost" class="error">{{ errorPost }}</div>
      <div v-else class="form-container">
        <PostForm
          :title="post?.title || ''"
          :slug="post?.slug || ''"
          :excerpt="post?.excerpt || ''"
          :content="post?.content || ''"
          :published="post?.published || false"
          :loading="loading"
          :error="error"
          submit-text="Update Post"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePosts } from '../composables/usePosts'
import PostForm from '../components/PostForm.vue'

const route = useRoute()
const router = useRouter()
const { getPost, updatePost, loading, error } = usePosts()

const post = ref(null)
const loadingPost = ref(false)
const errorPost = ref(null)

const loadPost = async () => {
  loadingPost.value = true
  errorPost.value = null
  
  const { data, error: err } = await getPost(route.params.id)
  
  if (err) {
    errorPost.value = err.message || '게시글을 불러오는데 실패했습니다.'
  } else {
    post.value = data
  }
  
  loadingPost.value = false
}

const handleSubmit = async (formData) => {
  const { data, error: err } = await updatePost(
    route.params.id,
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

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.post-edit {
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

.loading,
.error {
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
}

.error {
  color: #e74c3c;
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
