import { parseJson } from "../transpiler/parser/json.js"
import assert from "assert"

describe("The ability to use Chevrotain using modern ECMAScript", () => {
  it("works with ESM", () => {
    const inputText = '< :arr:~ #1,2,3+, :obj:~ < :num:~ 666 >>'
    const lexAndParseResult = parseJson(inputText)

    console.log(lexAndParseResult.lexErrors)
    assert.equal(lexAndParseResult.lexErrors.length, 0)
    assert.equal(lexAndParseResult.parseErrors.length, 0)
  })
})