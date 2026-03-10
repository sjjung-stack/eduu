import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// SQL 파일 읽기
const sqlFile = join(__dirname, '..', 'supabase-blog-migration.sql')
let sqlContent
try {
  sqlContent = readFileSync(sqlFile, 'utf-8')
} catch (error) {
  console.error('❌ SQL 파일을 읽을 수 없습니다:', sqlFile)
  process.exit(1)
}

async function runMigration() {
  console.log('🚀 블로그 마이그레이션 SQL을 실행합니다...\n')
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
  console.log('\n💡 이 마이그레이션은 기존 posts 테이블에 다음 컬럼을 추가합니다:')
  console.log('   - published (BOOLEAN, 기본값: false)')
  console.log('   - slug (TEXT, UNIQUE)')
  console.log('   - excerpt (TEXT)')
}

runMigration()
