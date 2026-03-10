<template>
  <div class="post-detail">
    <div class="container">
      <div v-if="loading" class="loading">로딩 중...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="post" class="post-content">
        <div class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <div v-if="isAuthor" class="post-actions">
            <router-link :to="`/post/${post.id}/edit`" class="btn-edit">수정</router-link>
            <button @click="handleDelete" class="btn-delete" :disabled="deleting">
              {{ deleting ? '삭제 중...' : '삭제' }}
            </button>
          </div>
        </div>
        
        <div class="post-meta">
          <span class="post-author">작성자: {{ authorEmail }}</span>
          <span class="post-date">작성일: {{ formattedCreatedAt }}</span>
          <span v-if="post.updated_at !== post.created_at" class="post-date">
            수정일: {{ formattedUpdatedAt }}
          </span>
        </div>
        
        <div class="post-body">
          <pre class="post-text">{{ post.content }}</pre>
        </div>
        
        <div class="post-footer">
          <router-link to="/" class="btn-back">목록으로</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePosts } from '../composables/usePosts'

const route = useRoute()
const router = useRouter()
const { getPost, deletePost } = usePosts()

const post = ref(null)
const loading = ref(false)
const error = ref(null)
const deleting = ref(false)

// 모든 사용자가 수정/삭제 가능
const isAuthor = computed(() => {
  return true
})

const authorEmail = computed(() => {
  if (!post.value) return '익명'
  return '사용자'
})

const formattedCreatedAt = computed(() => {
  if (!post.value?.created_at) return ''
  const date = new Date(post.value.created_at)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const formattedUpdatedAt = computed(() => {
  if (!post.value?.updated_at) return ''
  const date = new Date(post.value.updated_at)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const loadPost = async () => {
  loading.value = true
  error.value = null
  
  const { data, error: err } = await getPost(route.params.id)
  
  if (err) {
    error.value = err.message || '게시글을 불러오는데 실패했습니다.'
  } else {
    post.value = data
  }
  
  loading.value = false
}

const handleDelete = async () => {
  if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) {
    return
  }
  
  deleting.value = true
  error.value = null
  
  const { error: err } = await deletePost(route.params.id)
  
  if (err) {
    error.value = err.message || '게시글 삭제에 실패했습니다.'
    deleting.value = false
  } else {
    router.push('/')
  }
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.post-detail {
  min-height: calc(100vh - 80px);
  background-color: #f5f5f5;
  padding: 2rem 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
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

.post-content {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.post-title {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
  text-decoration: none;
  display: inline-block;
}

.btn-edit {
  background-color: #3498db;
  color: #fff;
}

.btn-edit:hover {
  background-color: #2980b9;
}

.btn-delete {
  background-color: #e74c3c;
  color: #fff;
}

.btn-delete:hover:not(:disabled) {
  background-color: #c0392b;
}

.btn-delete:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #ecf0f1;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.post-author {
  font-weight: 500;
}

.post-body {
  margin-bottom: 2rem;
}

.post-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.8;
  color: #2c3e50;
  margin: 0;
}

.post-footer {
  padding-top: 1.5rem;
  border-top: 1px solid #ecf0f1;
}

.btn-back {
  display: inline-block;
  background-color: #95a5a6;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn-back:hover {
  background-color: #7f8c8d;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .post-content {
    padding: 1.5rem;
  }
  
  .post-header {
    flex-direction: column;
  }
  
  .post-title {
    font-size: 1.5rem;
  }
  
  .post-actions {
    width: 100%;
  }
  
  .btn-edit,
  .btn-delete {
    flex: 1;
  }
  
  .post-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
