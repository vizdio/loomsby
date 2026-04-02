import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { chatApi } from '../../features/chat/chat.api'
import { useRealtimeChannel } from '../../hooks/useRealtimeChannel'
import { messageSchema } from '../../lib/validators'
import { MessageBubble } from './MessageBubble'
import { z } from 'zod'
import { supabase } from '../../lib/supabase'

const typingSchema = z.object({ content: z.string().optional() })

interface ChatWindowProps {
  threadId: string | null
  userId: string
}

export function ChatWindow({ threadId, userId }: ChatWindowProps) {
  const [draft, setDraft] = useState('')
  const [peerTyping, setPeerTyping] = useState(false)

  const { data, refetch } = useQuery({
    queryKey: ['messages', threadId],
    queryFn: () => chatApi.listMessages(threadId ?? ''),
    enabled: Boolean(threadId),
  })

  useRealtimeChannel(
    () =>
      supabase
        .channel(`chat:${threadId ?? 'none'}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages', filter: `thread_id=eq.${threadId}` }, () => {
          void refetch()
        })
        .on('broadcast', { event: 'typing' }, (payload) => {
          const parsed = typingSchema.safeParse(payload.payload)
          if (!parsed.success) return
          setPeerTyping(Boolean(parsed.data.content))
        }),
    [threadId, refetch],
  )

  if (!threadId) {
    return <section className="card">Choose a thread to chat.</section>
  }

  return (
    <section className="card stack">
      <h3>Chat</h3>
      <div className="stack">
        {(data ?? []).map((message) => (
          <MessageBubble key={message.id} message={message} isMine={message.sender_id === userId} />
        ))}
      </div>
      {peerTyping && <p className="muted-text">Typing...</p>}
      <form
        className="row gap-sm"
        onSubmit={async (event) => {
          event.preventDefault()
          const parsed = messageSchema.safeParse({ content: draft })
          if (!parsed.success) return
          await chatApi.sendMessage(threadId, parsed.data.content)
          setDraft('')
          await chatApi.markThreadRead(threadId)
          await refetch()
        }}
      >
        <input
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value)
            void supabase.channel(`chat:${threadId}`).send({
              type: 'broadcast',
              event: 'typing',
              payload: { content: event.target.value },
            })
          }}
          placeholder="Message"
        />
        <button type="submit">Send</button>
      </form>
    </section>
  )
}
