import { lex } from "../src/lexer/Lexer.js";
import { parse, type ParseResult } from "../src/parser/Parser.js";
import { printChunk } from "../src/obfuscator/Printer.js";

function roundTrip(source: string): string {
  const { tokens } = lex(source);
  const ast = parse(tokens);
  return printChunk(ast);
}

describe("Parser", () => {
  test("parses basic statements", () => {
    const out = roundTrip("local x = 1\nprint(x)");
    expect(out).toContain("local x = 1");
    expect(out).toContain("print(x)");
  });

  test("parses local with type annotation", () => {
    const out = roundTrip("local x: number = 42");
    expect(out).toContain("local x: number = 42");
  });

  test("parses goto and labels", () => {
    const out = roundTrip("::start::\nlocal i = 0\n::start::\ngoto start");
    expect(out).toContain("::start::");
    expect(out).toContain("goto start");
  });

  test("parses bitwise operators", () => {
    const out = roundTrip("local a = 0xFF & 0x0F | 0x10");
    expect(out).toMatch(/0xFF/);
    expect(out).toMatch(/&/);
    expect(out).toMatch(/\|/);
  });

  test("parses <const> attributes", () => {
    const out = roundTrip("local x <const> = 42");
    expect(out).toContain("<const> x");
  });

  test("parses <close> attributes", () => {
    const out = roundTrip("local y <close> = setmetatable({}, {__close=function() end})");
    expect(out).toContain("<close> y");
  });

  test("parses Luau string interpolation", () => {
    const out = roundTrip("local x = 1\nprint(`hello {x}`)");
    expect(out).toContain("`hello {x}`");
  });

  test("parses Luau compound assignment", () => {
    const out = roundTrip("local x = 1\nx += 2");
    expect(out).toContain("x += 2");
  });

  test("parses Luau if-else expression", () => {
    const out = roundTrip("local x = if true then 1 else 2");
    expect(out).toContain("if true then 1 else 2");
  });

  test("parses Luau continue", () => {
    const out = roundTrip("for i=1,10 do if i == 5 then continue end end");
    expect(out).toContain("continue");
  });

  test("parses Luau const declaration", () => {
    const out = roundTrip("const PI = 3.14");
    expect(out).toContain("const PI = 3.14");
  });

  test("parses Luau type alias", () => {
    const out = roundTrip("type MyType = number | string");
    expect(out).toContain("type MyType = number | string");
  });

  test("parses Luau type function", () => {
    const out = roundTrip("type function foo(x: number): number return x end");
    expect(out).toContain("type function");
  });

  test("parses while loop", () => {
    const out = roundTrip("local i = 0\nwhile i < 10 do i = i + 1 end");
    expect(out).toContain("while");
    expect(out).toContain("do");
  });

  test("parses repeat-until", () => {
    const out = roundTrip("repeat local x = 1 until x > 0");
    expect(out).toContain("repeat");
    expect(out).toContain("until");
  });

  test("parses numeric for", () => {
    const out = roundTrip("for i=1,10,2 do print(i) end");
    expect(out).toMatch(/for i = 1, 10, 2/);
  });

  test("parses generic for", () => {
    const out = roundTrip("for k,v in pairs({1,2,3}) do print(k,v) end");
    expect(out).toMatch(/for k, v in pairs/);
  });

  test("parses closures", () => {
    const out = roundTrip("local f = function(x) return function(y) return x + y end end");
    expect(out).toContain("function");
  });

  test("parses tables", () => {
    const out = roundTrip('local t = {1, 2, 3, foo = "bar", [4] = "baz"}');
    expect(out).toContain("foo =");
    expect(out).toContain("bar");
  });

  test("parses method calls", () => {
    const out = roundTrip("local x = obj:method(arg)");
    expect(out).toContain("obj:method(arg)");
  });
});
