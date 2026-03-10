import { ref, computed } from 'vue'
import { supabase } from '../utils/supabase'

const user = ref(null)
const session = ref(null)

// 세션 초기화
supabase.auth.getSession().then(({ data }) => {
  session.value = data.session
  user.value = data.session?.user ?? null
})

// 인증 상태 변경 리스너
supabase.auth.onAuthStateChange((_event, _session) => {
  session.value = _session
  user.value = _session?.user ?? null
})

export function useAuth() {
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const isAuthenticated = computed(() => !!user.value)

  return {
    user,
    session,
    signUp,
    signIn,
    signOut,
    isAuthenticated,
  }
}
