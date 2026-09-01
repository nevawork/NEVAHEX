import { lex } from "../src/lexer/Lexer.js";

function checkTokens(input: string, expectedTypes: string[], expectedPunctValues: (string | RegExp)[] = []): void {
  const { tokens, errors } = lex(input);
  expect(errors).toEqual([]);
  const actualTypes = tokens.slice(0, -1).map(t => t.type); // exclude EOF
  expect(actualTypes).toEqual(expectedTypes);
  if (expectedPunctValues.length > 0) {
    const actualPunctValues = tokens.slice(0, -1)
      .filter(t => t.type === "Punctuator")
      .map(t => t.value);
    for (let i = 0; i < expectedPunctValues.length; i++) {
      const expected = expectedPunctValues[i];
      if (expected instanceof RegExp) {
        expect(actualPunctValues[i]).toMatch(expected);
      } else {
        expect(actualPunctValues[i]).toBe(expected);
      }
    }
  }
}

describe("Lexer", () => {
  test("lexes keywords", () => {
    checkTokens("local function foo() return nil end", [
      "Keyword", "Keyword", "Identifier", "Punctuator", "Punctuator",
      "Keyword", "Keyword", "Keyword",
    ]);
  });

  test("lexes strings with escapes", () => {
    const { tokens, errors } = lex(`"hello\\nworld"`);
    expect(errors).toEqual([]);
    expect(tokens[0].type).toBe("String");
    if (tokens[0].type === "String") {
      expect((tokens[0] as any).value).toBe("hello\nworld");
    }
  });

  test("lexes long strings", () => {
    const { tokens, errors } = lex("[[hello world]]");
    expect(errors).toEqual([]);
    expect(tokens[0].type).toBe("String");
  });

  test("lexes numbers (hex, bin, decimal)", () => {
    const { tokens, errors } = lex("0xFF 0b1010 42 3.14 1e3 1.5e-2");
    expect(errors).toEqual([]);
    expect(tokens[0].type).toBe("Number");
    expect((tokens[0] as any).raw).toBe("0xFF");
    expect((tokens[1] as any).raw).toBe("0b1010");
    expect((tokens[2] as any).value).toBe("42");
  });

  test("lexes bitwise operators (Lua 5.3+)", () => {
    checkTokens("a & b | c ~ d << 1 >> 2", [
      "Identifier", "Punctuator", "Identifier", "Punctuator", "Identifier",
      "Punctuator", "Identifier", "Punctuator", "Number", "Punctuator", "Number",
    ], ["&", "|", "~", "<<", ">>"]);
  });

  test("lexes goto keyword (Lua 5.2+)", () => {
    const { tokens, errors } = lex("goto label");
    expect(errors).toEqual([]);
    expect(tokens[0].type).toBe("Keyword");
    expect((tokens[0] as any).value).toBe("goto");
  });

  test("lexes string interpolation (Luau)", () => {
    const { tokens, errors } = lex("`hello {name}!`");
    expect(errors).toEqual([]);
    expect(tokens[0].type).toBe("InterpPart");
  });

  test("lexes attributes (Luau)", () => {
    const { tokens, errors } = lex("@deprecated function f() end");
    expect(errors).toEqual([]);
    expect(tokens[0].type).toBe("Punctuator");
  });

  test("lexes <const> <close> (Lua 5.4)", () => {
    const { tokens, errors } = lex("local x <const> = 1");
    expect(errors).toEqual([]);
    expect(tokens[0].type).toBe("Keyword");
    expect((tokens[1] as any).value).toBe("x");
    expect((tokens[2] as any).value).toBe("<");
  });

  test("lexes Lua 5.4 labels", () => {
    const { tokens, errors } = lex("::start::");
    expect(errors).toEqual([]);
    expect(tokens[0].type).toBe("Punctuator");
    expect((tokens[0] as any).value).toBe("::");
  });

  test("reports unclosed string", () => {
    const { errors } = lex(`"unclosed\n`);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/Unclosed/i);
  });

  test("handles compound assignment operators", () => {
    checkTokens("x += 1; y //= 2; z &= 3; w ..= s", [
      "Identifier", "Punctuator", "Number", "Punctuator",
      "Identifier", "Punctuator", "Number", "Punctuator",
      "Identifier", "Punctuator", "Number", "Punctuator",
      "Identifier", "Punctuator", "Identifier",
    ], ["+=", ";", "//=", ";", "&=", ";", "..="]);
  });
});
