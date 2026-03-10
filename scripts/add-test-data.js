import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jbmnrhftufzwyivchfoh.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_KEY || 'sb_publishable_nivAGdyh_Z-mcwzn1sPBqA_S6jasifz'

const supabase = createClient(supabaseUrl, supabaseKey)

async function addTestData() {
  console.log('🚀 테스트 데이터 추가를 시작합니다...\n')

  const testCourses = [
    {
      title: 'Vue.js 기초',
      description: 'Vue.js의 기본 개념과 사용법을 학습합니다.',
      instructor: '홍길동',
      start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
      capacity: 30,
      location: '온라인'
    },
    {
      title: 'Supabase 활용',
      description: 'Supabase를 활용한 백엔드 개발 방법을 학습합니다.',
      instructor: '김철수',
      start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
      capacity: 25,
      location: '회의실 A'
    },
    {
      title: '프론트엔드 최적화',
      description: '프론트엔드 성능 최적화 기법을 학습합니다.',
      instructor: '이영희',
      start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
      capacity: 20,
      location: '회의실 B'
    }
  ]

  try {
    const { data, error } = await supabase
      .from('courses')
      .insert(testCourses)
      .select()

    if (error) {
      console.error('❌ 오류 발생:', error.message)
      if (error.code === 'PGRST204' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.error('\n💡 courses 테이블이 아직 생성되지 않았습니다.')
        console.error('   먼저 supabase-schema.sql을 Supabase SQL Editor에서 실행하세요.')
      }
      process.exit(1)
    }

    console.log('✅ 테스트 데이터가 성공적으로 추가되었습니다!\n')
    console.log('추가된 교육:')
    data.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} (${course.instructor})`)
    })
    console.log('\n🎉 이제 애플리케이션에서 교육 목록을 확인할 수 있습니다!')
  } catch (error) {
    console.error('❌ 예상치 못한 오류:', error.message)
    process.exit(1)
  }
}

addTestData()
