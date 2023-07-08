
// Visitor to traverse the CST and generate JSON code
const Visitor = {
  json(ctx) {
    return this.visit(ctx.children[0]);
  },

  object(ctx) {
    const objectItemCtxs = ctx.objectItem;
    const obj = {};

    for (const objectItemCtx of objectItemCtxs) {
      const key = this.visit(objectItemCtx.children[0]);
      const value = this.visit(objectItemCtx.children[2]);
      obj[key] = value;
    }

    return obj;
  },

  objectItem(ctx) {
    return this.visit(ctx.children[0]);
  },

  value(ctx) {
    return this.visit(ctx.children[0]);
  },

  array(ctx) {
    const valueCtxs = ctx.value;
    const arr = valueCtxs.map((valueCtx) => this.visit(valueCtx));

    return arr;
  },

  StringLiteral(ctx) {
    return ctx.image.slice(1, -1);
  },

  NumberLiteral(ctx) {
    return parseFloat(ctx.image);
  }
};

export function interpreterJson (cst) {
  const jsonCode = JSON.stringify(Visitor.json(cst), null, 2);
  return jsonCode
}