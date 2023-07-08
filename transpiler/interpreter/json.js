import { BaseCstVisitor } from '../parser/json.js'

// Visitor to traverse the CST and generate JSON code
class JsonInterpreter extends BaseCstVisitor {

  constructor() {
    super()
    // This helper will detect any missing or redundant methods on this visitor
    this.validateVisitor()
  }

  json(ctx) {
    console.log('json', ctx)
    return this.visit(ctx.object);
  }

  object(ctx) {
    console.log('object', ctx)
    const objectItemCtxs = ctx.objectItem;
    const obj = {};

    for (const objectItemCtx of objectItemCtxs) {
      console.log('objectItemCtx', objectItemCtx)
      const object = this.visit(objectItemCtx);
      console.log('objectItemCtx.visit', object)
      obj[object.key] = object.value;
    }

    return obj;
  }

  objectItem(ctx) {
    console.log('objectItem', ctx)

    const key = ctx.StringLiteral[0].image.slice(1,-1)
    const value = this.visit(ctx.value)
    
    console.log('key', key)
    console.log('value', value)
    
    return {
      key,
      value
    }
  }

  value(ctx) {
    console.log('value', ctx)
    let value
    switch (Object.keys(ctx)[0]) {
      case "array":
        value = this.visit(ctx.array);
        break;
      case "object":
        value = this.visit(ctx.object);
        break;
      default:
        break;
    }
    console.log('valueVisited', value)
    return value;
  }

  array(ctx) {
    console.log('array', ctx)
    const valueCtxs = ctx.value;
    const arr = valueCtxs.map((valueCtx) => this.visit(valueCtx));

    return arr;
  }

  StringLiteral(ctx) {
    console.log('StringLiteral', ctx)
    return ctx.image.slice(1, -1);
  }

  NumberLiteral(ctx) {
    console.log('NumberLiteral', ctx)
    return parseFloat(ctx.image);
  }
};

export const interpreter = new JsonInterpreter()
