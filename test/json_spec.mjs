import assert from "assert"
import transpiler from "../transpiler/index.js"

describe("The ability to use Chevrotain", () => {
  it("works with json", () => {
    const inputText = '< :arr:~ #1,2,3+, :obj:~ < :num:~ 666 >>'
    const outputText = '{ "arr": [1,2,3], "obj": { "num": 666 }}'
    const result = transpiler(inputText)

    console.log(result.lexErrors)
    assert.equal(result.lexErrors.length, 0)
    assert.equal(result.parseErrors.length, 0)
    
    console.log(result.source)
    assert.equal(outputText, result.source)
  })
})