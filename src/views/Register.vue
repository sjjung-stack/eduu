<template>
  <div class="register">
    <div class="register-container">
      <h1 class="register-title">회원가입</h1>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="email">이메일</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="이메일을 입력하세요"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="비밀번호를 입력하세요 (최소 6자)"
            minlength="6"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">비밀번호 확인</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="비밀번호를 다시 입력하세요"
            class="form-input"
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">
          회원가입이 완료되었습니다! 이메일을 확인해주세요.
        </div>

        <button type="submit" :disabled="loading || !isFormValid" class="btn-submit">
          {{ loading ? '가입 중...' : '회원가입' }}
        </button>
      </form>

      <div class="register-footer">
        <p>이미 계정이 있으신가요? <router-link to="/login">로그인</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { signUp } = useAuth()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(false)

const isFormValid = computed(() => {
  return (
    email.value &&
    password.value.length >= 6 &&
    password.value === confirmPassword.value
  )
})

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  if (password.value.length < 6) {
    error.value = '비밀번호는 최소 6자 이상이어야 합니다.'
    return
  }

  loading.value = true
  error.value = null
  success.value = false

  const { error: err } = await signUp(email.value, password.value)

  if (err) {
    error.value = err.message || '회원가입에 실패했습니다.'
  } else {
    success.value = true
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  loading.value = false
}
</script>

<style scoped>
.register {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 2rem;
}

.register-container {
  background: #fff;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.register-form {
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
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.error-message {
  padding: 0.75rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  font-size: 0.9rem;
}

.success-message {
  padding: 0.75rem;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
  font-size: 0.9rem;
}

.btn-submit {
  background-color: #3498db;
  color: #fff;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-submit:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.register-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: #7f8c8d;
}

.register-footer a {
  color: #3498db;
  text-decoration: none;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>
