import { useState } from 'react'
import { BoardList } from '../components/boards/BoardList'
import { BoardView } from '../components/boards/BoardView'

export function BoardsPage() {
    const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)

    return (
        <main className="page split">
            <BoardList selectedBoardId={selectedBoardId} onSelectBoard={setSelectedBoardId} />
            <BoardView boardId={selectedBoardId} />
        </main>
    )
}
