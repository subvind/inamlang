import assert from "assert"
import transpiler from "../transpiler/index.js"

describe("INOMLANG", () => {
  it("compiles data to json formatted data", () => {
    const inputText = '< :arr:~ #1,2,3+, :obj:~ < :num:~ 666 > >'
    const outputText = '{"arr":[1,2,3],"obj":{"num":666}}'
    const result = transpiler(inputText)

    assert.equal(result.lexErrors.length, 0)
    assert.equal(result.parseErrors.length, 0)
    assert.equal(outputText, result.value)

    console.log("errors:", result.lexErrors)
    console.log("inputText", inputText)
    console.log("outputText", result.value)
  })
})