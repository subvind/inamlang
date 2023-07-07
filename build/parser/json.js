"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseJson = parseJson;
var _chevrotain = require("chevrotain");
// ----------------- lexer -----------------
const True = (0, _chevrotain.createToken)({
  name: "True",
  pattern: /\N/
});
const False = (0, _chevrotain.createToken)({
  name: "False",
  pattern: /\Z/
});
const Null = (0, _chevrotain.createToken)({
  name: "Null",
  pattern: /null/
});
const LCurly = (0, _chevrotain.createToken)({
  name: "LCurly",
  pattern: /\</
});
const RCurly = (0, _chevrotain.createToken)({
  name: "RCurly",
  pattern: /\>/
});
const LSquare = (0, _chevrotain.createToken)({
  name: "LSquare",
  pattern: /\#/
});
const RSquare = (0, _chevrotain.createToken)({
  name: "RSquare",
  pattern: /\+/
});
const Comma = (0, _chevrotain.createToken)({
  name: "Comma",
  pattern: /,/
});
const Colon = (0, _chevrotain.createToken)({
  name: "Colon",
  pattern: /\~/
});
const StringLiteral = (0, _chevrotain.createToken)({
  name: "StringLiteral",
  pattern: /:(?:[^\\:"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*:/
});
const NumberLiteral = (0, _chevrotain.createToken)({
  name: "NumberLiteral",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
});
const WhiteSpace = (0, _chevrotain.createToken)({
  name: "WhiteSpace",
  pattern: /[ \t\n\r]+/,
  // ignore whitespace
  group: _chevrotain.Lexer.SKIPPED
});
const allTokens = [WhiteSpace, NumberLiteral, StringLiteral, LCurly, RCurly, LSquare, RSquare, Comma, Colon, True, False, Null];
const JsonLexer = new _chevrotain.Lexer(allTokens);

// ----------------- parser -----------------
class JsonParserES6 extends _chevrotain.CstParser {
  constructor() {
    super(allTokens);

    // not mandatory, using $ (or any other sign) to reduce verbosity (this. this. this. this. .......)
    const $ = this;
    $.RULE("json", () => {
      $.OR([
      // using ES6 Arrow functions to reduce verbosity.
      {
        ALT: () => $.SUBRULE($.object)
      }, {
        ALT: () => $.SUBRULE($.array)
      }]);
    });

    // the parsing methods
    $.RULE("object", () => {
      $.CONSUME(LCurly);
      $.MANY_SEP({
        SEP: Comma,
        DEF: () => {
          $.SUBRULE2($.objectItem);
        }
      });
      $.CONSUME(RCurly);
    });
    $.RULE("objectItem", () => {
      $.CONSUME(StringLiteral);
      $.CONSUME(Colon);
      $.SUBRULE($.value);
    });
    $.RULE("array", () => {
      $.CONSUME(LSquare);
      $.MANY_SEP({
        SEP: Comma,
        DEF: () => {
          $.SUBRULE2($.value);
        }
      });
      $.CONSUME(RSquare);
    });
    $.RULE("value", () => {
      $.OR([{
        ALT: () => $.CONSUME(StringLiteral)
      }, {
        ALT: () => $.CONSUME(NumberLiteral)
      }, {
        ALT: () => $.SUBRULE($.object)
      }, {
        ALT: () => $.SUBRULE($.array)
      }, {
        ALT: () => $.CONSUME(True)
      }, {
        ALT: () => $.CONSUME(False)
      }, {
        ALT: () => $.CONSUME(Null)
      }]);
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

// ----------------- wrapping it all together -----------------

// reuse the same parser instance.
const parser = new JsonParserES6();
function parseJson(text) {
  const lexResult = JsonLexer.tokenize(text);
  // setting a new input will RESET the parser instance's state.
  parser.input = lexResult.tokens;
  // any top level rule may be used as an entry point
  const cst = parser.json();
  return {
    cst: cst,
    lexErrors: lexResult.errors,
    parseErrors: parser.errors
  };
}