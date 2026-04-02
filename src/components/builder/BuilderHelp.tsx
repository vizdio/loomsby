import { useState } from 'react'

export function BuilderHelpButton() {
    const [open, setOpen] = useState(false)
    return (
        <>
            <button
                className="btn-secondary help-btn"
                onClick={() => setOpen(true)}
                title="Builder help & LoomScript reference"
            >
                ? Help
            </button>
            {open && <BuilderHelpModal onClose={() => setOpen(false)} />}
        </>
    )
}

function BuilderHelpModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="help-backdrop" onClick={onClose}>
            <div className="help-modal" onClick={(e) => e.stopPropagation()}>
                <div className="help-modal__header">
                    <h2>Builder Reference</h2>
                    <button className="btn-secondary help-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="help-modal__body">
                    {/* ── Workflow ──────────────────────────────── */}
                    <section>
                        <h3>Workflow</h3>
                        <ol>
                            <li>
                                <strong>Add nodes</strong> from the palette on the left.
                            </li>
                            <li>
                                <strong>Connect nodes</strong> by dragging from an output handle
                                (right side) to an input handle (left side).
                            </li>
                            <li>
                                <strong>Edit</strong> a node by clicking it — its properties appear
                                in the right sidebar.
                            </li>
                            <li>
                                <strong>Write scripts</strong> in the LoomScript editor that appears
                                for nodes that support it.
                            </li>
                            <li>
                                Press <kbd>▶ Run</kbd> to execute the graph. Results appear inline
                                on each node and in the sidebar.
                            </li>
                            <li>
                                Press <kbd>💾 Save</kbd> to persist the graph to your account.
                            </li>
                        </ol>
                    </section>

                    {/* ── Node types ────────────────────────────── */}
                    <section>
                        <h3>Node Types</h3>
                        <table className="help-table">
                            <thead>
                                <tr>
                                    <th>Node</th>
                                    <th>Handles</th>
                                    <th>Purpose</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <span
                                            className="help-dot"
                                            style={{ background: '#4f86c6' }}
                                        />
                                        Input
                                    </td>
                                    <td>→ value</td>
                                    <td>
                                        Static text or number injected into the graph. Set the value
                                        in the sidebar.
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span
                                            className="help-dot"
                                            style={{ background: '#7b5ea7' }}
                                        />
                                        Logic
                                    </td>
                                    <td>input → output</td>
                                    <td>
                                        Runs a LoomScript. Use <code>set output to …</code> to pass
                                        a value downstream.
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span
                                            className="help-dot"
                                            style={{ background: '#3e9b6b' }}
                                        />
                                        Display
                                    </td>
                                    <td>value →</td>
                                    <td>
                                        Shows the incoming value and any <code>show</code> calls
                                        from scripts.
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span
                                            className="help-dot"
                                            style={{ background: '#e07b54' }}
                                        />
                                        Output
                                    </td>
                                    <td>value →</td>
                                    <td>
                                        Marks the final exit value of the graph. Shown in the
                                        sidebar after execution.
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span
                                            className="help-dot"
                                            style={{ background: '#c9a227' }}
                                        />
                                        Event
                                    </td>
                                    <td>→ trigger</td>
                                    <td>
                                        Fires a named event (<em>load</em> by default) that scripts
                                        attached to downstream nodes can respond to with{' '}
                                        <code>on load … end</code>.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* ── LoomScript reference ─────────────────── */}
                    <section>
                        <h3>LoomScript Reference</h3>
                        <p>
                            LoomScript is a line-oriented scripting language inspired by HyperTalk.
                            Scripts run inside a node when the graph executes. Each statement
                            occupies one line; indentation is optional.
                        </p>

                        <h4>Event handlers</h4>
                        <p>
                            All executable code must live inside an <code>on … end</code> block. The{' '}
                            <code>load</code> event fires automatically when a node executes.
                        </p>
                        <pre className="help-code">{`on load
  set x to 42
  show x
end`}</pre>

                        <h4>Statements</h4>
                        <table className="help-table">
                            <thead>
                                <tr>
                                    <th>Statement</th>
                                    <th>Effect</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <code>set &lt;name&gt; to &lt;expr&gt;</code>
                                    </td>
                                    <td>Assign a value to a variable.</td>
                                </tr>
                                <tr>
                                    <td>
                                        <code>show &lt;expr&gt;</code>
                                    </td>
                                    <td>
                                        Emit a line of output visible on the Display node and in the
                                        sidebar.
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <code>log &lt;expr&gt;</code>
                                    </td>
                                    <td>
                                        Write a line to the execution log (visible in the sidebar
                                        after run).
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <code>if &lt;cond&gt;</code> … <code>else</code> …{' '}
                                        <code>end</code>
                                    </td>
                                    <td>
                                        Conditional branch. The <code>else</code> clause is
                                        optional.
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <h4>Expressions</h4>
                        <table className="help-table">
                            <thead>
                                <tr>
                                    <th>Syntax</th>
                                    <th>Example</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Number literal</td>
                                    <td>
                                        <code>3.14</code>
                                    </td>
                                </tr>
                                <tr>
                                    <td>String literal</td>
                                    <td>
                                        <code>"hello world"</code>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Boolean</td>
                                    <td>
                                        <code>true</code> / <code>false</code>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Arithmetic (<code>+ - * /</code>)
                                    </td>
                                    <td>
                                        <code>x * 2 + 1</code>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Comparison (<code>= != &lt; &gt; &lt;= &gt;=</code>)
                                    </td>
                                    <td>
                                        <code>score &gt;= 100</code>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Logic (<code>and</code> / <code>or</code> / <code>not</code>
                                        )
                                    </td>
                                    <td>
                                        <code>x &gt; 0 and y &gt; 0</code>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Function call</td>
                                    <td>
                                        <code>concat("hi", " ", name)</code>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <h4>Built-in functions</h4>
                        <table className="help-table">
                            <thead>
                                <tr>
                                    <th>Function</th>
                                    <th>Returns</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['random()', 'Random float between 0 and 1'],
                                    ['floor(n)', 'Largest integer ≤ n'],
                                    ['ceil(n)', 'Smallest integer ≥ n'],
                                    ['abs(n)', 'Absolute value'],
                                    ['max(a, b)', 'Larger of a and b'],
                                    ['min(a, b)', 'Smaller of a and b'],
                                    ['number(x)', 'Coerce x to a number'],
                                    ['string(x)', 'Coerce x to a string'],
                                    ['concat(a, b, …)', 'Join strings'],
                                    ['length(s)', 'Character count of string s'],
                                    ['show(x)', 'Emit output (same as show statement)'],
                                    ['log(x)', 'Emit log line (same as log statement)'],
                                ].map(([fn, desc]) => (
                                    <tr key={fn}>
                                        <td>
                                            <code>{fn}</code>
                                        </td>
                                        <td>{desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h4>Reading upstream values</h4>
                        <p>
                            The value arriving at a node's input handle is available as the variable{' '}
                            <code>input</code>. For a Logic node, setting <code>output</code> passes
                            that value to connected downstream nodes.
                        </p>
                        <pre className="help-code">{`on load
  -- double the incoming value
  set output to number(input) * 2
end`}</pre>

                        <h4>Comments</h4>
                        <p>
                            Lines beginning with <code>#</code> or <code>--</code> are ignored.
                        </p>
                        <pre className="help-code">{`on load
  # this is a comment
  -- so is this
  set x to 1
end`}</pre>
                    </section>

                    {/* ── Keyboard shortcuts ────────────────────── */}
                    <section>
                        <h3>Canvas Shortcuts</h3>
                        <table className="help-table">
                            <tbody>
                                <tr>
                                    <td>
                                        <kbd>Backspace</kbd> / <kbd>Delete</kbd>
                                    </td>
                                    <td>Remove selected node or edge</td>
                                </tr>
                                <tr>
                                    <td>Scroll wheel</td>
                                    <td>Zoom in / out</td>
                                </tr>
                                <tr>
                                    <td>Click + drag canvas</td>
                                    <td>Pan</td>
                                </tr>
                                <tr>
                                    <td>Click node</td>
                                    <td>Select &amp; open properties</td>
                                </tr>
                                <tr>
                                    <td>Click empty canvas</td>
                                    <td>Deselect / close sidebar</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
        </div>
    )
}
