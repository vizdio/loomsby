export type TokenType =
    | 'KEYWORD'
    | 'IDENTIFIER'
    | 'STRING'
    | 'NUMBER'
    | 'BOOLEAN'
    | 'OPERATOR'
    | 'LPAREN'
    | 'RPAREN'
    | 'COMMA'
    | 'NEWLINE'
    | 'EOF'

export interface Token {
    type: TokenType
    value: string
    line: number
}

const KEYWORDS = new Set([
    'on',
    'end',
    'set',
    'to',
    'show',
    'log',
    'if',
    'else',
    'and',
    'or',
    'not',
])

export function tokenize(source: string): Token[] {
    const tokens: Token[] = []
    let i = 0
    let line = 1

    while (i < source.length) {
        const ch = source[i]

        // Skip spaces and tabs (not newlines)
        if (ch === ' ' || ch === '\t' || ch === '\r') {
            i++
            continue
        }

        // Line comments: -- or #
        if (ch === '#' || (ch === '-' && source[i + 1] === '-')) {
            while (i < source.length && source[i] !== '\n') i++
            continue
        }

        // Newlines
        if (ch === '\n') {
            // Collapse consecutive newlines into one
            if (tokens.length > 0 && tokens[tokens.length - 1].type !== 'NEWLINE') {
                tokens.push({ type: 'NEWLINE', value: '\n', line })
            }
            line++
            i++
            continue
        }

        // String literals
        if (ch === '"') {
            let str = ''
            i++ // skip opening quote
            while (i < source.length && source[i] !== '"') {
                if (source[i] === '\\' && i + 1 < source.length) {
                    i++
                    const esc = source[i]
                    str += esc === 'n' ? '\n' : esc === 't' ? '\t' : esc
                } else {
                    str += source[i]
                }
                i++
            }
            i++ // skip closing quote
            tokens.push({ type: 'STRING', value: str, line })
            continue
        }

        // Numbers
        if (/\d/.test(ch) || (ch === '.' && /\d/.test(source[i + 1] ?? ''))) {
            let num = ''
            while (i < source.length && /[\d.]/.test(source[i])) num += source[i++]
            tokens.push({ type: 'NUMBER', value: num, line })
            continue
        }

        // Multi-char operators
        if ((ch === '>' || ch === '<' || ch === '!') && source[i + 1] === '=') {
            tokens.push({ type: 'OPERATOR', value: ch + '=', line })
            i += 2
            continue
        }

        // Single-char operators
        if ('+-*/><'.includes(ch)) {
            tokens.push({ type: 'OPERATOR', value: ch, line })
            i++
            continue
        }

        // Equals (assignment/comparison)
        if (ch === '=') {
            tokens.push({ type: 'OPERATOR', value: '=', line })
            i++
            continue
        }

        // Grouped tokens
        if (ch === '(') {
            tokens.push({ type: 'LPAREN', value: '(', line })
            i++
            continue
        }
        if (ch === ')') {
            tokens.push({ type: 'RPAREN', value: ')', line })
            i++
            continue
        }
        if (ch === ',') {
            tokens.push({ type: 'COMMA', value: ',', line })
            i++
            continue
        }

        // Identifiers, keywords, and boolean literals
        if (/[a-zA-Z_]/.test(ch)) {
            let ident = ''
            while (i < source.length && /[a-zA-Z0-9_]/.test(source[i])) ident += source[i++]
            if (ident === 'true' || ident === 'false') {
                tokens.push({ type: 'BOOLEAN', value: ident, line })
            } else if (KEYWORDS.has(ident)) {
                tokens.push({ type: 'KEYWORD', value: ident, line })
            } else {
                tokens.push({ type: 'IDENTIFIER', value: ident, line })
            }
            continue
        }

        // Skip any unrecognised character
        i++
    }

    tokens.push({ type: 'EOF', value: '', line })
    return tokens
}
