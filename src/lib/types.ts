export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type ImageContext = 'chat' | 'board' | 'profile' | 'builder'

export interface ImageRecord {
    id: string
    user_id: string
    bucket: string
    path: string
    url: string
    thumbnail_url: string | null
    context: ImageContext
    created_at: string
}

export interface Profile {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    created_at: string
}

export interface Pal {
    id: string
    requester_id: string
    addressee_id: string
    status: 'pending' | 'accepted' | 'blocked'
    created_at: string
}

export interface Board {
    id: string
    owner_id: string
    title: string
    description: string | null
    is_locked: boolean
    created_at: string
}

export interface Post {
    id: string
    board_id: string
    author_id: string
    title: string
    content_md: string
    image_url: string | null
    images?: ImageRecord[]
    pinned: boolean
    locked: boolean
    created_at: string
}

export interface Comment {
    id: string
    post_id: string
    author_id: string
    content_md: string
    created_at: string
}

export interface ChatThread {
    id: string
    user_a: string
    user_b: string
    created_at: string
}

export interface ChatMessage {
    id: string
    thread_id: string
    sender_id: string
    content: string
    image_url: string | null
    image_id?: string | null
    image?: ImageRecord | null
    read_at: string | null
    created_at: string
}

export interface NodeGraph {
    id: string
    owner_id: string
    name: string
    graph: {
        nodes: Json[]
        edges: Json[]
    }
    updated_at: string
}

export interface ImageUploadResult {
    image: ImageRecord
    signedUrl: string
}
