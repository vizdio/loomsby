import { supabase } from '../../lib/supabase'
import type { Board, Comment, ImageRecord, Post } from '../../lib/types'
import { imagesApi } from '../images/images.api'

async function listBoards(): Promise<Board[]> {
    const { data, error } = await supabase
        .from('boards')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as Board[]
}

async function getBoard(boardId: string): Promise<Board | null> {
    const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .maybeSingle()
    if (error) throw error
    return (data as Board | null) ?? null
}

async function listPosts(boardId: string): Promise<Post[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('*, post_images(image_id, images(*))')
        .eq('board_id', boardId)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((post) => {
        const postWithRelations = post as Post & {
            post_images?: Array<{ image_id: string; images?: ImageRecord }>
        }
        return {
            ...postWithRelations,
            images: (postWithRelations.post_images ?? []).map((row) => row.images).filter(Boolean),
        }
    }) as Post[]
}

async function createPost(
    boardId: string,
    title: string,
    content_md: string,
    imageIds: string[] = [],
): Promise<string> {
    const { data, error } = await supabase
        .from('posts')
        .insert({ board_id: boardId, title, content_md, image_url: null })
        .select('id')
        .single()
    if (error) throw error

    await imagesApi.attachImagesToPost(data.id, imageIds)
    return data.id
}

async function moderatePost(postId: string, action: 'delete' | 'pin' | 'lock'): Promise<void> {
    if (action === 'delete') {
        const { error } = await supabase.from('posts').delete().eq('id', postId)
        if (error) throw error
        return
    }

    const patch = action === 'pin' ? { pinned: true } : { locked: true }
    const { error } = await supabase.from('posts').update(patch).eq('id', postId)
    if (error) throw error
}

async function listComments(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
    if (error) throw error
    return (data ?? []) as Comment[]
}

async function createComment(postId: string, content_md: string): Promise<void> {
    const { error } = await supabase.from('comments').insert({ post_id: postId, content_md })
    if (error) throw error
}

export const boardsApi = {
    listBoards,
    getBoard,
    listPosts,
    createPost,
    moderatePost,
    listComments,
    createComment,
}
