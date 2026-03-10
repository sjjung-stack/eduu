-- 로그인 없이 게시글 작성 가능하도록 데이터베이스 수정

-- author_id를 nullable로 변경
ALTER TABLE posts 
ALTER COLUMN author_id DROP NOT NULL;

-- 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "Anyone can view published posts" ON posts;
DROP POLICY IF EXISTS "Authors can view their own posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

-- 새로운 RLS 정책: 모든 사용자가 읽기/쓰기 가능
CREATE POLICY "Anyone can view published posts"
  ON posts FOR SELECT
  USING (published = true);

CREATE POLICY "Anyone can view all posts in admin"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create posts"
  ON posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update posts"
  ON posts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete posts"
  ON posts FOR DELETE
  USING (true);
