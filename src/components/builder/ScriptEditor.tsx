interface ScriptEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function ScriptEditor({ value, onChange, placeholder }: ScriptEditorProps) {
    return (
        <div className="script-editor">
            <div className="script-editor__hint">LoomScript</div>
            <textarea
                className="script-editor__textarea"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                spellCheck={false}
                placeholder={
                    placeholder ?? 'on load\n  set result to input * 2\n  show result\nend'
                }
                rows={10}
            />
        </div>
    )
}
