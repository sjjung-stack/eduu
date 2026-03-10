-- posts 테이블에 published 컬럼 추가 (이미 테이블이 생성된 경우 사용)

-- published 컬럼 추가
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

-- slug 컬럼 추가 (없는 경우)
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- excerpt 컬럼 추가 (없는 경우)
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- published 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);

-- slug 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- 기존 RLS 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Anyone can view posts" ON posts;

-- 새로운 RLS 정책 생성
CREATE POLICY "Anyone can view published posts"
  ON posts FOR SELECT
  USING (published = true);
  
CREATE POLICY "Authors can view their own posts"
  ON posts FOR SELECT
  USING (auth.uid() = author_id);
