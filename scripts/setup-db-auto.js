import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = 'https://jbmnrhftufzwyivchfoh.supabase.co'
const supabaseKey = 'sb_publishable_nivAGdyh_Z-mcwzn1sPBqA_S6jasifz'

const supabase = createClient(supabaseUrl, supabaseKey)

// SQL 파일 읽기
const sqlFile = join(__dirname, '..', 'supabase-schema.sql')
const sqlContent = readFileSync(sqlFile, 'utf-8')

async function setupDatabase() {
  console.log('🚀 데이터베이스 자동 설정을 시도합니다...\n')

  // Supabase Management API를 사용하여 SQL 실행 시도
  // 참고: 일반 publishable key로는 DDL 실행이 불가능하므로
  // Supabase 대시보드에서 직접 실행해야 합니다.
  
  try {
    // 방법 1: RPC 함수를 통한 실행 (RPC 함수가 미리 생성되어 있어야 함)
    // 방법 2: REST API를 통한 직접 실행 (서비스 역할 키 필요)
    
    // 여기서는 테이블이 이미 존재하는지 확인하고, 없으면 안내
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id')
      .limit(1)

    if (coursesError) {
      if (coursesError.code === 'PGRST204' || coursesError.message.includes('relation') || coursesError.message.includes('does not exist')) {
        console.log('❌ courses 테이블이 아직 생성되지 않았습니다.\n')
        console.log('📋 다음 단계를 따라주세요:\n')
        console.log('1. 브라우저에서 https://supabase.com/dashboard 접속')
        console.log('2. 프로젝트 선택 (jbmnrhftufzwyivchfoh)')
        console.log('3. 좌측 메뉴에서 "SQL Editor" 클릭')
        console.log('4. "New query" 클릭')
        console.log('5. 아래 SQL을 복사하여 붙여넣고 "Run" 버튼 클릭:\n')
        console.log('─'.repeat(70))
        console.log(sqlContent)
        console.log('─'.repeat(70))
        console.log('\n✅ SQL 실행 후 이 스크립트를 다시 실행하세요: npm run db:setup-auto\n')
        process.exit(1)
      } else {
        throw coursesError
      }
    }

    console.log('✅ courses 테이블이 이미 존재합니다!')
    
    // applications 테이블 확인
    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select('id')
      .limit(1)

    if (appsError) {
      if (appsError.code === 'PGRST204' || appsError.message.includes('relation') || appsError.message.includes('does not exist')) {
        console.log('❌ applications 테이블이 아직 생성되지 않았습니다.')
        console.log('   위의 SQL을 Supabase SQL Editor에서 실행하세요.')
        process.exit(1)
      } else {
        throw appsError
      }
    }

    console.log('✅ applications 테이블이 이미 존재합니다!')
    console.log('\n🎉 데이터베이스 설정이 완료되었습니다!')
    console.log('\n💡 테스트 데이터를 추가하려면: npm run db:test-data\n')
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message)
    console.error('\n💡 Supabase 대시보드에서 SQL을 직접 실행하세요.')
    process.exit(1)
  }
}

setupDatabase()
