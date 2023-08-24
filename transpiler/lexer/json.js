
import { createToken, Lexer } from "chevrotain"

// ----------------- lexer -----------------
export const True = createToken({ name: "True", pattern: /true/ })
export const False = createToken({ name: "False", pattern: /false/ })
export const Null = createToken({ name: "Null", pattern: /null/ })
export const LCurly = createToken({ name: "LCurly", pattern: /\{/ })
export const RCurly = createToken({ name: "RCurly", pattern: /\}/ })
export const LSquare = createToken({ name: "LSquare", pattern: /\[/ })
export const RSquare = createToken({ name: "RSquare", pattern: /\]/ })
export const Comma = createToken({ name: "Comma", pattern: /,/ })
export const Colon = createToken({ name: "Colon", pattern: /\:/ })
export const SemiColon = createToken({ name: "SemiColon", pattern: /\;/ })
export const From = createToken({ name: "SemiColon", pattern: /from/ })
export const To = createToken({ name: "SemiColon", pattern: /to/ })

export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
})

export const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
})

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \t\n\r]+/,
  // ignore whitespace
  group: Lexer.SKIPPED
})

export const allTokens = [
  WhiteSpace,
  NumberLiteral,
  StringLiteral,
  LCurly,
  RCurly,
  LSquare,
  RSquare,
  Comma,
  Colon,
  SemiColon,
  True,
  False,
  Null
]

export const lexer = new Lexer(allTokens)