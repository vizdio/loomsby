import type { Program, Statement, Expression, PrimValue } from './types'

export class ScriptError extends Error {}

export interface ScriptContext {
    variables: Map<string, PrimValue>
    handlers: Map<string, () => void>
    outputs: string[]
    logs: string[]
    inputs: Record<string, PrimValue>
}

export function createContext(inputs: Record<string, PrimValue> = {}): ScriptContext {
    return {
        variables: new Map(),
        handlers: new Map(),
        outputs: [],
        logs: [],
        inputs,
    }
}

/** Register event handlers by walking top-level EventHandler nodes. */
export function interpret(program: Program, ctx: ScriptContext): void {
    for (const stmt of program.body) {
        execStatement(stmt, ctx)
    }
}

/** Invoke a named event handler if one is registered. */
export function triggerEvent(event: string, ctx: ScriptContext): void {
    const handler = ctx.handlers.get(event)
    if (handler) handler()
}

function execStatement(stmt: Statement, ctx: ScriptContext): void {
    switch (stmt.type) {
        case 'EventHandler': {
            ctx.handlers.set(stmt.event, () => {
                for (const s of stmt.body) execStatement(s, ctx)
            })
            break
        }
        case 'SetStatement': {
            ctx.variables.set(stmt.variable, evalExpr(stmt.value, ctx))
            break
        }
        case 'ShowStatement': {
            ctx.outputs.push(String(evalExpr(stmt.value, ctx) ?? ''))
            break
        }
        case 'LogStatement': {
            ctx.logs.push(String(evalExpr(stmt.value, ctx) ?? ''))
            break
        }
        case 'IfStatement': {
            if (isTruthy(evalExpr(stmt.condition, ctx))) {
                for (const s of stmt.consequent) execStatement(s, ctx)
            } else {
                for (const s of stmt.alternate) execStatement(s, ctx)
            }
            break
        }
    }
}

function evalExpr(expr: Expression, ctx: ScriptContext): PrimValue {
    switch (expr.type) {
        case 'Literal':
            return expr.value
        case 'Identifier': {
            if (ctx.variables.has(expr.name)) return ctx.variables.get(expr.name) ?? null
            if (expr.name in ctx.inputs) return ctx.inputs[expr.name] ?? null
            return null
        }
        case 'CallExpression': {
            const args = expr.args.map((a) => evalExpr(a, ctx))
            return callBuiltin(expr.callee, args, ctx)
        }
        case 'UnaryExpression': {
            const arg = evalExpr(expr.argument, ctx)
            if (expr.operator === 'not') return !isTruthy(arg)
            if (expr.operator === '-') return -(arg as number)
            return arg
        }
        case 'BinaryExpression': {
            return evalBinary(expr.operator, expr.left, expr.right, ctx)
        }
    }
}

function evalBinary(
    op: string,
    leftExpr: Expression,
    rightExpr: Expression,
    ctx: ScriptContext,
): PrimValue {
    // Short-circuit logical operators
    if (op === 'and') return isTruthy(evalExpr(leftExpr, ctx)) && isTruthy(evalExpr(rightExpr, ctx))
    if (op === 'or') return isTruthy(evalExpr(leftExpr, ctx)) || isTruthy(evalExpr(rightExpr, ctx))

    const left = evalExpr(leftExpr, ctx)
    const right = evalExpr(rightExpr, ctx)

    switch (op) {
        case '+':
            return typeof left === 'string' || typeof right === 'string'
                ? String(left) + String(right)
                : (left as number) + (right as number)
        case '-':
            return (left as number) - (right as number)
        case '*':
            return (left as number) * (right as number)
        case '/':
            return (right as number) !== 0 ? (left as number) / (right as number) : 0
        case '>':
            return (left as number) > (right as number)
        case '<':
            return (left as number) < (right as number)
        case '>=':
            return (left as number) >= (right as number)
        case '<=':
            return (left as number) <= (right as number)
        case '=':
            return left === right
        case '!=':
            return left !== right
        default:
            return null
    }
}

function callBuiltin(name: string, args: PrimValue[], ctx: ScriptContext): PrimValue {
    switch (name) {
        case 'random':
            return Math.floor(Math.random() * (typeof args[0] === 'number' ? args[0] : 100))
        case 'show':
            ctx.outputs.push(String(args[0] ?? ''))
            return null
        case 'log':
            ctx.logs.push(String(args[0] ?? ''))
            return null
        case 'string':
            return String(args[0] ?? '')
        case 'number':
            return Number(args[0] ?? 0)
        case 'floor':
            return Math.floor(args[0] as number)
        case 'ceil':
            return Math.ceil(args[0] as number)
        case 'abs':
            return Math.abs(args[0] as number)
        case 'max':
            return Math.max(...(args as number[]))
        case 'min':
            return Math.min(...(args as number[]))
        case 'concat':
            return args.map(String).join('')
        case 'length':
            return typeof args[0] === 'string' ? args[0].length : 0
        default:
            throw new ScriptError(`Unknown function: ${name}`)
    }
}

function isTruthy(val: PrimValue): boolean {
    return val !== null && val !== false && val !== 0 && val !== ''
}
