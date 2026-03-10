import { createClient } from '@supabase/supabase-js'

// 환경 변수에서 가져오거나 기본값 사용
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || 'https://jbmnrhftufzwyivchfoh.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY?.trim() || 'sb_publishable_nivAGdyh_Z-mcwzn1sPBqA_S6jasifz'

// 빌드 시 환경 변수가 없으면 빈 문자열이 될 수 있으므로 명시적으로 체크
const finalUrl = supabaseUrl && supabaseUrl !== 'undefined' ? supabaseUrl : 'https://jbmnrhftufzwyivchfoh.supabase.co'
const finalKey = supabaseKey && supabaseKey !== 'undefined' ? supabaseKey : 'sb_publishable_nivAGdyh_Z-mcwzn1sPBqA_S6jasifz'

if (!finalUrl || !finalKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다.', { finalUrl, finalKey })
}

export const supabase = createClient(finalUrl, finalKey)
