// Fengari type declarations
declare module "fengari" {
  export const FENGARI_AUTHORS: string;
  export const FENGARI_COPYRIGHT: string;
  export const FENGARI_RELEASE: string;
  export const FENGARI_VERSION: string;
  export const FENGARI_VERSION_MAJOR: number;
  export const FENGARI_VERSION_MINOR: number;
  export const FENGARI_VERSION_NUM: number;
  export const FENGARI_VERSION_RELEASE: string;

  export const lua: any;
  export const lauxlib: any;
  export const lualib: any;
  export const luaconf: any;

  export function to_luastring(str: string): any;
  export function to_jsstring(lstr: any): string;
  export function to_uristring(lstr: any): string;
  export function luastring_eq(a: any, b: any): boolean;
  export function luastring_indexOf(haystack: any, needle: any): number;
  export function luastring_of(str: string): any;

  export default {
    FENGARI_AUTHORS,
    FENGARI_COPYRIGHT,
    FENGARI_RELEASE,
    FENGARI_VERSION,
    FENGARI_VERSION_MAJOR,
    FENGARI_VERSION_MINOR,
    FENGARI_VERSION_NUM,
    FENGARI_VERSION_RELEASE,
    lua,
    lauxlib,
    lualib,
    luaconf,
    to_luastring,
    to_jsstring,
    to_uristring,
    luastring_eq,
    luastring_indexOf,
    luastring_of,
  };
}