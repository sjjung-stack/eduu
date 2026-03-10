<template>
  <div class="admin">
    <div class="container">
      <div class="admin-header">
        <h1 class="page-title">Admin</h1>
      </div>
      
      <div v-if="loading" class="loading">로딩 중...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="admin-content">
        <div class="posts-list">
          <div class="list-header">
            <h2>게시글 목록</h2>
            <router-link to="/post/create" class="btn-create">새 게시글 작성</router-link>
          </div>
          
          <div v-if="posts.length === 0" class="empty">
            작성된 게시글이 없습니다.
          </div>
          
          <table v-else class="posts-table">
            <thead>
              <tr>
                <th>제목</th>
                <th>Slug</th>
                <th>상태</th>
                <th>작성일</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in posts" :key="post.id">
                <td class="title-cell">
                  <router-link :to="`/post/${post.id}`" class="post-link">
                    {{ post.title }}
                  </router-link>
                </td>
                <td>{{ post.slug || '-' }}</td>
                <td>
                  <span :class="['status-badge', post.published ? 'published' : 'draft']">
                    {{ post.published ? 'Published' : 'Draft' }}
                  </span>
                </td>
                <td>{{ formattedDate(post.created_at) }}</td>
                <td class="actions-cell">
                  <router-link :to="`/post/${post.id}/edit`" class="btn-edit">수정</router-link>
                  <button @click="handleDelete(post.id)" class="btn-delete" :disabled="deleting === post.id">
                    삭제
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePosts } from '../composables/usePosts'

const router = useRouter()
const { posts, loading, error, getPosts, deletePost } = usePosts()

const deleting = ref(null)

const formattedDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleDelete = async (id) => {
  if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) {
    return
  }
  
  deleting.value = id
  const { error: err } = await deletePost(id)
  
  if (!err) {
    await getPosts(true) // 모든 게시글 다시 로드
  }
  
  deleting.value = null
}

onMounted(async () => {
  await getPosts(true) // 관리자 페이지에서는 모든 게시글 표시
})
</script>

<style scoped>
.admin {
  min-height: calc(100vh - 80px);
  background-color: #f5f5f5;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0;
}

.back-link {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover {
  text-decoration: underline;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
}

.error {
  color: #e74c3c;
}

.empty {
  color: #7f8c8d;
}

.admin-content {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.list-header h2 {
  margin: 0;
  color: #2c3e50;
}

.btn-create {
  background-color: #3498db;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.btn-create:hover {
  background-color: #2980b9;
}

.posts-table {
  width: 100%;
  border-collapse: collapse;
}

.posts-table thead {
  background-color: #f8f9fa;
}

.posts-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #dee2e6;
}

.posts-table td {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.title-cell {
  max-width: 300px;
}

.post-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.post-link:hover {
  text-decoration: underline;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.published {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.draft {
  background-color: #fff3cd;
  color: #856404;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
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

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .admin-content {
    padding: 1rem;
  }
  
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .posts-table {
    font-size: 0.9rem;
  }
  
  .posts-table th,
  .posts-table td {
    padding: 0.5rem;
  }
  
  .actions-cell {
    flex-direction: column;
  }
}
</style>
