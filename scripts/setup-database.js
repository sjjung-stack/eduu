import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 환경 변수에서 Supabase 설정 읽기
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jbmnrhftufzwyivchfoh.supabase.co'
// 서비스 역할 키가 필요합니다 (환경 변수에서 읽거나 직접 입력)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_KEY

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY 환경 변수가 필요합니다.')
  console.error('   Supabase 대시보드 > Settings > API > service_role key를 사용하세요.')
  process.exit(1)
}

// 서비스 역할 키로 클라이언트 생성 (관리자 권한)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// SQL 파일 읽기
const sqlFile = join(__dirname, '..', 'supabase-schema.sql')
let sqlContent
try {
  sqlContent = readFileSync(sqlFile, 'utf-8')
} catch (error) {
  console.error('❌ SQL 파일을 읽을 수 없습니다:', sqlFile)
  process.exit(1)
}

// SQL 문들을 세미콜론으로 분리 (간단한 파싱)
const sqlStatements = sqlContent
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'))

async function setupDatabase() {
  console.log('🚀 데이터베이스 설정을 시작합니다...\n')

  try {
    // 각 SQL 문 실행
    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i]
      if (!sql || sql.startsWith('--')) continue

      try {
        // Supabase의 RPC를 통해 SQL 실행 (PostgreSQL 함수 사용)
        // 또는 직접 REST API 호출
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })
        
        if (error) {
          // RPC가 없을 경우 다른 방법 시도
          console.log(`⚠️  SQL 문 ${i + 1} 실행 중 오류 (무시 가능):`, error.message)
        } else {
          console.log(`✅ SQL 문 ${i + 1} 실행 완료`)
        }
      } catch (err) {
        console.log(`⚠️  SQL 문 ${i + 1} 실행 중 오류 (무시 가능):`, err.message)
      }
    }

    console.log('\n✅ 데이터베이스 설정이 완료되었습니다!')
    console.log('\n📝 참고: Supabase Management API 제한으로 인해 일부 SQL이 실행되지 않았을 수 있습니다.')
    console.log('   Supabase 대시보드의 SQL Editor에서 supabase-schema.sql 파일을 직접 실행하는 것을 권장합니다.')
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message)
    console.error('\n💡 대안: Supabase 대시보드의 SQL Editor에서 supabase-schema.sql 파일을 직접 실행하세요.')
    process.exit(1)
  }
}

setupDatabase()
