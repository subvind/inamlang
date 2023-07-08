"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parser = exports.JsonParser = exports.BaseCstVisitor = void 0;
var _chevrotain = require("chevrotain");
var _json = require("../lexer/json.js");
// ----------------- parser -----------------
// Note that this is a Pure grammar, it only describes the grammar
// Not any actions (semantics) to perform during parsing.
class JsonParser extends _chevrotain.CstParser {
  // Unfortunately no support for class fields with initializer in ES2015, only in esNext...
  // so the parsing rules are defined inside the constructor, as each parsing rule must be initialized by
  // invoking RULE(...)
  // see: https://github.com/jeffmo/es-class-fields-and-static-properties
  constructor() {
    super(_json.allTokens);

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
      $.CONSUME(_json.LCurly);
      $.MANY_SEP({
        SEP: _json.Comma,
        DEF: () => {
          $.SUBRULE2($.objectItem);
        }
      });
      $.CONSUME(_json.RCurly);
    });
    $.RULE("objectItem", () => {
      $.CONSUME(_json.StringLiteral);
      $.CONSUME(_json.Colon);
      $.SUBRULE($.value);
    });
    $.RULE("array", () => {
      $.CONSUME(_json.LSquare);
      $.MANY_SEP({
        SEP: _json.Comma,
        DEF: () => {
          $.SUBRULE2($.value);
        }
      });
      $.CONSUME(_json.RSquare);
    });
    $.RULE("value", () => {
      $.OR([{
        ALT: () => $.CONSUME(_json.StringLiteral)
      }, {
        ALT: () => $.CONSUME(_json.NumberLiteral)
      }, {
        ALT: () => $.SUBRULE($.object)
      }, {
        ALT: () => $.SUBRULE($.array)
      }, {
        ALT: () => $.CONSUME(_json.True)
      }, {
        ALT: () => $.CONSUME(_json.False)
      }, {
        ALT: () => $.CONSUME(_json.Null)
      }]);
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

// ----------------- wrapping it all together -----------------

// wrapping it all together
// reuse the same parser instance.
exports.JsonParser = JsonParser;
const parser = new JsonParser();

// ----------------- Interpreter -----------------
// Obtains the default CstVisitor constructor to extend.
exports.parser = parser;
const BaseCstVisitor = parser.getBaseCstVisitorConstructor();
exports.BaseCstVisitor = BaseCstVisitor;