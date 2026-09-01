import type {
  Chunk,
  Statement,
  LastStatement,
  Expression,
  Var,
  Identifier,
  FuncName,
  Param,
} from "../ast/types.js";
import type { Target } from "../targets.js";
import { DEFAULT_TARGET } from "../targets.js";

const KEYWORDS = new Set([
  "and", "break", "continue", "do", "else", "elseif", "end", "export", "false",
  "for", "function", "goto", "if", "in", "local", "nil", "not", "or",
  "repeat", "return", "then", "true", "until", "while",
]);

const PRESERVED_GLOBALS = new Set([

  "_G", "_ENV", "_VERSION", "game", "workspace", "script", "shared",
  "Players", "Player", "PlayerGui", "Instance", "Vector3", "Vector2", "Vector2int16",
  "Vector3int16", "CFrame", "Color3", "UDim2", "UDim", "Ray", "BrickColor", "Enum",
  "NumberRange", "NumberSequence", "ColorSequence", "Rect", "Region3", "Region3int16",
  "PhysicalProperties", "Faces", "Axes", "TweenInfo", "PathWaypoint",
  "math", "string", "table", "utf8", "buffer", "bit32", "os", "io", "debug", "coroutine",
  "package", "require", "typeof", "type", "pairs", "ipairs", "next",
  "print", "warn", "error", "assert", "tick", "wait", "spawn", "delay",
  "task", "getfenv", "setfenv", "newproxy", "rawequal", "rawget", "rawset",
  "rawlen", "select", "tonumber", "tostring", "pcall", "xpcall", "collectgarbage",
  "dofile", "loadfile", "load", "loadstring", "unpack", "table_unpack",
  "string_pack", "string_unpack",
  "Lighting", "ReplicatedStorage", "ServerScriptService", "ServerStorage",
  "StarterGui", "StarterPack", "StarterPlayer", "StarterPlayerScripts",
  "StarterCharacterScripts", "SoundService", "Sound", "RunService", "TweenService",
  "UserInputService", "HttpService", "PolicyService", "MemoryStoreService",
  "DataStoreService", "MarketplaceService", "MessagingService", "Teams",
  "Chat", "Debris", "PathfindingService", "PhysicsService", "ReplicatedFirst",
  "AssetService", "ContentProvider", "LocalizationService", "BadgeService",
  "VirtualUser", "TestService", "JointsService", "LogService",
  "hookfunction", "hookmetamethod", "newcclosure", "getrawmetatable",
  "setrawmetatable", "getnamecallmethod", "setnamecallmethod",
  "isreadonly", "makewriteable", "make_writable", "checkcaller",
  "getcallingscript", "getscriptclosure", "getprotos", "getconstants",
  "getupvalue", "setupvalue", "getconstant", "setconstant",
  "isluau", "isrbxfunc", "islclosure", "iscclosure", "isexecutor",
  "identifyexecutor", "executor_version",
  "cloneref", "clonereference", "compareinstances", "fireclickdetector",
  "firetouchinterest", "fireproximityprompt",
  "getconnections", "getconnection", "getconnectioncount", "gethiddenproperty",
  "sethiddenproperty", "gethui", "getnilinstances", "getnilinstance",
  "getloadedmodules", "getgc", "getgenv", "getrenv", "getsenv", "setrbxenv",
  "getinstances", "getnilmodules", "getscripts", "getrunningscripts",
  "getscriptbytecode", "decompile",
  "readfile", "writefile", "appendfile", "isfile", "isfolder",
  "makefolder", "delfolder", "delfile", "listfiles",
  "queue_on_teleport", "queueonteleport",
  "setthreadidentity", "getthreadidentity",
  "rconsole", "rprint", "rcapture", "rconsolecreate", "rconsoledestroy",
  "rconsoleclear", "rconsolesettitle", "rconsoleinput",
  "Drawing", "Drawingnew",
  "syn", "fluxus", "protect_gui", "protect_gui_object",
  "mouse1click", "mouse1press", "mouse1release", "mouse2click",
  "mousemoverel", "mousemoveabs", "keypress", "keyrelease", "keytap",
  "setclipboard", "toclipboard", "fromclipboard", "messagebox",
  "request", "http_request", "http_request_async",
  "getexecutorname", "get_hui",
  "crypt", "crypt_base64", "crypt_base64encode", "crypt_base64decode",
  "crypt_hex", "crypt_random",
  "setrbxclipboard", "getrbxclipboard",
  "WebSocket", "WebSocket_connect",
  "firesignal", "fireevent", "firetouchevent", "fireray",
  "WriteFile", "ReadFile", "AppendFile", "IsFile", "IsFolder",
  "MakeFolder", "DelFolder", "ListFiles", "GetCustomAsset", "LoadAsset",
  "saveasset", "saveinstance",
]);

function isValidIdentifier(name: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name) && !KEYWORDS.has(name);
}

function generateName(index: number): string {
  if (index < 26) return String.fromCharCode(97 + index);
  let s = "";
  let n = index;
  while (n >= 0) {
    s = String.fromCharCode(97 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  }
  return s;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ObfuscatorOptions {

  renameLocals?: boolean;

  preserveGlobals?: boolean;

  seed?: number;

  target?: Target;
}

const DEFAULT_OPTIONS: Required<ObfuscatorOptions> = {
  renameLocals: true,
  preserveGlobals: true,
  seed: 0,
  target: DEFAULT_TARGET,
};

export function obfuscate(ast: Chunk, options: ObfuscatorOptions = {}): Chunk {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  if (!opts.renameLocals) return ast;
  const rng = opts.seed ? mulberry32(opts.seed) : undefined;

  const scope = new ScopeManager(opts, rng);
  return transformChunk(ast, scope) as Chunk;
}

class ScopeManager {
  private flat: Map<string, string> = new Map();
  private undoStack: { name: string; prev: string | undefined }[][] = [[]];
  private nameCounter = 0;
  private opts: Required<ObfuscatorOptions>;
  private rng?: () => number;

  constructor(opts: Required<ObfuscatorOptions>, rng?: () => number) {
    this.opts = opts;
    this.rng = rng;
  }

  pushScope(): void {
    this.undoStack.push([]);
  }

  popScope(): void {
    const undo = this.undoStack.pop()!;
    for (let i = undo.length - 1; i >= 0; i--) {
      const entry = undo[i]!;
      if (entry.prev === undefined) {
        this.flat.delete(entry.name);
      } else {
        this.flat.set(entry.name, entry.prev);
      }
    }
  }

  declare(name: string): string {
    if (!isValidIdentifier(name)) return name;
    if (this.rng) {
      let newName: string;
      do {
        newName = generateName(this.nameCounter++ + Math.floor(this.rng() * 1000));
      } while (KEYWORDS.has(newName));
      const prev = this.flat.get(name);
      this.undoStack[this.undoStack.length - 1]!.push({ name, prev });
      this.flat.set(name, newName);
      return newName;
    }
    let newName: string;
    do {
      newName = generateName(this.nameCounter++);
    } while (KEYWORDS.has(newName));
    const prev = this.flat.get(name);
    this.undoStack[this.undoStack.length - 1]!.push({ name, prev });
    this.flat.set(name, newName);
    return newName;
  }

  resolve(name: string): string {
    if (!isValidIdentifier(name)) return name;
    if (this.flat.has(name)) {
      return this.flat.get(name)!;
    }
    if (this.opts.preserveGlobals && PRESERVED_GLOBALS.has(name)) return name;
    return name;
  }
}

function transformChunk(chunk: Chunk, scope: ScopeManager): Chunk {
  return {
    ...chunk,
    body: chunk.body.map((s) => transformStatement(s, scope)),
  };
}

function transformStatement(stmt: Statement | LastStatement, scope: ScopeManager): Statement | LastStatement {
  switch (stmt.type) {
    case "LocalStatement": {
      const values = stmt.values?.map((e) => transformExpression(e, scope));
      const vars = stmt.vars.map((v) => ({
        ...v,
        name: scope.declare(v.name),
      }));
      return { ...stmt, vars, values };
    }
    case "LocalFunctionStatement": {
      const name = scope.declare(stmt.name);
      scope.pushScope();
      const params = stmt.params.map((p) => ({
        ...p,
        name: p.variadic ? "..." : scope.declare(p.name),
      }));
      const body = stmt.body.map((s) => transformStatement(s, scope));
      scope.popScope();
      return { ...stmt, name, params, body };
    }
    case "FunctionStatement": {
      const name = transformFuncName(stmt.name, scope);
      scope.pushScope();
      const params = stmt.params.map((p) => ({
        ...p,
        name: p.variadic ? "..." : scope.declare(p.name),
      }));
      const body = stmt.body.map((s) => transformStatement(s, scope));
      scope.popScope();
      return { ...stmt, name, params, body };
    }
    case "ForNumericStatement": {
      scope.pushScope();
      const v = scope.declare(stmt.var.name);
      const varNode: Identifier = { type: "Identifier", name: v, loc: stmt.var.loc };
      const body = stmt.body.map((s) => transformStatement(s, scope));
      scope.popScope();
      return {
        ...stmt,
        var: varNode,
        start: transformExpression(stmt.start, scope),
        end: transformExpression(stmt.end, scope),
        step: stmt.step ? transformExpression(stmt.step, scope) : undefined,
        body,
      };
    }
    case "ForInStatement": {
      scope.pushScope();
      const vars = stmt.vars.map((v) => ({
        ...v,
        name: scope.declare(v.name),
      }));
      const body = stmt.body.map((s) => transformStatement(s, scope));
      scope.popScope();
      return {
        ...stmt,
        vars,
        iter: stmt.iter.map((e) => transformExpression(e, scope)),
        body,
      };
    }
    case "TypeFunctionStatement":
    case "ExportTypeFunctionStatement": {
      scope.pushScope();
      const params = stmt.params.map((p) => ({
        ...p,
        name: p.variadic ? "..." : scope.declare(p.name),
      }));
      const body = stmt.body.map((s) => transformStatement(s, scope));
      scope.popScope();
      return { ...stmt, params, body };
    }
    case "DoStatement":
      scope.pushScope();
      const doBody = stmt.body.map((s) => transformStatement(s, scope));
      scope.popScope();
      return { ...stmt, body: doBody };
    case "WhileStatement":
      scope.pushScope();
      const whileBody = stmt.body.map((s) => transformStatement(s, scope));
      scope.popScope();
      return {
        ...stmt,
        condition: transformExpression(stmt.condition, scope),
        body: whileBody,
      };
    case "RepeatStatement":
      scope.pushScope();
      const repeatBody = stmt.body.map((s) => transformStatement(s, scope));
      scope.popScope();
      return {
        ...stmt,
        body: repeatBody,
        condition: transformExpression(stmt.condition, scope),
      };
    case "IfStatement":
      scope.pushScope();
      const thenBody = stmt.thenBody.map((s) => transformStatement(s, scope));
      const elseifClauses = stmt.elseifClauses.map((c) => ({
        condition: transformExpression(c.condition, scope),
        body: c.body.map((s) => transformStatement(s, scope)),
      }));
      const elseBody = stmt.elseBody?.map((s) => transformStatement(s, scope));
      scope.popScope();
      return {
        ...stmt,
        condition: transformExpression(stmt.condition, scope),
        thenBody,
        elseifClauses,
        elseBody,
      };
    case "AssignmentStatement":
      return {
        ...stmt,
        vars: stmt.vars.map((v) => transformVar(v, scope)),
        values: stmt.values.map((e) => transformExpression(e, scope)),
      };
    case "CompoundAssignmentStatement":
      return {
        ...stmt,
        var: transformVar(stmt.var, scope),
        value: transformExpression(stmt.value, scope),
      };
    case "FunctionCallStatement":
      return {
        ...stmt,
        call: transformExpression(stmt.call, scope) as any,
      };
    case "ReturnStatement":
      return {
        ...stmt,
        values: stmt.values?.map((e) => transformExpression(e, scope)),
      };
    default:
      return stmt;
  }
}

function transformFuncName(fn: FuncName, scope: ScopeManager): FuncName {
  const base = fn.base.type === "Identifier"
    ? { ...fn.base, name: scope.resolve(fn.base.name) }
    : transformExpression(fn.base, scope) as Identifier | import("../ast/types.js").MemberExpression;
  return { ...fn, base };
}

function transformVar(v: Var, scope: ScopeManager): Var {
  switch (v.type) {
    case "Identifier":
      return { ...v, name: scope.resolve(v.name) };
    case "IndexExpression":
      return {
        ...v,
        object: transformExpression(v.object, scope),
        index: transformExpression(v.index, scope),
      };
    case "MemberExpression":
      return {
        ...v,
        object: transformExpression(v.object, scope),
      };
    default:
      return v;
  }
}

function transformExpression(exp: Expression, scope: ScopeManager): Expression {
  switch (exp.type) {
    case "Identifier":
      return { ...exp, name: scope.resolve(exp.name) };
    case "BinaryExpression":
      return {
        ...exp,
        left: transformExpression(exp.left, scope),
        right: transformExpression(exp.right, scope),
      };
    case "UnaryExpression":
      return {
        ...exp,
        argument: transformExpression(exp.argument, scope),
      };
    case "CallExpression":
      return {
        ...exp,
        callee: transformExpression(exp.callee, scope),
        args: exp.args.map((a) => transformExpression(a, scope)),
      };
    case "MethodCallExpression":
      return {
        ...exp,
        object: transformExpression(exp.object, scope),
        args: exp.args.map((a) => transformExpression(a, scope)),
      };
    case "IndexExpression":
      return {
        ...exp,
        object: transformExpression(exp.object, scope),
        index: transformExpression(exp.index, scope),
      };
    case "MemberExpression":
      return {
        ...exp,
        object: transformExpression(exp.object, scope),
      };
    case "TableConstructor":
      return {
        ...exp,
        fields: exp.fields.map((f) => {
          if (f.kind === "index") return { ...f, index: transformExpression(f.index, scope), value: transformExpression(f.value, scope) };
          if (f.kind === "named") return { ...f, value: transformExpression(f.value, scope) };
          return { ...f, value: transformExpression(f.value, scope) };
        }),
      };
    case "FunctionExpression": {
      scope.pushScope();
      const params = exp.params.map((p) => ({
        ...p,
        name: p.variadic ? "..." : scope.declare(p.name),
      }));
      const body = exp.body.map((s) => transformStatement(s, scope));
      scope.popScope();
      return { ...exp, params, body };
    }
    case "ParenExpression":
      return { ...exp, expression: transformExpression(exp.expression, scope) };
    case "TypeAssertion":
      return {
        ...exp,
        expression: transformExpression(exp.expression, scope),
      };
    case "IfElseExpression":
      return {
        ...exp,
        condition: transformExpression(exp.condition, scope),
        thenExp: transformExpression(exp.thenExp, scope),
        elseifClauses: exp.elseifClauses.map((c) => ({
          condition: transformExpression(c.condition, scope),
          value: transformExpression(c.value, scope),
        })),
        elseExp: transformExpression(exp.elseExp, scope),
      };
    case "StringInterpolation":
      return {
        ...exp,
        parts: exp.parts.map((p) => (typeof p === "string" ? p : transformExpression(p, scope))),
      };
    default:
      return exp;
  }
}
