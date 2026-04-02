interface GraphToolbarProps {
    onExecute: () => void
    onSave: () => void
    onUndo: () => void
    onRedo: () => void
    isRunning: boolean
}

export function GraphToolbar({ onExecute, onSave, onUndo, onRedo, isRunning }: GraphToolbarProps) {
    return (
        <div className="row gap-sm builder-toolbar">
            <button className="btn-secondary" onClick={onUndo} title="Undo (Ctrl+Z)">
                ↩ Undo
            </button>
            <button className="btn-secondary" onClick={onRedo} title="Redo (Ctrl+Y)">
                ↪ Redo
            </button>
            <span className="toolbar-separator" />
            <button
                className="btn-primary"
                onClick={onExecute}
                disabled={isRunning}
                title="Execute the graph"
            >
                {isRunning ? '⏳ Running…' : '▶ Run'}
            </button>
            <button className="btn-secondary" onClick={onSave} title="Save graph to Supabase">
                💾 Save
            </button>
        </div>
    )
}
