import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pkg from 'pg'
const { Client } = pkg
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jbmnrhftufzwyivchfoh.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_KEY || 'sb_publishable_nivAGdyh_Z-mcwzn1sPBqA_S6jasifz'

// Supabase 클라이언트 생성 (테이블 확인용)
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

async function checkTablesExist() {
  try {
    // courses 테이블 확인
    const { error: coursesError } = await supabase
      .from('courses')
      .select('id')
      .limit(1)

    if (coursesError && (coursesError.code === 'PGRST204' || coursesError.message.includes('relation') || coursesError.message.includes('does not exist'))) {
      return false
    }

    // applications 테이블 확인
    const { error: appsError } = await supabase
      .from('applications')
      .select('id')
      .limit(1)

    if (appsError && (appsError.code === 'PGRST204' || appsError.message.includes('relation') || appsError.message.includes('does not exist'))) {
      return false
    }

    return true
  } catch (error) {
    return false
  }
}

async function setupDatabaseWithPostgres() {
  console.log('🚀 PostgreSQL 연결을 통한 데이터베이스 설정을 시도합니다...\n')

  // Supabase PostgreSQL 연결 정보
  // 참고: 실제 연결을 위해서는 Supabase 대시보드에서 Database Password가 필요합니다
  const dbHost = supabaseUrl.replace('https://', '').replace('.supabase.co', '')
  const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL

  if (!dbUrl) {
    console.log('⚠️  PostgreSQL 연결 문자열이 없습니다.')
    console.log('📋 Supabase 대시보드에서 직접 SQL을 실행해야 합니다.\n')
    console.log('다음 단계를 따라주세요:\n')
    console.log('1. https://supabase.com/dashboard 접속')
    console.log('2. 프로젝트 선택')
    console.log('3. 좌측 메뉴에서 "SQL Editor" 클릭')
    console.log('4. "New query" 클릭')
    console.log('5. 아래 SQL을 복사하여 붙여넣고 "Run" 버튼 클릭:\n')
    console.log('─'.repeat(70))
    console.log(sqlContent)
    console.log('─'.repeat(70))
    console.log('\n💡 또는 환경 변수에 SUPABASE_DB_URL을 설정하면 자동으로 실행할 수 있습니다.')
    console.log('   형식: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres\n')
    
    // 테이블 존재 여부 확인
    const tablesExist = await checkTablesExist()
    if (tablesExist) {
      console.log('✅ 테이블이 이미 존재하는 것으로 확인되었습니다!')
      console.log('💡 테스트 데이터를 추가하려면: npm run db:test-data\n')
      return
    }
    
    process.exit(1)
  }

  // PostgreSQL 클라이언트 생성
  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    await client.connect()
    console.log('✅ PostgreSQL 연결 성공!\n')

    // SQL 문들을 세미콜론으로 분리하여 실행
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 ${statements.length}개의 SQL 문을 실행합니다...\n`)

    for (let i = 0; i < statements.length; i++) {
      const sql = statements[i]
      if (!sql || sql.startsWith('--')) continue

      try {
        await client.query(sql)
        console.log(`✅ SQL 문 ${i + 1}/${statements.length} 실행 완료`)
      } catch (err) {
        // 이미 존재하는 객체는 무시
        if (err.message.includes('already exists') || err.message.includes('duplicate')) {
          console.log(`⚠️  SQL 문 ${i + 1}/${statements.length} - 이미 존재함 (무시)`)
        } else {
          console.log(`⚠️  SQL 문 ${i + 1}/${statements.length} 실행 중 오류:`, err.message)
        }
      }
    }

    console.log('\n✅ 데이터베이스 설정이 완료되었습니다!')
    console.log('💡 테스트 데이터를 추가하려면: npm run db:test-data\n')

  } catch (error) {
    console.error('❌ PostgreSQL 연결 오류:', error.message)
    console.error('\n💡 Supabase 대시보드의 SQL Editor에서 직접 실행하세요.')
    process.exit(1)
  } finally {
    await client.end()
  }
}

async function main() {
  // 먼저 테이블이 이미 존재하는지 확인
  const tablesExist = await checkTablesExist()
  
  if (tablesExist) {
    console.log('✅ 데이터베이스 테이블이 이미 존재합니다!')
    console.log('💡 테스트 데이터를 추가하려면: npm run db:test-data\n')
    return
  }

  // PostgreSQL 연결을 통한 자동 설정 시도
  await setupDatabaseWithPostgres()
}

main()
