import type { Token, TokenType } from './tokenizer'
import type {
    Program,
    Statement,
    Expression,
    EventHandler,
    SetStatement,
    ShowStatement,
    LogStatement,
    IfStatement,
    BinaryExpression,
    UnaryExpression,
    CallExpression,
    Identifier,
    Literal,
} from './types'

export class ParseError extends Error {}

export function parse(tokens: Token[]): Program {
    let pos = 0

    const peek = (): Token => tokens[pos] ?? { type: 'EOF', value: '', line: 0 }
    const peekType = (): TokenType => peek().type
    const peekValue = (): string => peek().value
    const advance = (): Token => tokens[pos++] ?? { type: 'EOF', value: '', line: 0 }

    function expect(type: TokenType, value?: string): Token {
        const tok = advance()
        if (tok.type !== type || (value !== undefined && tok.value !== value)) {
            throw new ParseError(
                `Expected ${type}${value ? ` '${value}'` : ''} but got ${tok.type} '${tok.value}' on line ${tok.line}`,
            )
        }
        return tok
    }

    function skipNewlines() {
        while (peekType() === 'NEWLINE') advance()
    }

    function parseProgram(): Program {
        const body: Statement[] = []
        skipNewlines()
        while (peekType() !== 'EOF') {
            body.push(parseStatement())
            skipNewlines()
        }
        return { type: 'Program', body }
    }

    function parseStatement(): Statement {
        skipNewlines()
        const tok = peek()
        if (tok.type === 'KEYWORD') {
            switch (tok.value) {
                case 'on':
                    return parseEventHandler()
                case 'set':
                    return parseSetStatement()
                case 'show':
                    return parseShowStatement()
                case 'log':
                    return parseLogStatement()
                case 'if':
                    return parseIfStatement()
            }
        }
        throw new ParseError(`Unexpected token '${tok.value}' on line ${tok.line}`)
    }

    function parseEventHandler(): EventHandler {
        expect('KEYWORD', 'on')
        const event = advance().value
        const body: Statement[] = []
        skipNewlines()
        while (!(peekType() === 'KEYWORD' && peekValue() === 'end') && peekType() !== 'EOF') {
            body.push(parseStatement())
            skipNewlines()
        }
        expect('KEYWORD', 'end')
        return { type: 'EventHandler', event, body }
    }

    function parseSetStatement(): SetStatement {
        expect('KEYWORD', 'set')
        const variable = advance().value
        expect('KEYWORD', 'to')
        return { type: 'SetStatement', variable, value: parseExpression() }
    }

    function parseShowStatement(): ShowStatement {
        expect('KEYWORD', 'show')
        return { type: 'ShowStatement', value: parseExpression() }
    }

    function parseLogStatement(): LogStatement {
        expect('KEYWORD', 'log')
        return { type: 'LogStatement', value: parseExpression() }
    }

    function parseIfStatement(): IfStatement {
        expect('KEYWORD', 'if')
        const condition = parseExpression()
        skipNewlines()
        const consequent: Statement[] = []
        const alternate: Statement[] = []

        while (
            !(peekType() === 'KEYWORD' && (peekValue() === 'else' || peekValue() === 'end')) &&
            peekType() !== 'EOF'
        ) {
            consequent.push(parseStatement())
            skipNewlines()
        }

        if (peekType() === 'KEYWORD' && peekValue() === 'else') {
            advance()
            skipNewlines()
            while (!(peekType() === 'KEYWORD' && peekValue() === 'end') && peekType() !== 'EOF') {
                alternate.push(parseStatement())
                skipNewlines()
            }
        }
        expect('KEYWORD', 'end')
        return { type: 'IfStatement', condition, consequent, alternate }
    }

    // ── Expression parsing (Pratt-style precedence climb) ───────────────────

    function parseExpression(): Expression {
        return parseOr()
    }

    function parseOr(): Expression {
        let left = parseAnd()
        while (peekType() === 'KEYWORD' && peekValue() === 'or') {
            advance()
            const right = parseAnd()
            const node: BinaryExpression = { type: 'BinaryExpression', operator: 'or', left, right }
            left = node
        }
        return left
    }

    function parseAnd(): Expression {
        let left = parseNot()
        while (peekType() === 'KEYWORD' && peekValue() === 'and') {
            advance()
            const right = parseNot()
            const node: BinaryExpression = {
                type: 'BinaryExpression',
                operator: 'and',
                left,
                right,
            }
            left = node
        }
        return left
    }

    function parseNot(): Expression {
        if (peekType() === 'KEYWORD' && peekValue() === 'not') {
            advance()
            const node: UnaryExpression = {
                type: 'UnaryExpression',
                operator: 'not',
                argument: parseNot(),
            }
            return node
        }
        return parseComparison()
    }

    function parseComparison(): Expression {
        let left = parseAddition()
        const ops = ['>', '<', '>=', '<=', '=', '!=']
        while (peekType() === 'OPERATOR' && ops.includes(peekValue())) {
            const op = advance().value
            const right = parseAddition()
            const node: BinaryExpression = { type: 'BinaryExpression', operator: op, left, right }
            left = node
        }
        return left
    }

    function parseAddition(): Expression {
        let left = parseMultiplication()
        while (peekType() === 'OPERATOR' && (peekValue() === '+' || peekValue() === '-')) {
            const op = advance().value
            const right = parseMultiplication()
            const node: BinaryExpression = { type: 'BinaryExpression', operator: op, left, right }
            left = node
        }
        return left
    }

    function parseMultiplication(): Expression {
        let left = parsePrimary()
        while (peekType() === 'OPERATOR' && (peekValue() === '*' || peekValue() === '/')) {
            const op = advance().value
            const right = parsePrimary()
            const node: BinaryExpression = { type: 'BinaryExpression', operator: op, left, right }
            left = node
        }
        return left
    }

    function parsePrimary(): Expression {
        const tok = peek()

        if (tok.type === 'LPAREN') {
            advance()
            const expr = parseExpression()
            expect('RPAREN')
            return expr
        }
        if (tok.type === 'STRING') {
            advance()
            const lit: Literal = { type: 'Literal', value: tok.value }
            return lit
        }
        if (tok.type === 'NUMBER') {
            advance()
            const lit: Literal = { type: 'Literal', value: parseFloat(tok.value) }
            return lit
        }
        if (tok.type === 'BOOLEAN') {
            advance()
            const lit: Literal = { type: 'Literal', value: tok.value === 'true' }
            return lit
        }
        if (tok.type === 'IDENTIFIER') {
            advance()
            // Function call?
            if (peekType() === 'LPAREN') {
                advance() // consume (
                const args: Expression[] = []
                if (peekType() !== 'RPAREN') {
                    args.push(parseExpression())
                    while (peekType() === 'COMMA') {
                        advance()
                        args.push(parseExpression())
                    }
                }
                expect('RPAREN')
                const call: CallExpression = { type: 'CallExpression', callee: tok.value, args }
                return call
            }
            const ident: Identifier = { type: 'Identifier', name: tok.value }
            return ident
        }

        throw new ParseError(`Unexpected token '${tok.value}' (${tok.type}) on line ${tok.line}`)
    }

    return parseProgram()
}
