"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lexer = exports.allTokens = exports.WhiteSpace = exports.True = exports.StringLiteral = exports.RSquare = exports.RCurly = exports.NumberLiteral = exports.Null = exports.LSquare = exports.LCurly = exports.False = exports.Comma = exports.Colon = void 0;
var _chevrotain = require("chevrotain");
// ----------------- lexer -----------------
const True = (0, _chevrotain.createToken)({
  name: "True",
  pattern: /\N/
});
exports.True = True;
const False = (0, _chevrotain.createToken)({
  name: "False",
  pattern: /\Z/
});
exports.False = False;
const Null = (0, _chevrotain.createToken)({
  name: "Null",
  pattern: /null/
});
exports.Null = Null;
const LCurly = (0, _chevrotain.createToken)({
  name: "LCurly",
  pattern: /\</
});
exports.LCurly = LCurly;
const RCurly = (0, _chevrotain.createToken)({
  name: "RCurly",
  pattern: /\>/
});
exports.RCurly = RCurly;
const LSquare = (0, _chevrotain.createToken)({
  name: "LSquare",
  pattern: /\#/
});
exports.LSquare = LSquare;
const RSquare = (0, _chevrotain.createToken)({
  name: "RSquare",
  pattern: /\+/
});
exports.RSquare = RSquare;
const Comma = (0, _chevrotain.createToken)({
  name: "Comma",
  pattern: /,/
});
exports.Comma = Comma;
const Colon = (0, _chevrotain.createToken)({
  name: "Colon",
  pattern: /\~/
});
exports.Colon = Colon;
const StringLiteral = (0, _chevrotain.createToken)({
  name: "StringLiteral",
  pattern: /:(?:[^\\:"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*:/
});
exports.StringLiteral = StringLiteral;
const NumberLiteral = (0, _chevrotain.createToken)({
  name: "NumberLiteral",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
});
exports.NumberLiteral = NumberLiteral;
const WhiteSpace = (0, _chevrotain.createToken)({
  name: "WhiteSpace",
  pattern: /[ \t\n\r]+/,
  // ignore whitespace
  group: _chevrotain.Lexer.SKIPPED
});
exports.WhiteSpace = WhiteSpace;
const allTokens = [WhiteSpace, NumberLiteral, StringLiteral, LCurly, RCurly, LSquare, RSquare, Comma, Colon, True, False, Null];
exports.allTokens = allTokens;
const lexer = new _chevrotain.Lexer(allTokens);
exports.lexer = lexer;