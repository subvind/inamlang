"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interpreter = void 0;
var _json = require("../parser/json.js");
// Visitor to traverse the CST and generate JSON code
class JsonInterpreter extends _json.BaseCstVisitor {
  constructor() {
    super();
    // This helper will detect any missing or redundant methods on this visitor
    this.validateVisitor();
  }
  json(ctx) {
    // console.log('json', ctx)
    return JSON.stringify(this.visit(ctx.object));
  }
  object(ctx) {
    // console.log('object', ctx)
    const objectItemCtxs = ctx.objectItem;
    const obj = {};
    for (const objectItemCtx of objectItemCtxs) {
      // console.log('objectItemCtx', objectItemCtx)
      const object = this.visit(objectItemCtx);
      // console.log('objectItemCtx.visit', object)
      obj[object.key] = object.value;
    }
    return obj;
  }
  objectItem(ctx) {
    // console.log('objectItem', ctx)

    const key = ctx.StringLiteral[0].image.slice(1, -1);
    const value = this.visit(ctx.value);

    // console.log('key', key)
    // console.log('value', value)

    return {
      key,
      value
    };
  }
  value(ctx) {
    // console.log('value', ctx)
    let value;
    switch (Object.keys(ctx)[0]) {
      case "array":
        value = this.visit(ctx.array);
        break;
      case "object":
        value = this.visit(ctx.object);
        break;
      case "StringLiteral":
        value = this.visit(ctx.StringLiteral);
        break;
      case "NumberLiteral":
        value = parseFloat(ctx.NumberLiteral[0].image);
        break;
      default:
        break;
    }
    // console.log('valueVisited', value)
    return value;
  }
  array(ctx) {
    // console.log('array', ctx)
    const valueCtxs = ctx.value;
    let arr = [];
    valueCtxs.forEach(valueCtx => {
      arr.push(this.visit(valueCtx));
    });

    // console.log('arr', arr)
    return arr;
  }
  StringLiteral(ctx) {
    // console.log('StringLiteral', ctx)
    return ctx.StringLiteral[0].image.slice(1, -1);
  }
  NumberLiteral(ctx) {
    // console.log('NumberLiteral', ctx)
    return parseFloat(ctx.image);
  }
}
;
const interpreter = new JsonInterpreter();
exports.interpreter = interpreter;