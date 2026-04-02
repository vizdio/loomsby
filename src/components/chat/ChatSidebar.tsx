import { useQuery } from '@tanstack/react-query'
import { chatApi } from '../../features/chat/chat.api'

interface ChatSidebarProps {
    userId: string
    selectedThreadId: string | null
    onSelectThread: (threadId: string) => void
}

export function ChatSidebar({ userId, selectedThreadId, onSelectThread }: ChatSidebarProps) {
    const { data } = useQuery({
        queryKey: ['threads', userId],
        queryFn: () => chatApi.listThreads(userId),
        enabled: Boolean(userId),
    })

    return (
        <aside className="card stack">
            <h3>Threads</h3>
            {(data ?? []).map((thread) => (
                <button
                    key={thread.id}
                    className={thread.id === selectedThreadId ? 'active' : 'btn-secondary'}
                    onClick={() => onSelectThread(thread.id)}
                >
                    {thread.id}
                </button>
            ))}
        </aside>
    )
}
