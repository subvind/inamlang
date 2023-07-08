import { CstParser } from "chevrotain"
import { 
  allTokens,
  LCurly,
  Comma,
  RCurly,
  StringLiteral,
  Colon,
  LSquare,
  RSquare,
  NumberLiteral,
  True,
  False,
  Null
} from '../lexer/json.js'

// ----------------- parser -----------------
// Note that this is a Pure grammar, it only describes the grammar
// Not any actions (semantics) to perform during parsing.
export class JsonParser extends CstParser {
  // Unfortunately no support for class fields with initializer in ES2015, only in esNext...
  // so the parsing rules are defined inside the constructor, as each parsing rule must be initialized by
  // invoking RULE(...)
  // see: https://github.com/jeffmo/es-class-fields-and-static-properties
  constructor() {
    super(allTokens)

    // not mandatory, using $ (or any other sign) to reduce verbosity (this. this. this. this. .......)
    const $ = this

    $.RULE("json", () => {
      $.OR([
        // using ES6 Arrow functions to reduce verbosity.
        { ALT: () => $.SUBRULE($.object) },
        { ALT: () => $.SUBRULE($.array) }
      ])
    })

    // the parsing methods
    $.RULE("object", () => {
      $.CONSUME(LCurly)
      $.MANY_SEP({
        SEP: Comma,
        DEF: () => {
          $.SUBRULE2($.objectItem)
        }
      })
      $.CONSUME(RCurly)
    })

    $.RULE("objectItem", () => {
      $.CONSUME(StringLiteral)
      $.CONSUME(Colon)
      $.SUBRULE($.value)
    })

    $.RULE("array", () => {
      $.CONSUME(LSquare)
      $.MANY_SEP({
        SEP: Comma,
        DEF: () => {
          $.SUBRULE2($.value)
        }
      })
      $.CONSUME(RSquare)
    })

    $.RULE("value", () => {
      $.OR([
        { ALT: () => $.CONSUME(StringLiteral) },
        { ALT: () => $.CONSUME(NumberLiteral) },
        { ALT: () => $.SUBRULE($.object) },
        { ALT: () => $.SUBRULE($.array) },
        { ALT: () => $.CONSUME(True) },
        { ALT: () => $.CONSUME(False) },
        { ALT: () => $.CONSUME(Null) }
      ])
    })

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis()
  }
}

// ----------------- wrapping it all together -----------------

// wrapping it all together
// reuse the same parser instance.
export const parser = new JsonParser()

// ----------------- Interpreter -----------------
// Obtains the default CstVisitor constructor to extend.
export const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

