import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 환경 변수에서 Supabase 설정 읽기
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jbmnrhftufzwyivchfoh.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_KEY || 'sb_publishable_nivAGdyh_Z-mcwzn1sPBqA_S6jasifz'

const supabase = createClient(supabaseUrl, supabaseKey)

// SQL 파일 읽기
const sqlFile = join(__dirname, '..', 'supabase-schema.sql')
let sqlContent
try {
  sqlContent = readFileSync(sqlFile, 'utf-8')
} catch (error) {
  console.error('❌ SQL 파일을 읽을 수 없습니다:', sqlFile)
  process.exit(1)
}

async function setupDatabase() {
  console.log('🚀 데이터베이스 설정을 시작합니다...\n')
  console.log('📋 Supabase 대시보드에서 SQL을 실행하는 방법:\n')
  console.log('1. https://supabase.com/dashboard 접속')
  console.log('2. 프로젝트 선택')
  console.log('3. 좌측 메뉴에서 "SQL Editor" 클릭')
  console.log('4. "New query" 클릭')
  console.log('5. 아래 SQL을 복사하여 붙여넣고 실행:\n')
  console.log('─'.repeat(60))
  console.log(sqlContent)
  console.log('─'.repeat(60))
  console.log('\n✅ 위 SQL을 Supabase SQL Editor에서 실행하세요.')
  console.log('\n💡 또는 다음 명령어로 테스트 데이터를 추가할 수 있습니다:\n')
  
  const testDataSQL = `
-- 테스트 데이터 추가
INSERT INTO courses (title, description, instructor, start_date, end_date, capacity, location)
VALUES 
  ('Vue.js 기초', 'Vue.js의 기본 개념과 사용법을 학습합니다.', '홍길동', 
   NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '3 hours', 30, '온라인'),
  ('Supabase 활용', 'Supabase를 활용한 백엔드 개발 방법을 학습합니다.', '김철수', 
   NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '4 hours', 25, '회의실 A'),
  ('프론트엔드 최적화', '프론트엔드 성능 최적화 기법을 학습합니다.', '이영희', 
   NOW() + INTERVAL '21 days', NOW() + INTERVAL '21 days' + INTERVAL '5 hours', 20, '회의실 B')
ON CONFLICT DO NOTHING;
`
  console.log(testDataSQL)
}

setupDatabase()
