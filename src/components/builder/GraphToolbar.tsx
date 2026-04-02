export function GraphToolbar({ onExecute, onSave }: { onExecute: () => void; onSave: () => void }) {
  return (
    <div className="row gap-sm">
      <button className="btn-secondary" onClick={onExecute}>Run Flow</button>
      <button onClick={onSave}>Save Graph</button>
    </div>
  )
}
