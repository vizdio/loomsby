import { supabase } from '../../lib/supabase'
import type { ChatMessage, ChatThread } from '../../lib/types'

async function listThreads(userId: string): Promise<ChatThread[]> {
    const { data, error } = await supabase
        .from('chat_threads')
        .select('*')
        .or(`user_a.eq.${userId},user_b.eq.${userId}`)
        .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as ChatThread[]
}

async function listMessages(threadId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })
    if (error) throw error
    return (data ?? []) as ChatMessage[]
}

async function sendMessage(threadId: string, content: string, image_url?: string): Promise<void> {
    const { error } = await supabase
        .from('chat_messages')
        .insert({ thread_id: threadId, content, image_url: image_url ?? null })
    if (error) throw error
}

async function markThreadRead(threadId: string): Promise<void> {
    const { error } = await supabase
        .from('chat_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('thread_id', threadId)
        .is('read_at', null)
    if (error) throw error
}

async function setTyping(threadId: string, isTyping: boolean): Promise<void> {
    const { error } = await supabase
        .from('chat_typing')
        .upsert({ thread_id: threadId, is_typing: isTyping })
    if (error) throw error
}

export const chatApi = {
    listThreads,
    listMessages,
    sendMessage,
    markThreadRead,
    setTyping,
}
