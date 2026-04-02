// Primitive value types that flow through the graph and script engine
export type PrimValue = string | number | boolean | null

// ── Script AST ──────────────────────────────────────────────────────────────

export type AstNode = Program | Statement | Expression

export interface Program {
    type: 'Program'
    body: Statement[]
}

export type Statement = EventHandler | SetStatement | ShowStatement | LogStatement | IfStatement

export interface EventHandler {
    type: 'EventHandler'
    event: string
    body: Statement[]
}

export interface SetStatement {
    type: 'SetStatement'
    variable: string
    value: Expression
}

export interface ShowStatement {
    type: 'ShowStatement'
    value: Expression
}

export interface LogStatement {
    type: 'LogStatement'
    value: Expression
}

export interface IfStatement {
    type: 'IfStatement'
    condition: Expression
    consequent: Statement[]
    alternate: Statement[]
}

export type Expression = BinaryExpression | UnaryExpression | CallExpression | Identifier | Literal

export interface BinaryExpression {
    type: 'BinaryExpression'
    operator: string
    left: Expression
    right: Expression
}

export interface UnaryExpression {
    type: 'UnaryExpression'
    operator: string
    argument: Expression
}

export interface CallExpression {
    type: 'CallExpression'
    callee: string
    args: Expression[]
}

export interface Identifier {
    type: 'Identifier'
    name: string
}

export interface Literal {
    type: 'Literal'
    value: PrimValue
}
