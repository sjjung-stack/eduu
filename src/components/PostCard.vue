<template>
  <div class="post-card">
    <router-link :to="`/post/${post.id}`" class="post-link">
      <h2 class="post-title">{{ post.title }}</h2>
      <p class="post-excerpt">{{ excerpt }}</p>
      <div class="post-meta">
        <span class="post-author">{{ post.author?.email || '익명' }}</span>
        <span class="post-date">{{ formattedDate }}</span>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const excerpt = computed(() => {
  if (!props.post.content) return ''
  const text = props.post.content.replace(/<[^>]*>/g, '') // HTML 태그 제거
  return text.length > 150 ? text.substring(0, 150) + '...' : text
})

const formattedDate = computed(() => {
  if (!props.post.created_at) return ''
  const date = new Date(props.post.created_at)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<style scoped>
.post-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.post-link {
  display: block;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
}

.post-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-weight: 600;
  line-height: 1.4;
}

.post-excerpt {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
  font-size: 0.85rem;
  color: #95a5a6;
}

.post-author {
  font-weight: 500;
}

.post-date {
  color: #bdc3c7;
}

@media (max-width: 768px) {
  .post-link {
    padding: 1rem;
  }
  
  .post-title {
    font-size: 1.25rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
