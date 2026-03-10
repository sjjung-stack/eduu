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
const sqlFile = join(__dirname, '..', 'supabase-blog-schema.sql')
let sqlContent
try {
  sqlContent = readFileSync(sqlFile, 'utf-8')
} catch (error) {
  console.error('❌ SQL 파일을 읽을 수 없습니다:', sqlFile)
  process.exit(1)
}

async function setupDatabase() {
  console.log('🚀 블로그 데이터베이스 설정을 시작합니다...\n')
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
-- 테스트 데이터 추가 (로그인 후 사용자 ID를 확인하여 author_id에 입력)
-- 예시: INSERT INTO posts (title, content, author_id)
-- VALUES ('첫 번째 게시글', '이것은 테스트 게시글입니다.', 'YOUR_USER_ID_HERE');
`
  console.log(testDataSQL)
}

setupDatabase()
