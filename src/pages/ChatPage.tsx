import { useState } from 'react'
import { ChatSidebar } from '../components/chat/ChatSidebar'
import { ChatWindow } from '../components/chat/ChatWindow'
import { useAuth } from '../hooks/useAuth'

export function ChatPage() {
    const [threadId, setThreadId] = useState<string | null>(null)
    const { user } = useAuth()

    if (!user) {
        return <main className="page">Please login to access chat.</main>
    }

    return (
        <main className="page split">
            <ChatSidebar
                userId={user.id}
                selectedThreadId={threadId}
                onSelectThread={setThreadId}
            />
            <ChatWindow threadId={threadId} userId={user.id} />
        </main>
    )
}
