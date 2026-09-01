import { readFileSync, writeFileSync } from "fs";
import { lex } from "../dist/src/lexer/Lexer.js";
import { parse } from "../dist/src/parser/Parser.js";
import { obfuscate } from "../dist/src/obfuscator/Obfuscator.js";
import { encodeStrings } from "../dist/src/obfuscator/StringEncoder.js";
import { scrambleControlFlow } from "../dist/src/obfuscator/ControlFlowScrambler.js";
import { regCompile } from "../dist/src/vm/RegCompiler.js";
import { generateRegVM } from "../dist/src/vm/reg-vm-gen.js";

const source = readFileSync("example/original.lua", "utf-8");

console.error("[NEVAHEX] target=luau (Roblox Luau)");

const { tokens, errors } = lex(source);
if (errors.length > 0) {
    console.error("Lexer errors:", errors);
    process.exit(1);
}

let ast = parse(tokens);
ast = encodeStrings(ast, { enabled: true });
ast = scrambleControlFlow(ast, { enabled: true });

const obfuscated = obfuscate(ast, {
    renameLocals: true,
    preserveGlobals: true,
    target: "luau",
});

const chunk = regCompile(obfuscated);
const output = generateRegVM(chunk, {
    level: "max",
    executorGlobals: true,
    polymorphicSeed: Date.now(),
    disableFeatures: [],
    target: "luau",
});

writeFileSync("example/obfuscated.lua", output, "utf-8");
console.error("[NEVAHEX] obfuscated -> example/obfuscated.lua");