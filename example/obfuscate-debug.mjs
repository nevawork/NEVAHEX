import { readFileSync, writeFileSync } from "fs";
import { lex } from "../dist/lexer/Lexer.js";
import { parse } from "../dist/parser/Parser.js";
import { obfuscate } from "../dist/obfuscator/Obfuscator.js";
import { encodeStrings } from "../dist/obfuscator/StringEncoder.js";
import { scrambleControlFlow } from "../dist/obfuscator/ControlFlowScrambler.js";
import { regCompile } from "../dist/vm/RegCompiler.js";
import { generateRegVM } from "../dist/vm/reg-vm-gen.js";

// Test with debug level first (no cipher)
const source = readFileSync("example/original.lua", "utf-8");

console.error("[NEVAHEX] target=luau (Roblox Luau) - DEBUG LEVEL");

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
    level: "debug",
    executorGlobals: true,
    polymorphicSeed: Date.now(),
    disableFeatures: [],
    target: "luau",
});

writeFileSync("example/obfuscated-debug.lua", output, "utf-8");
console.error("[NEVAHEX] obfuscated (debug) -> example/obfuscated-debug.lua");