# 교육신청 시스템 설정 가이드

## 1. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```
VITE_SUPABASE_URL=https://jbmnrhftufzwyivchfoh.supabase.co
VITE_SUPABASE_KEY=sb_publishable_nivAGdyh_Z-mcwzn1sPBqA_S6jasifz
```

## 2. Supabase 데이터베이스 설정

1. Supabase 대시보드에 로그인합니다.
2. SQL Editor로 이동합니다.
3. `supabase-schema.sql` 파일의 내용을 복사하여 실행합니다.

또는 Supabase 대시보드의 Table Editor에서 수동으로 테이블을 생성할 수 있습니다.

### 테이블 구조

#### courses 테이블
- `id` (uuid, primary key)
- `title` (text) - 교육 제목
- `description` (text) - 교육 설명
- `instructor` (text) - 강사명
- `start_date` (timestamptz) - 시작 일시
- `end_date` (timestamptz) - 종료 일시
- `capacity` (integer) - 정원
- `location` (text) - 장소
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### applications 테이블
- `id` (uuid, primary key)
- `course_id` (uuid, foreign key → courses.id)
- `user_id` (uuid, foreign key → auth.users.id)
- `status` (text) - 신청 상태 ('pending', 'confirmed', 'cancelled')
- `applied_at` (timestamptz)
- `created_at` (timestamptz)

## 3. 개발 서버 실행

```bash
npm install
npm run dev
```

## 4. 테스트 데이터 추가 (선택사항)

Supabase SQL Editor에서 다음 쿼리를 실행하여 테스트 교육 데이터를 추가할 수 있습니다:

```sql
INSERT INTO courses (title, description, instructor, start_date, end_date, capacity, location)
VALUES 
  ('Vue.js 기초', 'Vue.js의 기본 개념과 사용법을 학습합니다.', '홍길동', 
   NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '3 hours', 30, '온라인'),
  ('Supabase 활용', 'Supabase를 활용한 백엔드 개발 방법을 학습합니다.', '김철수', 
   NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '4 hours', 25, '회의실 A'),
  ('프론트엔드 최적화', '프론트엔드 성능 최적화 기법을 학습합니다.', '이영희', 
   NOW() + INTERVAL '21 days', NOW() + INTERVAL '21 days' + INTERVAL '5 hours', 20, '회의실 B');
```

## 주요 기능

- 사용자 인증 (회원가입/로그인)
- 교육 목록 조회
- 교육 상세 정보 보기
- 교육 신청
- 내 신청 내역 조회
- 신청 취소

## 보안

- Row Level Security (RLS) 정책으로 데이터 접근 제어
- 인증된 사용자만 신청 가능
- 사용자는 자신의 신청만 조회/수정 가능
