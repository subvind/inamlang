import assert from "assert"
import transpiler from "../transpiler/index.js"

const inputTextFunction = `
const add: function = ($a: number, $b: number): number => {
  return $a + $b + 5;
}

let firstFloor: number = 10;
let secondFloor: number = 10;
const result: number = add(firstFloor, secondFloor);
console->log(result);
`

const outputTextFunction = `
const add = function ($a: number, $b: number): number {
  return $a + $b + 5;
}

let firstFloor: number = 10;
let secondFloor: number = 10;
const result: number = add(firstFloor, secondFloor);
console.log(result);
`

const inputTextMatch = `
from "ts-pattern" to { match, __ };

type Shape = Circle | Rectangle | Triangle;

interface Circle { 
  radius: number;
}
interface Rectangle {
  width: number;
  height: number; 
}
interface Triangle {
  base: number;
  height: number;
}

const getArea: match = ($shape: Shape): number => {
  let circle: pattern = ($case: Circle): number => {
    return Math.PI * $case->radius * $case->radius;
  };
  let rectangle: pattern = ($case: Rectangle): number => {
    return $case->width * $case->height;
  };
  let triangle: pattern = ($case: Triangle): number => {
    return 0.5 * $case->base * $case->height;
  };
  return this.exhaustive([circle, rectangle, triangle]);
}

const circle: Circle = { radius: 5 };
const rectangle: Rectangle = { width: 4, height: 6 };
const triangle: Triangle = { base: 3, height: 4 };

console.log(getArea(circle)); // 78.53981633974483
console.log(getArea(rectangle)); // 24
console.log(getArea(triangle)); // 6
`
const outputTextMatch = `
import { match, __ } from "ts-pattern";

type Shape = Circle | Rectangle | Triangle;

interface Circle {
  __type: "circle";
  radius: number;
}
interface Rectangle {
  __type: "rectangle";
  width: number;
  height: number;
}
interface Triangle {
  __type: "triangle";
  base: number;
  height: number;
}

const getArea = (shape: Shape): number => {
  match(shape)
    .with({ __type: "circle" }, ({ radius }) => Math.PI * radius * radius)
    .with({ __type: "rectangle" }, ({ width, height }) => width * height)
    .with({ __type: "triangle" }, ({ base, height }) => 0.5 * base * height)
    .exhaustive();
}

const circle: Circle = { __type: "circle", radius: 5 };
const rectangle: Rectangle = { __type: "rectangle", width: 4, height: 6 };
const triangle: Triangle = { __type: "triangle", base: 3, height: 4 };

console.log(getArea(circle)); // 78.53981633974483
console.log(getArea(rectangle)); // 24
console.log(getArea(triangle)); // 6
`

describe("INAMLANG", () => {
  it("compiles import module statements", () => {
    const inputText = 'from "./test" to { variableName };'
    const outputText = 'import { variableName } from "./test";'
    const result = transpiler.eval(inputText)

    assert.equal(result.lexErrors.length, 0)
    assert.equal(result.parseErrors.length, 0)
    assert.equal(outputText, result.value)

    console.log("errors:", result.lexErrors)
    console.log("inputText", inputText)
    console.log("outputText", result.value)
  })

  it("compiles typescript data type definition", () => {
    const inputText = 'let variableName: typescript = <1 + 1>;'
    const outputText = 'let variableName: any = 2;'
    const result = transpiler.eval(inputText)

    assert.equal(result.lexErrors.length, 0)
    assert.equal(result.parseErrors.length, 0)
    assert.equal(outputText, result.value)

    console.log("errors:", result.lexErrors)
    console.log("inputText", inputText)
    console.log("outputText", result.value)
  })

  it("compiles boolean data type definition", () => {
    const inputText = 'let variableName: boolean = true;'
    const outputText = 'let variableName: boolean = true;'
    const result = transpiler.eval(inputText)

    assert.equal(result.lexErrors.length, 0)
    assert.equal(result.parseErrors.length, 0)
    assert.equal(outputText, result.value)

    console.log("errors:", result.lexErrors)
    console.log("inputText", inputText)
    console.log("outputText", result.value)
  })

  it("compiles interface definition", () => {
    const inputText = `interface Circle { radius: number; }`
    const outputText = 'interface Circle { __type: "circle"; radius: number; }'
    const result = transpiler.eval(inputText)

    assert.equal(result.lexErrors.length, 0)
    assert.equal(result.parseErrors.length, 0)
    assert.equal(outputText, result.value)

    console.log("errors:", result.lexErrors)
    console.log("inputText", inputText)
    console.log("outputText", result.value)
  })
  
  it("compiles any data type definition", () => {
    const inputText = 'const variableName: any = { "arr": [1,2,3], "obj": { "num": 666 } };'
    const outputText = 'const variableName: any = {"arr":[1,2,3],"obj":{"num":666}};'
    const result = transpiler.eval(inputText)

    assert.equal(result.lexErrors.length, 0)
    assert.equal(result.parseErrors.length, 0)
    assert.equal(outputText, result.value)

    console.log("errors:", result.lexErrors)
    console.log("inputText", inputText)
    console.log("outputText", result.value)
  })
  
  it("compiles function", () => {
    const result = transpiler.eval(inputTextFunction)

    assert.equal(result.lexErrors.length, 0)
    assert.equal(result.parseErrors.length, 0)
    assert.equal(outputTextFunction, result.value)

    console.log("errors:", result.lexErrors)
    console.log("inputTextFunction", inputTextFunction)
    console.log("outputTextFunction", result.value)
  })

  it("compiles pattern matching", () => {
    const result = transpiler.eval(inputTextMatch)

    assert.equal(result.lexErrors.length, 0)
    assert.equal(result.parseErrors.length, 0)
    assert.equal(outputTextMatch, result.value)

    console.log("errors:", result.lexErrors)
    console.log("inputTextMatch", inputTextMatch)
    console.log("outputTextMatch", result.value)
  })
})