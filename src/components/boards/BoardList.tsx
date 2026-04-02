import { useQuery } from '@tanstack/react-query'
import { boardsApi } from '../../features/boards/boards.api'

interface BoardListProps {
    selectedBoardId: string | null
    onSelectBoard: (boardId: string) => void
}

export function BoardList({ selectedBoardId, onSelectBoard }: BoardListProps) {
    const { data } = useQuery({ queryKey: ['boards'], queryFn: boardsApi.listBoards })

    return (
        <section className="card stack">
            <h3>Board List</h3>
            {(data ?? []).map((board) => (
                <button
                    key={board.id}
                    className={board.id === selectedBoardId ? 'active' : 'btn-secondary'}
                    onClick={() => onSelectBoard(board.id)}
                >
                    {board.title}
                </button>
            ))}
        </section>
    )
}
