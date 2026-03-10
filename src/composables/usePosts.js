import { ref } from 'vue'
import { supabase } from '../utils/supabase'

const posts = ref([])
const loading = ref(false)
const error = ref(null)

export function usePosts() {
  // 모든 게시글 조회 (최신순, 발행된 게시글만)
  const getPosts = async (includeUnpublished = false) => {
    loading.value = true
    error.value = null
    
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      // 발행된 게시글만 가져오기
      if (!includeUnpublished) {
        query = query.eq('published', true)
      }
      
      const { data, error: err } = await query
      
      if (err) throw err
      
      // author 정보는 클라이언트에서 직접 가져올 수 없으므로
      // author_id만 저장하고, 뷰에서 필요시 처리
      if (data) {
        data.forEach(post => {
          post.author = { email: '사용자' } // 기본값, 나중에 프로필 테이블 추가 가능
        })
      }
      
      posts.value = data || []
    } catch (e) {
      error.value = e.message || '게시글을 불러오는데 실패했습니다.'
      console.error('Error fetching posts:', e)
    } finally {
      loading.value = false
    }
  }

  // 특정 게시글 조회
  const getPost = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: err } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
      
      if (err) throw err
      
      // author 정보는 클라이언트에서 직접 가져올 수 없으므로
      // author_id만 저장하고, 뷰에서 필요시 처리
      if (data) {
        data.author = { email: '사용자' } // 기본값, 나중에 프로필 테이블 추가 가능
      }
      
      return { data, error: null }
    } catch (e) {
      error.value = e.message || '게시글을 불러오는데 실패했습니다.'
      console.error('Error fetching post:', e)
      return { data: null, error: e }
    } finally {
      loading.value = false
    }
  }

  // 게시글 생성 (인증 없이 가능)
  const createPost = async (title, slug, excerpt, content, published) => {
    loading.value = true
    error.value = null
    
    try {
      // 익명 사용자도 게시글 작성 가능 (author_id는 null)
      const { data, error: err } = await supabase
        .from('posts')
        .insert([
          {
            title,
            slug: slug || null,
            excerpt: excerpt || null,
            content,
            published: published || false,
            author_id: null // 익명 사용자
          }
        ])
        .select()
        .single()
      
      if (err) throw err
      
      return { data, error: null }
    } catch (e) {
      error.value = e.message || '게시글 작성에 실패했습니다.'
      console.error('Error creating post:', e)
      return { data: null, error: e }
    } finally {
      loading.value = false
    }
  }

  // 게시글 수정 (인증 없이 가능)
  const updatePost = async (id, title, slug, excerpt, content, published) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: err } = await supabase
        .from('posts')
        .update({
          title,
          slug: slug || null,
          excerpt: excerpt || null,
          content,
          published: published || false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (err) throw err
      
      if (!data) {
        throw new Error('게시글을 찾을 수 없습니다.')
      }
      
      return { data, error: null }
    } catch (e) {
      error.value = e.message || '게시글 수정에 실패했습니다.'
      console.error('Error updating post:', e)
      return { data: null, error: e }
    } finally {
      loading.value = false
    }
  }

  // 게시글 삭제 (인증 없이 가능)
  const deletePost = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const { error: err } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
      
      if (err) throw err
      
      return { error: null }
    } catch (e) {
      error.value = e.message || '게시글 삭제에 실패했습니다.'
      console.error('Error deleting post:', e)
      return { error: e }
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    loading,
    error,
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
  }
}
