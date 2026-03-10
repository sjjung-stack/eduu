<template>
  <form @submit.prevent="handleSubmit" class="post-form">
    <div class="form-group">
      <label for="title">Title</label>
      <input
        id="title"
        v-model="localTitle"
        type="text"
        required
        placeholder="게시글 제목을 입력하세요"
        class="form-input"
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <label for="slug">Slug</label>
      <input
        id="slug"
        v-model="localSlug"
        type="text"
        placeholder="my-first-post"
        class="form-input"
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <label for="excerpt">Excerpt</label>
      <textarea
        id="excerpt"
        v-model="localExcerpt"
        placeholder="게시글 요약을 입력하세요"
        class="form-textarea"
        rows="3"
        :disabled="loading"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="content">Content</label>
      <textarea
        id="content"
        v-model="localContent"
        required
        placeholder="게시글 내용을 입력하세요"
        class="form-textarea"
        rows="15"
        :disabled="loading"
      ></textarea>
    </div>

    <div class="form-group checkbox-group">
      <label class="checkbox-label">
        <input
          type="checkbox"
          v-model="localPublished"
          :disabled="loading"
          class="checkbox-input"
        />
        <span>Published</span>
      </label>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <div class="form-actions">
      <button
        type="button"
        @click="$emit('cancel')"
        class="btn-cancel"
        :disabled="loading"
      >
        취소
      </button>
      <button
        type="submit"
        class="btn-submit"
        :disabled="loading || !isFormValid"
      >
        {{ loading ? '저장 중...' : submitText }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    default: ''
  },
  excerpt: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  published: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  submitText: {
    type: String,
    default: '저장'
  }
})

const emit = defineEmits(['submit', 'cancel'])

const localTitle = ref(props.title)
const localSlug = ref(props.slug)
const localExcerpt = ref(props.excerpt)
const localContent = ref(props.content)
const localPublished = ref(props.published)

watch(() => props.title, (newVal) => {
  localTitle.value = newVal
})

watch(() => props.slug, (newVal) => {
  localSlug.value = newVal
})

watch(() => props.excerpt, (newVal) => {
  localExcerpt.value = newVal
})

watch(() => props.content, (newVal) => {
  localContent.value = newVal
})

watch(() => props.published, (newVal) => {
  localPublished.value = newVal
})

// 제목에서 자동으로 slug 생성
watch(localTitle, (newVal) => {
  if (!localSlug.value && newVal) {
    localSlug.value = newVal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
})

const isFormValid = computed(() => {
  return localTitle.value.trim().length > 0 && localContent.value.trim().length > 0
})

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', {
      title: localTitle.value.trim(),
      slug: localSlug.value.trim() || null,
      excerpt: localExcerpt.value.trim() || null,
      content: localContent.value.trim(),
      published: localPublished.value
    })
  }
}
</script>

<style scoped>
.post-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
  width: 100%;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-textarea {
  resize: vertical;
  min-height: 300px;
  line-height: 1.6;
}

.checkbox-group {
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  color: #2c3e50;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-input:disabled,
.form-textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
}

.btn-cancel {
  background-color: #95a5a6;
  color: #fff;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #7f8c8d;
}

.btn-submit {
  background-color: #3498db;
  color: #fff;
}

.btn-submit:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-cancel:disabled,
.btn-submit:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>
