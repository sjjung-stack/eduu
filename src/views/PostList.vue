<template>
  <div class="post-list">
    <div class="container">
      <h1 class="page-title">블로그</h1>
      
      <div v-if="loading" class="loading">로딩 중...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="posts.length === 0" class="empty">
        아직 작성된 게시글이 없습니다.
      </div>
      <div v-else class="posts-grid">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePosts } from '../composables/usePosts'
import PostCard from '../components/PostCard.vue'

const { posts, loading, error, getPosts } = usePosts()

onMounted(async () => {
  await getPosts()
})
</script>

<style scoped>
.post-list {
  min-height: calc(100vh - 80px);
  background-color: #f5f5f5;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
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

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 0 1rem;
  }
}
</style>
