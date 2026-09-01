--[[
___   ___  ________  _________  ________  ________  _______      ___    ___ 
\  \ /  / |\   __  \|\___   ___\\   __  \|\   __  \|\  ___ \    |\  \  /  /|
 \  V  /  \ \  \|\  \|___ \  \_\ \  \|\  \ \  \|\  \ \   __/|   \ \  \/  / /
 /   /  / \ \   __  \   \ \  \  \ \   _  _\ \   __  \ \  \_|/__  \ \    / / 
/   /__/   \ \  \ \  \   \ \  \  \ \  \\  \\ \  \ \  \ \  \_|\ \  /     \/  
\________/\__\__\__\__\__\__\__\__\__\______\__\______\_______\/___________/

https://nevahex.dev | NEVAHEX Multi-Target Lua/Luau Protection - VM-grade bytecode for Lua 5.1-5.4 and Roblox Luau
]]
--[[ NEVAHEX target=luau ]]
local nh_tgt_m4="luau"
local nh_exec_gwm="unknown"
if type(game)~="nil" and typeof and typeof(game)~="nil" then nh_exec_gwm="roblox" end
if type(syn)~="table" then nh_exec_gwm="synapse" end
if type(fluxus)~="table" then nh_exec_gwm="fluxus" end
if type(identifyexecutor)=="function" then local _n=identifyexecutor();if type(_n)=="string" then nh_exec_gwm=_n end end
if type(bit32)=="table" then bit32=bit32
else
  local nh_b32_gnq={}
  function nh_b32_gnq.bxor(a,b) local r=0;for i=0,31 do local x,y=((a//(2^i))%2),((b//(2^i))%2);if (x+y)%2==1 then r=r+(2^i) end end;return r end
  function nh_b32_gnq.band(a,b) local r=0;for i=0,31 do if ((a//(2^i))%2==1) and ((b//(2^i))%2==1) then r=r+(2^i) end end;return r end
  function nh_b32_gnq.bor(a,b) local r=0;for i=0,31 do if ((a//(2^i))%2==1) or ((b//(2^i))%2==1) then r=r+(2^i) end end;return r end
  function nh_b32_gnq.lrotate(a,disp) disp=disp%32;if disp<0 then disp=disp+32 end;return ((a<<disp)|(a>>(32-disp)))&0xFFFFFFFF end
  function nh_b32_gnq.lshift(a,disp) return (a<<disp)&0xFFFFFFFF end
  function nh_b32_gnq.rshift(a,disp) return a>>disp end
  bit32=nh_b32_gnq
end
if type(table.create)~="function" then table.create=function(n,v) local t={};for _i=1,n do t[_i]=v end;return t end end
if type(table.pack)~="function" then table.pack=function(...) return {n=select("#",...),...} end end
if type(string.pack)~="function" or not pcall(string.pack,">I4",0) then
  local _orig_unpack=string.unpack;
  string.pack=function(fmt,...) local args={...};local n=select("#",...);local out={};local ai=1;local fi=1;
    while fi<=#fmt do local c=string.sub(fmt,fi,fi);fi=fi+1;
      if c==">" or c=="<" or c=="!" or c=="x" or c=="X" or c=="=" then elseif c=="I" then local sz=4;if string.sub(fmt,fi,fi)=="4" then fi=fi+1 end;local v=assert(args[ai],"missing arg");ai=ai+1;local a,b,c2,d;v=math.floor(v);if c==">" or c=="!" then a=math.floor(v/16777216)%256;b=math.floor(v/65536)%256;c2=math.floor(v/256)%256;d=v%256 else d=math.floor(v/16777216)%256;c2=math.floor(v/65536)%256;b=math.floor(v/256)%256;a=v%256 end;out[#out+1]=string.char(a,b,c2,d)elseif c=="B" then local v=assert(args[ai],"missing arg");ai=ai+1;out[#out+1]=string.char(v%256)elseif c=="b" then local v=assert(args[ai],"missing arg");ai=ai+1;out[#out+1]=string.char((v%256+256)%256)end end;
    return table.concat(out) end;
  string.unpack=_orig_unpack or function(s,fmt) return string.byte(s,1),2 end;
  string.packsize=string.packsize or function(fmt) local n=0;for i=1,#fmt do local c=string.sub(fmt,i,i);if c=="I" or c=="i" then n=n+4 end end;return n end;
end
local nh_safe_vbq={}
function nh_safe_vbq.hookfunction(f,r) return r end
function nh_safe_vbq.hookmetamethod(t,k,f) return f end
function nh_safe_vbq.newcclosure(f) return f end
function nh_safe_vbq.getrawmetatable(t) local mt=getmetatable(t);if type(mt)=="table" and mt.__metatable then return nil end;return mt end
function nh_safe_vbq.isreadonly(t) return false end
function nh_safe_vbq.makewriteable(t) return t end
function nh_safe_vbq.checkcaller() return false end
function nh_safe_vbq.cloneref(r) return r end
function nh_safe_vbq.getconnections() return {} end
function nh_safe_vbq.getgc() return {} end
function nh_safe_vbq.getinstances() return {} end
function nh_safe_vbq.getscripts() return {} end
function nh_safe_vbq.readfile() return nil end
function nh_safe_vbq.writefile() return false end
function nh_safe_vbq.isfile() return false end
function nh_safe_vbq.makefolder() return false end
for nh_k_r0w,nh_v_m73 in pairs(nh_safe_vbq) do if rawget(_G,nh_k_r0w)==nil then rawset(_G,nh_k_r0w,nh_v_m73) end end
local _pcall=pcall
local _xpcall=xpcall
local _select=select
local _type=type
local _tpack=table.pack
local _tunpack=table.unpack
local _tcreate=table.create
local _tconcat=table.concat
local _mfloor=math.floor
local _ipairs=ipairs
local _tostring=tostring
local _rawget=rawget
local _setmeta=setmetatable
local _bxor=bit32.bxor
local _band=bit32.band
local _getmeta=getmetatable
local _next=next
local _hookOk=true
local _genv=(type(getfenv)=="function" and getfenv(0)) or _G
local _env=setmetatable({print=print,warn=warn,error=error,assert=assert,type=type,typeof=typeof,tostring=tostring,tonumber=tonumber,pcall=pcall,xpcall=xpcall,select=select,unpack=unpack,pairs=pairs,ipairs=ipairs,next=next,rawget=rawget,rawset=rawset,rawequal=rawequal,rawlen=rawlen,setmetatable=setmetatable,getmetatable=getmetatable,collectgarbage=collectgarbage,dofile=dofile,gcinfo=gcinfo,string=string,table=table,math=math,bit32=bit32,coroutine=coroutine,os=os,debug=debug,utf8=utf8,buffer=buffer,game=game,workspace=workspace,script=script,Instance=Instance,Enum=Enum,Vector3=Vector3,Vector2=Vector2,CFrame=CFrame,Color3=Color3,BrickColor=BrickColor,UDim=UDim,UDim2=UDim2,Ray=Ray,Region3=Region3,Rect=Rect,TweenInfo=TweenInfo,NumberSequence=NumberSequence,ColorSequence=ColorSequence,NumberRange=NumberRange,NumberSequenceKeypoint=NumberSequenceKeypoint,ColorSequenceKeypoint=ColorSequenceKeypoint,PhysicalProperties=PhysicalProperties,Axes=Axes,Faces=Faces,PathWaypoint=PathWaypoint,Random=Random,DateTime=DateTime,RaycastParams=RaycastParams,OverlapParams=OverlapParams,Font=Font,FloatCurveKey=FloatCurveKey,RotationCurveKey=RotationCurveKey,tick=tick,time=time,wait=wait,task=task,spawn=spawn,delay=delay,require=require,loadstring=loadstring,load=load,getfenv=getfenv,setfenv=setfenv,newproxy=newproxy,_G=_G,shared=shared,settings=settings,stats=stats,UserSettings=UserSettings,version=version},{__index=function(_,k) local ok,v=pcall(function() return _genv[k] end);if ok then return v end;return nil end})
do local ok,v=pcall(function() return _genv["getgenv"] end);if ok and v~=nil then _env["getgenv"]=v end end
do local ok,v=pcall(function() return _genv["getrenv"] end);if ok and v~=nil then _env["getrenv"]=v end end
do local ok,v=pcall(function() return _genv["getsenv"] end);if ok and v~=nil then _env["getsenv"]=v end end
do local ok,v=pcall(function() return _genv["getrawmetatable"] end);if ok and v~=nil then _env["getrawmetatable"]=v end end
do local ok,v=pcall(function() return _genv["setrawmetatable"] end);if ok and v~=nil then _env["setrawmetatable"]=v end end
do local ok,v=pcall(function() return _genv["hookfunction"] end);if ok and v~=nil then _env["hookfunction"]=v end end
do local ok,v=pcall(function() return _genv["hookfunc"] end);if ok and v~=nil then _env["hookfunc"]=v end end
do local ok,v=pcall(function() return _genv["hookmetamethod"] end);if ok and v~=nil then _env["hookmetamethod"]=v end end
do local ok,v=pcall(function() return _genv["newcclosure"] end);if ok and v~=nil then _env["newcclosure"]=v end end
do local ok,v=pcall(function() return _genv["clonefunction"] end);if ok and v~=nil then _env["clonefunction"]=v end end
do local ok,v=pcall(function() return _genv["cloneref"] end);if ok and v~=nil then _env["cloneref"]=v end end
do local ok,v=pcall(function() return _genv["compareinstances"] end);if ok and v~=nil then _env["compareinstances"]=v end end
do local ok,v=pcall(function() return _genv["iscclosure"] end);if ok and v~=nil then _env["iscclosure"]=v end end
do local ok,v=pcall(function() return _genv["islclosure"] end);if ok and v~=nil then _env["islclosure"]=v end end
do local ok,v=pcall(function() return _genv["isexecutorclosure"] end);if ok and v~=nil then _env["isexecutorclosure"]=v end end
do local ok,v=pcall(function() return _genv["checkclosure"] end);if ok and v~=nil then _env["checkclosure"]=v end end
do local ok,v=pcall(function() return _genv["isourclosure"] end);if ok and v~=nil then _env["isourclosure"]=v end end
do local ok,v=pcall(function() return _genv["checkcaller"] end);if ok and v~=nil then _env["checkcaller"]=v end end
do local ok,v=pcall(function() return _genv["getconnections"] end);if ok and v~=nil then _env["getconnections"]=v end end
do local ok,v=pcall(function() return _genv["firesignal"] end);if ok and v~=nil then _env["firesignal"]=v end end
do local ok,v=pcall(function() return _genv["fireclickdetector"] end);if ok and v~=nil then _env["fireclickdetector"]=v end end
do local ok,v=pcall(function() return _genv["fireproximityprompt"] end);if ok and v~=nil then _env["fireproximityprompt"]=v end end
do local ok,v=pcall(function() return _genv["firetouchinterest"] end);if ok and v~=nil then _env["firetouchinterest"]=v end end
do local ok,v=pcall(function() return _genv["getgc"] end);if ok and v~=nil then _env["getgc"]=v end end
do local ok,v=pcall(function() return _genv["getinstances"] end);if ok and v~=nil then _env["getinstances"]=v end end
do local ok,v=pcall(function() return _genv["getnilinstances"] end);if ok and v~=nil then _env["getnilinstances"]=v end end
do local ok,v=pcall(function() return _genv["getscripts"] end);if ok and v~=nil then _env["getscripts"]=v end end
do local ok,v=pcall(function() return _genv["getrunningscripts"] end);if ok and v~=nil then _env["getrunningscripts"]=v end end
do local ok,v=pcall(function() return _genv["getloadedmodules"] end);if ok and v~=nil then _env["getloadedmodules"]=v end end
do local ok,v=pcall(function() return _genv["getcallingscript"] end);if ok and v~=nil then _env["getcallingscript"]=v end end
do local ok,v=pcall(function() return _genv["getactors"] end);if ok and v~=nil then _env["getactors"]=v end end
do local ok,v=pcall(function() return _genv["getscriptbytecode"] end);if ok and v~=nil then _env["getscriptbytecode"]=v end end
do local ok,v=pcall(function() return _genv["dumpstring"] end);if ok and v~=nil then _env["dumpstring"]=v end end
do local ok,v=pcall(function() return _genv["getscripthash"] end);if ok and v~=nil then _env["getscripthash"]=v end end
do local ok,v=pcall(function() return _genv["getscriptclosure"] end);if ok and v~=nil then _env["getscriptclosure"]=v end end
do local ok,v=pcall(function() return _genv["decompile"] end);if ok and v~=nil then _env["decompile"]=v end end
do local ok,v=pcall(function() return _genv["readfile"] end);if ok and v~=nil then _env["readfile"]=v end end
do local ok,v=pcall(function() return _genv["writefile"] end);if ok and v~=nil then _env["writefile"]=v end end
do local ok,v=pcall(function() return _genv["appendfile"] end);if ok and v~=nil then _env["appendfile"]=v end end
do local ok,v=pcall(function() return _genv["loadfile"] end);if ok and v~=nil then _env["loadfile"]=v end end
do local ok,v=pcall(function() return _genv["listfiles"] end);if ok and v~=nil then _env["listfiles"]=v end end
do local ok,v=pcall(function() return _genv["isfile"] end);if ok and v~=nil then _env["isfile"]=v end end
do local ok,v=pcall(function() return _genv["isfolder"] end);if ok and v~=nil then _env["isfolder"]=v end end
do local ok,v=pcall(function() return _genv["makefolder"] end);if ok and v~=nil then _env["makefolder"]=v end end
do local ok,v=pcall(function() return _genv["delfolder"] end);if ok and v~=nil then _env["delfolder"]=v end end
do local ok,v=pcall(function() return _genv["delfile"] end);if ok and v~=nil then _env["delfile"]=v end end
do local ok,v=pcall(function() return _genv["setclipboard"] end);if ok and v~=nil then _env["setclipboard"]=v end end
do local ok,v=pcall(function() return _genv["toclipboard"] end);if ok and v~=nil then _env["toclipboard"]=v end end
do local ok,v=pcall(function() return _genv["getclipboard"] end);if ok and v~=nil then _env["getclipboard"]=v end end
do local ok,v=pcall(function() return _genv["setrbxclipboard"] end);if ok and v~=nil then _env["setrbxclipboard"]=v end end
do local ok,v=pcall(function() return _genv["queue_on_teleport"] end);if ok and v~=nil then _env["queue_on_teleport"]=v end end
do local ok,v=pcall(function() return _genv["queueonteleport"] end);if ok and v~=nil then _env["queueonteleport"]=v end end
do local ok,v=pcall(function() return _genv["setthreadidentity"] end);if ok and v~=nil then _env["setthreadidentity"]=v end end
do local ok,v=pcall(function() return _genv["getthreadidentity"] end);if ok and v~=nil then _env["getthreadidentity"]=v end end
do local ok,v=pcall(function() return _genv["setidentity"] end);if ok and v~=nil then _env["setidentity"]=v end end
do local ok,v=pcall(function() return _genv["getidentity"] end);if ok and v~=nil then _env["getidentity"]=v end end
do local ok,v=pcall(function() return _genv["setthreadcontext"] end);if ok and v~=nil then _env["setthreadcontext"]=v end end
do local ok,v=pcall(function() return _genv["getthreadcontext"] end);if ok and v~=nil then _env["getthreadcontext"]=v end end
do local ok,v=pcall(function() return _genv["getnamecallmethod"] end);if ok and v~=nil then _env["getnamecallmethod"]=v end end
do local ok,v=pcall(function() return _genv["setnamecallmethod"] end);if ok and v~=nil then _env["setnamecallmethod"]=v end end
do local ok,v=pcall(function() return _genv["isreadonly"] end);if ok and v~=nil then _env["isreadonly"]=v end end
do local ok,v=pcall(function() return _genv["setreadonly"] end);if ok and v~=nil then _env["setreadonly"]=v end end
do local ok,v=pcall(function() return _genv["gethiddenproperty"] end);if ok and v~=nil then _env["gethiddenproperty"]=v end end
do local ok,v=pcall(function() return _genv["sethiddenproperty"] end);if ok and v~=nil then _env["sethiddenproperty"]=v end end
do local ok,v=pcall(function() return _genv["isscriptable"] end);if ok and v~=nil then _env["isscriptable"]=v end end
do local ok,v=pcall(function() return _genv["setscriptable"] end);if ok and v~=nil then _env["setscriptable"]=v end end
do local ok,v=pcall(function() return _genv["identifyexecutor"] end);if ok and v~=nil then _env["identifyexecutor"]=v end end
do local ok,v=pcall(function() return _genv["getexecutorname"] end);if ok and v~=nil then _env["getexecutorname"]=v end end
do local ok,v=pcall(function() return _genv["request"] end);if ok and v~=nil then _env["request"]=v end end
do local ok,v=pcall(function() return _genv["http_request"] end);if ok and v~=nil then _env["http_request"]=v end end
do local ok,v=pcall(function() return _genv["syn"] end);if ok and v~=nil then _env["syn"]=v end end
do local ok,v=pcall(function() return _genv["http"] end);if ok and v~=nil then _env["http"]=v end end
do local ok,v=pcall(function() return _genv["WebSocket"] end);if ok and v~=nil then _env["WebSocket"]=v end end
do local ok,v=pcall(function() return _genv["cache"] end);if ok and v~=nil then _env["cache"]=v end end
do local ok,v=pcall(function() return _genv["Drawing"] end);if ok and v~=nil then _env["Drawing"]=v end end
do local ok,v=pcall(function() return _genv["cleardrawcache"] end);if ok and v~=nil then _env["cleardrawcache"]=v end end
do local ok,v=pcall(function() return _genv["isrenderobj"] end);if ok and v~=nil then _env["isrenderobj"]=v end end
do local ok,v=pcall(function() return _genv["crypt"] end);if ok and v~=nil then _env["crypt"]=v end end
do local ok,v=pcall(function() return _genv["base64"] end);if ok and v~=nil then _env["base64"]=v end end
do local ok,v=pcall(function() return _genv["lz4compress"] end);if ok and v~=nil then _env["lz4compress"]=v end end
do local ok,v=pcall(function() return _genv["lz4decompress"] end);if ok and v~=nil then _env["lz4decompress"]=v end end
do local ok,v=pcall(function() return _genv["mouse1click"] end);if ok and v~=nil then _env["mouse1click"]=v end end
do local ok,v=pcall(function() return _genv["mouse1press"] end);if ok and v~=nil then _env["mouse1press"]=v end end
do local ok,v=pcall(function() return _genv["mouse1release"] end);if ok and v~=nil then _env["mouse1release"]=v end end
do local ok,v=pcall(function() return _genv["mouse2click"] end);if ok and v~=nil then _env["mouse2click"]=v end end
do local ok,v=pcall(function() return _genv["mouse2press"] end);if ok and v~=nil then _env["mouse2press"]=v end end
do local ok,v=pcall(function() return _genv["mouse2release"] end);if ok and v~=nil then _env["mouse2release"]=v end end
do local ok,v=pcall(function() return _genv["mousemoveabs"] end);if ok and v~=nil then _env["mousemoveabs"]=v end end
do local ok,v=pcall(function() return _genv["mousemoverel"] end);if ok and v~=nil then _env["mousemoverel"]=v end end
do local ok,v=pcall(function() return _genv["mousescroll"] end);if ok and v~=nil then _env["mousescroll"]=v end end
do local ok,v=pcall(function() return _genv["gethui"] end);if ok and v~=nil then _env["gethui"]=v end end
do local ok,v=pcall(function() return _genv["getcustomasset"] end);if ok and v~=nil then _env["getcustomasset"]=v end end
do local ok,v=pcall(function() return _genv["getcallbackvalue"] end);if ok and v~=nil then _env["getcallbackvalue"]=v end end
do local ok,v=pcall(function() return _genv["messagebox"] end);if ok and v~=nil then _env["messagebox"]=v end end
do local ok,v=pcall(function() return _genv["isrbxactive"] end);if ok and v~=nil then _env["isrbxactive"]=v end end
do local ok,v=pcall(function() return _genv["isgameactive"] end);if ok and v~=nil then _env["isgameactive"]=v end end
do local ok,v=pcall(function() return _genv["setfpscap"] end);if ok and v~=nil then _env["setfpscap"]=v end end
do local ok,v=pcall(function() return _genv["getregistry"] end);if ok and v~=nil then _env["getregistry"]=v end end
do local ok,v=pcall(function() return _genv["getreg"] end);if ok and v~=nil then _env["getreg"]=v end end
do local ok,v=pcall(function() return _genv["getstack"] end);if ok and v~=nil then _env["getstack"]=v end end
do local ok,v=pcall(function() return _genv["rconsoleclear"] end);if ok and v~=nil then _env["rconsoleclear"]=v end end
do local ok,v=pcall(function() return _genv["rconsolecreate"] end);if ok and v~=nil then _env["rconsolecreate"]=v end end
do local ok,v=pcall(function() return _genv["rconsoledestroy"] end);if ok and v~=nil then _env["rconsoledestroy"]=v end end
do local ok,v=pcall(function() return _genv["rconsoleinput"] end);if ok and v~=nil then _env["rconsoleinput"]=v end end
do local ok,v=pcall(function() return _genv["rconsoleprint"] end);if ok and v~=nil then _env["rconsoleprint"]=v end end
do local ok,v=pcall(function() return _genv["rconsolesettitle"] end);if ok and v~=nil then _env["rconsolesettitle"]=v end end
do local ok,v=pcall(function() return _genv["rconsolename"] end);if ok and v~=nil then _env["rconsolename"]=v end end
do local ok,v=pcall(function() return _genv["consoleclear"] end);if ok and v~=nil then _env["consoleclear"]=v end end
do local ok,v=pcall(function() return _genv["consolecreate"] end);if ok and v~=nil then _env["consolecreate"]=v end end
do local ok,v=pcall(function() return _genv["consoledestroy"] end);if ok and v~=nil then _env["consoledestroy"]=v end end
do local ok,v=pcall(function() return _genv["consoleinput"] end);if ok and v~=nil then _env["consoleinput"]=v end end
do local ok,v=pcall(function() return _genv["consoleprint"] end);if ok and v~=nil then _env["consoleprint"]=v end end
do local ok,v=pcall(function() return _genv["consolesettitle"] end);if ok and v~=nil then _env["consolesettitle"]=v end end
do local ok,v=pcall(function() return _genv["run_on_actor"] end);if ok and v~=nil then _env["run_on_actor"]=v end end
do local ok,v=pcall(function() return _genv["runonactor"] end);if ok and v~=nil then _env["runonactor"]=v end end
do local ok,v=pcall(function() return _genv["getstack"] end);if ok and v~=nil then _env["getstack"]=v end end

local function _run(K,code,protos,upvals,nParams,maxRegs,_isVararg,_env,...)
protos=protos or {}
upvals=upvals or {}
local R=_tcreate(maxRegs+1)
local _args={...}
local _ac=_select("#",...)
for _i=1,((_ac<nParams) and _ac or nParams) do R[_i]=_args[_i] end
local VA={}
local VAC=0
if _isVararg then VAC=_ac-nParams;if VAC<0 then VAC=0 end;for _i=1,VAC do VA[_i]=_args[nParams+_i] end end
local ip=1
local openUVs={}
local _ic={}
local _top=0
local _tw;do local _t=_env["task"];if _t then _tw=_t["wait"] end end
local function RK(x) if x>=256 then return K[x-255] else return R[x+1] end end
local _opNames={[0]="NOP",[1]="LOADK",[2]="LOADNIL",[3]="LOADBOOL",[4]="MOVE",[5]="GETGLOBAL",[6]="SETGLOBAL",[7]="GETTABLE",[8]="SETTABLE",[9]="NEWTABLE",[10]="ADD",[11]="SUB",[12]="MUL",[13]="DIV",[14]="MOD",[15]="POW",[16]="IDIV",[17]="UNM",[18]="NOT",[19]="LEN",[20]="CONCAT",[21]="JMP",[22]="EQ",[23]="LT",[24]="LE",[25]="TEST",[26]="TESTSET",[27]="CALL",[28]="TAILCALL",[29]="RETURN",[30]="FORPREP",[31]="FORLOOP",[32]="TFORLOOP",[33]="SETLIST",[34]="CLOSURE",[35]="VARARG",[36]="SELF",[37]="GETUPVAL",[38]="SETUPVAL",[39]="CLOSEUPVAL",[40]="PCALL",[41]="XPCALL",[42]="ITERPREP",[43]="LOADKX",[44]="EXTRAARG",[45]="F_TEST_JMP",[46]="F_EQ_JMP",[47]="F_LT_JMP",[48]="F_LE_JMP",[49]="F_TESTSET_JMP",[50]="F_GGET",[51]="F_LOADKK",[52]="F_MOVE_MOVE",[53]="F_SELF_CALL",[54]="F_GGET_CALL",[55]="F_LOADK_RET",[56]="F_MOVE_RET"}
while ip<=#code do
local a=code[ip]
local _s1=code[ip+1]
local _s2=code[ip+2]
local _s3=code[ip+3]
ip=ip+4
_env.print("[VM] ip="..(ip-4).." "..((_opNames and _opNames[a]) or "OP"..a).." s1="..tostring(_s1).." s2="..tostring(_s2).." s3="..tostring(_s3))
if a==0 then local A,B,C=_s1,_s2,_s3;
elseif a==1 then local A,B,C=_s1,_s2,_s3;R[A+1]=K[B+1]
elseif a==2 then local A,B,C=_s1,_s2,_s3;for _i=A,A+B do R[_i+1]=nil end
elseif a==3 then local A,B,C=_s1,_s2,_s3;R[A+1]=(B~=0);if C~=0 then ip=ip+4 end
elseif a==4 then local A,B,C=_s1,_s2,_s3;R[A+1]=R[B+1]
elseif a==5 then local A,B,C=_s1,_s2,_s3;do local _k=K[B+1];if _ic[1]==_k then R[A+1]=_ic[2] else local _v=_env[_k];R[A+1]=_v;_ic[1]=_k;_ic[2]=_v end end
elseif a==6 then local A,B,C=_s1,_s2,_s3;do _env[K[B+1]]=R[A+1];_ic[1]=nil end
elseif a==7 then local A,B,C=_s1,_s2,_s3;R[A+1]=R[B+1][RK(C)]
elseif a==8 then local A,B,C=_s1,_s2,_s3;R[A+1][RK(B)]=RK(C)
elseif a==9 then local A,B,C=_s1,_s2,_s3;R[A+1]={}
elseif a==10 then local A,B,C=_s1,_s2,_s3;R[A+1]=RK(B)+RK(C)
elseif a==11 then local A,B,C=_s1,_s2,_s3;R[A+1]=RK(B)-RK(C)
elseif a==12 then local A,B,C=_s1,_s2,_s3;R[A+1]=RK(B)*RK(C)
elseif a==13 then local A,B,C=_s1,_s2,_s3;R[A+1]=RK(B)/RK(C)
elseif a==14 then local A,B,C=_s1,_s2,_s3;R[A+1]=RK(B)%RK(C)
elseif a==15 then local A,B,C=_s1,_s2,_s3;R[A+1]=RK(B)^RK(C)
elseif a==16 then local A,B,C=_s1,_s2,_s3;R[A+1]=_mfloor(RK(B)/RK(C))
elseif a==17 then local A,B,C=_s1,_s2,_s3;R[A+1]=-R[B+1]
elseif a==18 then local A,B,C=_s1,_s2,_s3;R[A+1]=not R[B+1]
elseif a==19 then local A,B,C=_s1,_s2,_s3;R[A+1]=#R[B+1]
elseif a==20 then local A,B,C=_s1,_s2,_s3;do if C-B<=1 then R[A+1]=R[B+1]..R[C+1] else local _t={};for _i=B,C do _t[#_t+1]=R[_i+1] end;R[A+1]=_tconcat(_t) end end
elseif a==21 then local A,B,C=_s1,_s2,_s3;ip=ip+B*4
elseif a==22 then local A,B,C=_s1,_s2,_s3;if (RK(B)==RK(C))~=(A~=0) then ip=ip+4 end
elseif a==23 then local A,B,C=_s1,_s2,_s3;if (RK(B)<RK(C))~=(A~=0) then ip=ip+4 end
elseif a==24 then local A,B,C=_s1,_s2,_s3;if (RK(B)<=RK(C))~=(A~=0) then ip=ip+4 end
elseif a==25 then local A,B,C=_s1,_s2,_s3;if (not R[A+1])==(C~=0) then ip=ip+4 end
elseif a==26 then local A,B,C=_s1,_s2,_s3;if (not R[B+1])==(C~=0) then ip=ip+4 else R[A+1]=R[B+1] end
elseif a==27 then local A,B,C=_s1,_s2,_s3;do local f=R[A+1];local r;if B==1 then r=_tpack(f()) elseif B==2 then r=_tpack(f(R[A+2])) elseif B==3 then r=_tpack(f(R[A+2],R[A+3])) elseif B==0 then r=_tpack(f(_tunpack(R,A+2,_top))) else r=_tpack(f(_tunpack(R,A+2,A+B))) end;if C==0 then for _i=1,r.n do R[A+_i]=r[_i] end;_top=A+r.n else for _i=1,C-1 do R[A+_i]=r[_i] end end end
elseif a==28 then local A,B,C=_s1,_s2,_s3;do local f=R[A+1];if B==1 then return f() elseif B==2 then return f(R[A+2]) elseif B==3 then return f(R[A+2],R[A+3]) elseif B==0 then return f(_tunpack(R,A+2,_top)) else return f(_tunpack(R,A+2,A+B)) end end
elseif a==29 then local A,B,C=_s1,_s2,_s3;do if B==0 then return _tunpack(R,A+1,_top) elseif B==1 then return else return _tunpack(R,A+1,A+B-1) end end
elseif a==30 then local A,B,C=_s1,_s2,_s3;R[A+1]=R[A+1]-R[A+3];ip=ip+B*4
elseif a==31 then local A,B,C=_s1,_s2,_s3;do local step=R[A+3];local idx=R[A+1]+step;R[A+1]=idx;local lim=R[A+2];if step>0 then if idx<=lim then ip=ip+B*4;R[A+4]=idx end else if idx>=lim then ip=ip+B*4;R[A+4]=idx end end end
elseif a==32 then local A,B,C=_s1,_s2,_s3;do local f=R[A+1];local s=R[A+2];local v=R[A+3];local r={f(s,v)};for _i=1,C do R[A+3+_i]=r[_i] end;if r[1]~=nil then R[A+3]=r[1];ip=ip+4 end end
elseif a==33 then local A,B,C=_s1,_s2,_s3;do local t=R[A+1];local _b=B;if _b==0 then _b=_top-(A+1) end;local base=C-1;for _i=1,_b do t[base+_i]=R[A+1+_i] end end
elseif a==34 then local A,B,C=_s1,_s2,_s3;do local proto=protos[B+1];if proto then local nU={};if proto.U then for _ui,_ud in _ipairs(proto.U) do if _ud[1]==1 then local _b;for _oi=1,#openUVs do if openUVs[_oi][2]==_ud[2]+1 then _b=openUVs[_oi];break end end;if not _b then _b={R,_ud[2]+1};openUVs[#openUVs+1]=_b end;nU[_ui]=_b else nU[_ui]=upvals[_ud[2]+1] end end end;R[A+1]=function(...) return _run(proto.K,proto.C,proto.P,proto.U and nU or {},proto.nParams,proto.mR,proto.vA,_env,...) end else R[A+1]=nil end end
elseif a==35 then local A,B,C=_s1,_s2,_s3;do if B==0 then for _i=1,VAC do R[A+_i]=VA[_i] end;_top=A+VAC else for _i=1,B-1 do R[A+_i]=VA[_i] end end end
elseif a==36 then local A,B,C=_s1,_s2,_s3;R[A+2]=R[B+1];R[A+1]=R[B+1][RK(C)]
elseif a==37 then local A,B,C=_s1,_s2,_s3;do local _b=upvals[B+1];if _b[2] then R[A+1]=_b[1][_b[2]] else R[A+1]=_b[1] end end
elseif a==38 then local A,B,C=_s1,_s2,_s3;do local _b=upvals[B+1];if _b[2] then _b[1][_b[2]]=R[A+1] else _b[1]=R[A+1] end end
elseif a==39 then local A,B,C=_s1,_s2,_s3;do local _n=0;for _i=1,#openUVs do local _b=openUVs[_i];if _b[2]>=A+1 then _b[1]=_b[1][_b[2]];_b[2]=nil else _n=_n+1;openUVs[_n]=_b end end;for _i=_n+1,#openUVs do openUVs[_i]=nil end end
elseif a==40 then local A,B,C=_s1,_s2,_s3;do local f=R[A+1];local r;if B==1 then r=_tpack(_pcall(f)) elseif B==2 then r=_tpack(_pcall(f,R[A+2])) elseif B==3 then r=_tpack(_pcall(f,R[A+2],R[A+3])) else r=_tpack(_pcall(f,_tunpack(R,A+2,A+B))) end;if C==0 then for _i=1,r.n do R[A+_i]=r[_i] end;_top=A+r.n else for _i=1,C-1 do R[A+_i]=r[_i] end end end
elseif a==41 then local A,B,C=_s1,_s2,_s3;do local f=R[A+1];local eh=R[A+2];local r;if B<=2 then r=_tpack(_xpcall(f,eh)) elseif B==3 then r=_tpack(_xpcall(f,eh,R[A+3])) else r=_tpack(_xpcall(f,eh,_tunpack(R,A+3,A+B))) end;if C==0 then for _i=1,r.n do R[A+_i]=r[_i] end;_top=A+r.n else for _i=1,C-1 do R[A+_i]=r[_i] end end end
elseif a==42 then local A,B,C=_s1,_s2,_s3;do local it=R[A+1];if _type(it)=="table" then local ok,mt=_pcall(_getmeta,it);if ok and _type(mt)=="table" and mt.__iter then R[A+1]=mt.__iter(it) else R[A+1]=_next;R[A+2]=it;R[A+3]=nil end end end
elseif a==43 then local A,B,C=_s1,_s2,_s3;local ex=code[ip+1];R[A+1]=K[ex+1];ip=ip+4
elseif a==44 then local A,B,C=_s1,_s2,_s3;
elseif a==45 then local A,B,C=_s1,_s2,_s3;do local _j=code[ip+2];if (not R[A+1])==(C~=0) then ip=ip+4 else ip=ip+4+_j*4 end end
elseif a==46 then local A,B,C=_s1,_s2,_s3;do local _j=code[ip+2];if (RK(B)==RK(C))==(A~=0) then ip=ip+4+_j*4 else ip=ip+4 end end
elseif a==47 then local A,B,C=_s1,_s2,_s3;do local _j=code[ip+2];if (RK(B)<RK(C))==(A~=0) then ip=ip+4+_j*4 else ip=ip+4 end end
elseif a==48 then local A,B,C=_s1,_s2,_s3;do local _lv,_rv=RK(B),RK(C);local _o=code[ip+2]*4;ip=ip+4;if (_lv<=_rv)==(A~=0) then ip=ip+_o end end
elseif a==49 then local A,B,C=_s1,_s2,_s3;do local _j=code[ip+2];if (not R[B+1])==(C~=0) then ip=ip+4 else R[A+1]=R[B+1];ip=ip+4+_j*4 end end
elseif a==50 then local A,B,C=_s1,_s2,_s3;do local _A2=code[ip+1];local _C2=code[ip+3];local _g=_env[K[B+1]];R[A+1]=_g;R[_A2+1]=_g[RK(_C2)];ip=ip+4 end
elseif a==51 then local A,B,C=_s1,_s2,_s3;do R[A+1]=K[B+1];R[code[ip+1]+1]=K[code[ip+2]+1];ip=ip+4 end
elseif a==52 then local A,B,C=_s1,_s2,_s3;do R[A+1]=R[B+1];R[code[ip+1]+1]=R[code[ip+2]+1];ip=ip+4 end
elseif a==53 then local A,B,C=_s1,_s2,_s3;do local _s=R[B+1];R[A+2]=_s;local f=_s[RK(C)];R[A+1]=f;local _B2=code[ip+2];local _C2=code[ip+3];ip=ip+4;local r;if _B2==2 then r=_tpack(f(R[A+2])) elseif _B2==3 then r=_tpack(f(R[A+2],R[A+3])) elseif _B2==0 then r=_tpack(f(_tunpack(R,A+2,_top))) else r=_tpack(f(_tunpack(R,A+2,A+_B2))) end;if _C2==0 then for _i=1,r.n do R[A+_i]=r[_i] end;_top=A+r.n else for _i=1,_C2-1 do R[A+_i]=r[_i] end end end
elseif a==54 then local A,B,C=_s1,_s2,_s3;do local _A2=code[ip+1];local _C2=code[ip+3];local _A3=code[ip+5];local _B3=code[ip+6];local _C3=code[ip+7];local _g=_env[K[B+1]];R[A+1]=_g;local f=_g[RK(_C2)];R[_A2+1]=f;ip=ip+8;local r;if _B3==1 then r=_tpack(f()) elseif _B3==2 then r=_tpack(f(R[_A3+2])) elseif _B3==3 then r=_tpack(f(R[_A3+2],R[_A3+3])) elseif _B3==0 then r=_tpack(f(_tunpack(R,_A3+2,_top))) else r=_tpack(f(_tunpack(R,_A3+2,_A3+_B3))) end;if _C3==0 then for _i=1,r.n do R[_A3+_i]=r[_i] end;_top=_A3+r.n else for _i=1,_C3-1 do R[_A3+_i]=r[_i] end end end
elseif a==55 then local A,B,C=_s1,_s2,_s3;do R[A+1]=K[B+1];ip=ip+4;return R[A+1] end
elseif a==56 then local A,B,C=_s1,_s2,_s3;do local _A2=code[ip+1];local _B2=code[ip+2];R[A+1]=R[B+1];ip=ip+4;if _B2==0 then return _tunpack(R,_A2+1,_top) elseif _B2==1 then return else return _tunpack(R,_A2+1,_A2+_B2-1) end end
end
end
end
local _dK={"game","GetService",1,10,2,54,3,59,4,35,5,63,6,40,7,41,90,8,47,52,9,44,51,57,14,45,11,12,15,19,42,46,13,16,62,53,61,17,"TweenInfo","Vector3","Color3","__index","new","addXP","getData",122,"name","damage","fireRate","range",25,1.2,30,55,24,50,1.5,"canAttack","attack","on","fire","tween","fadeIn","fadeOut","save","load","PlayerManager","CombatSystem","Events","UIAnimations","DataStore","Weapons"}
local _dC={9,0,0,0,34,1,0,0,5,6,0,0,36,2,6,257,4,4,1,0,9,5,0,0,8,5,258,259,8,5,260,261,8,5,262,263,8,5,264,265,8,5,266,267,8,5,268,269,8,5,270,271,1,6,16,0,27,4,3,0,27,2,0,2,5,8,0,0,36,3,8,257,4,5,1,0,9,6,0,0,8,6,258,273,8,6,260,274,8,6,262,275,8,6,264,276,8,6,266,267,8,6,268,269,8,6,270,277,8,6,273,278,8,6,276,279,8,6,259,267,1,7,16,0,27,5,3,0,27,3,0,2,5,9,0,0,36,4,9,257,4,6,1,0,9,7,0,0,8,7,258,280,8,7,260,281,8,7,262,267,8,7,264,267,8,7,266,275,8,7,268,276,8,7,270,267,8,7,273,269,8,7,276,277,8,7,259,278,8,7,282,279,8,7,283,267,1,8,16,0,27,6,3,0,27,4,0,2,5,10,0,0,36,5,10,257,4,7,1,0,9,8,0,0,8,8,258,284,8,8,260,271,8,8,262,267,8,8,264,269,8,8,266,285,8,8,268,275,8,8,270,286,8,8,273,274,8,8,276,287,8,8,259,276,8,8,282,267,8,8,283,269,8,8,288,277,8,8,280,278,8,8,284,279,8,8,289,267,1,9,16,0,27,7,3,0,27,5,0,2,5,11,0,0,36,6,11,257,4,8,1,0,9,9,0,0,8,9,258,273,8,9,260,267,8,9,262,286,8,9,264,261,8,9,266,278,8,9,268,279,8,9,270,263,8,9,273,287,8,9,276,267,8,9,259,290,8,9,282,276,8,9,283,287,8,9,288,291,8,9,280,269,8,9,284,263,8,9,289,292,8,9,293,267,1,10,16,0,27,8,3,0,27,6,0,2,5,7,38,0,5,8,39,0,5,9,40,0,9,10,0,0,4,12,10,0,8,10,297,12,34,12,1,0,8,10,298,12,34,12,2,0,8,10,299,12,34,12,3,0,8,10,300,12,9,11,0,0,4,12,1,0,9,13,0,0,8,13,258,276,8,13,260,287,8,13,262,263,8,13,264,269,8,13,266,287,8,13,268,267,8,13,270,269,8,13,273,301,8,13,276,276,8,13,259,281,8,13,282,291,8,13,283,269,8,13,288,290,1,14,16,0,27,12,3,2,9,16,0,0,4,17,1,0,9,18,0,0,8,18,258,276,8,18,260,287,8,18,262,263,8,18,264,269,8,18,266,287,8,18,268,267,8,18,270,269,8,18,273,301,8,18,276,276,8,18,259,281,8,18,282,291,8,18,283,269,8,18,288,290,1,19,16,0,27,17,3,2,8,16,302,17,8,16,303,259,8,16,304,258,8,16,305,259,8,11,12,16,4,17,1,0,9,18,0,0,8,18,258,285,8,18,260,269,8,18,262,291,8,18,264,275,8,18,266,301,8,18,268,276,8,18,270,281,8,18,273,291,8,18,276,269,8,18,259,290,1,19,16,0,27,17,3,2,9,21,0,0,4,22,1,0,9,23,0,0,8,23,258,285,8,23,260,269,8,23,262,291,8,23,264,275,8,23,266,301,8,23,268,276,8,23,270,281,8,23,273,291,8,23,276,269,8,23,259,290,1,24,16,0,27,22,3,2,8,21,302,22,8,21,303,306,8,21,304,307,8,21,305,283,8,11,17,21,4,22,1,0,9,23,0,0,8,23,258,308,8,23,260,278,8,23,262,263,8,23,264,309,8,23,266,291,8,23,268,275,8,23,270,290,8,23,273,301,8,23,276,310,8,23,259,261,8,23,282,263,8,23,283,290,8,23,288,267,1,24,16,0,27,22,3,2,9,26,0,0,4,27,1,0,9,28,0,0,8,28,258,308,8,28,260,278,8,28,262,263,8,28,264,309,8,28,266,291,8,28,268,275,8,28,270,290,8,28,273,301,8,28,276,310,8,28,259,261,8,28,282,263,8,28,283,290,8,28,288,267,1,29,16,0,27,27,3,2,8,26,302,27,8,26,303,311,8,26,304,312,8,26,305,284,8,11,22,26,9,12,0,0,4,13,12,0,8,12,297,13,34,13,4,0,8,12,298,13,34,13,5,0,8,12,313,13,34,13,6,0,8,12,314,13,9,13,0,0,4,14,13,0,8,13,297,14,34,14,7,0,8,13,298,14,34,14,8,0,8,13,315,14,34,14,9,0,8,13,316,14,9,14,0,0,34,15,10,0,8,14,317,15,34,15,11,0,8,14,318,15,34,15,12,0,8,14,319,15,9,15,0,0,34,16,13,0,8,15,320,16,34,16,14,0,8,15,321,16,34,16,15,0,4,17,16,0,27,17,1,1,9,17,0,0,8,17,322,10,8,17,323,12,8,17,324,13,8,17,325,14,8,17,326,15,8,17,327,11,29,17,2,0}
local _dP={{K={1,2,"string","char","bit32","bxor","table","concat"},C={10,3,256,256,22,0,3,257,21,0,1,0,3,2,1,1,3,2,0,0,25,2,0,0,21,0,2,0,37,3,0,0,7,2,3,0,25,2,0,0,21,0,4,0,37,3,0,0,7,2,3,0,29,2,2,0,21,0,0,0,9,2,0,0,1,3,0,0,19,4,0,0,1,5,0,0,30,3,10,0,5,10,2,0,7,7,10,259,5,12,4,0,7,8,12,261,7,9,0,6,4,10,1,0,27,8,3,0,27,7,0,2,8,2,6,7,39,6,0,0,31,3,-11,0,5,6,6,0,7,3,6,263,4,4,2,0,27,3,2,2,4,6,3,0,37,7,0,0,8,7,0,6,4,6,3,0,29,6,2,0},P={},U={{1,0}},nParams=2,mR=13,vA=false},{K={"setmetatable","player","name","Name","level",1,"xp",0,"inventory",9,2,46,3,59,4,40,5,6,63,7,8,122,10,45,11,53,12,13,62,90,18,54,50,51,52,"data"},C={5,1,0,0,9,2,0,0,37,3,0,0,27,1,3,2,4,5,0,0,8,1,257,5,9,5,0,0,7,6,0,259,8,5,258,6,8,5,260,261,8,5,262,263,9,7,0,0,37,8,1,0,9,9,0,0,8,9,261,265,8,9,266,267,8,9,268,269,8,9,270,271,8,9,272,267,8,9,273,274,8,9,275,271,8,9,276,277,8,9,265,265,8,9,278,279,8,9,280,281,8,9,282,271,8,9,283,284,1,10,29,0,27,8,3,2,8,7,261,8,37,8,1,0,9,9,0,0,8,9,261,286,8,9,266,274,8,9,268,269,8,9,270,287,8,9,272,267,8,9,273,288,8,9,275,277,8,9,276,278,8,9,265,281,8,9,278,267,8,9,280,289,8,9,282,281,8,9,283,290,1,10,29,0,27,8,3,0,33,7,0,2,8,5,264,7,8,1,291,5,4,5,1,0,29,5,2,0},P={},U={{1,10},{1,1}},nParams=1,mR=30,vA=false},{K={"data","xp","level",100,15,225,1,"print","","name"," leveled up to level ","!"},C={7,2,0,256,7,3,2,257,10,3,3,1,8,2,257,3,7,4,0,256,7,3,4,258,12,2,3,259,12,4,260,260,22,0,4,261,21,0,1,0,3,3,1,1,3,3,0,0,25,3,0,0,21,0,6,0,7,5,0,256,7,4,5,257,24,0,2,4,21,0,1,0,3,3,1,1,3,3,0,0,25,3,0,0,21,0,19,0,7,3,0,256,7,4,3,258,10,4,4,262,8,3,258,4,7,3,0,256,7,4,3,257,11,4,4,2,8,3,257,4,5,3,7,0,1,6,8,0,7,11,0,256,7,7,11,265,1,8,10,0,7,11,0,256,7,9,11,258,1,10,11,0,20,4,6,10,27,3,2,1,21,0,0,0,29,0,1,0},P={},U=nil,nParams=2,mR=12,vA=false},{K={"data"},C={7,1,0,256,29,1,2,0},P={},U=nil,nParams=1,mR=3,vA=false},{K={"setmetatable",1,9,2,46,3,59,4,40,5,6,63,7,8,122,10,45,11,53,12,13,62,90,"weapon",0,"lastAttack"},C={5,1,0,0,9,2,0,0,37,3,0,0,27,1,3,2,37,6,1,0,7,5,6,0,25,5,0,1,21,0,19,0,37,6,1,0,37,7,2,0,9,8,0,0,8,8,257,258,8,8,259,260,8,8,261,262,8,8,263,264,8,8,265,260,8,8,266,267,8,8,268,264,8,8,269,270,8,8,258,258,8,8,271,272,8,8,273,274,8,8,275,264,8,8,276,277,1,9,22,0,27,7,3,2,7,5,6,7,8,1,279,5,1,5,24,0,8,1,281,5,4,5,1,0,29,5,2,0},P={},U={{1,12},{1,11},{1,1}},nParams=1,mR=25,vA=false},{K={"tick","lastAttack","weapon","fireRate"},C={5,3,0,0,27,3,1,2,7,5,0,257,11,2,3,5,7,4,0,258,7,3,4,259,24,0,3,2,21,0,1,0,3,1,1,1,3,1,0,0,29,1,2,0},P={},U=nil,nParams=1,mR=6,vA=false},{K={100,7,2,"canAttack","FindFirstChild",1,18,47,3,55,4,59,5,52,6,53,51,8,62,90,12,144,"PrimaryPart","Position","workspace","CurrentCamera","CFrame","Magnitude",9,"weapon","range","TakeDamage","damage","tick","lastAttack","Instance","new",10,40,46,"Size","Anchored","CanCollide","Enum","Material","Neon",0,"Color","Parent","task","delay",0.5},C={14,3,256,257,22,0,3,258,21,0,1,0,3,2,1,1,3,2,0,0,25,2,0,0,21,0,3,0,36,3,0,259,27,3,2,2,18,2,3,0,25,2,0,0,21,0,3,0,3,2,0,0,29,2,2,0,21,0,0,0,36,2,1,260,37,4,0,0,9,5,0,0,8,5,261,262,8,5,258,263,8,5,264,265,8,5,266,267,8,5,268,269,8,5,270,271,8,5,257,272,8,5,273,274,1,6,19,0,27,4,3,0,27,2,0,2,12,9,276,276,22,0,9,277,21,0,1,0,3,8,1,1,3,8,0,0,25,8,0,0,21,0,1,0,18,8,2,0,25,8,0,0,21,0,3,0,3,8,0,0,29,8,2,0,21,0,0,0,7,10,1,278,7,9,10,279,5,13,24,0,7,12,13,281,7,11,12,282,7,10,11,279,11,8,9,10,7,3,8,283,15,9,264,258,22,0,9,284,21,0,1,0,3,8,1,1,3,8,0,0,25,8,0,0,21,0,6,0,7,10,0,285,7,9,10,286,23,0,9,3,21,0,1,0,3,8,1,1,3,8,0,0,25,8,0,0,21,0,3,0,3,8,0,0,29,8,2,0,21,0,0,0,36,8,2,287,7,12,0,285,7,10,12,288,27,8,3,1,5,8,33,0,27,8,1,2,8,0,290,8,5,8,35,0,7,4,8,292,37,5,0,0,9,6,0,0,8,6,261,293,8,6,258,267,8,6,264,294,8,6,266,295,1,7,19,0,27,5,3,0,27,4,0,2,37,14,1,0,7,9,14,292,1,10,5,0,1,11,5,0,1,12,5,0,27,9,4,2,8,4,296,9,7,10,1,278,7,9,10,279,8,4,279,9,3,9,1,0,8,4,297,9,3,9,0,0,8,4,298,9,5,11,43,0,7,10,11,300,7,9,10,301,8,4,300,9,37,14,2,0,7,9,14,292,1,10,5,0,1,11,46,0,1,12,46,0,27,9,4,2,8,4,303,9,5,9,24,0,8,4,304,9,5,13,49,0,7,9,13,306,1,10,51,0,34,11,0,0,27,9,3,1,3,9,1,0,29,9,2,0},P={{K={"Destroy"},C={37,3,0,0,36,0,3,256,27,0,2,1,29,0,1,0},P={},U={{1,4}},nParams=0,mR=4,vA=false}},U={{1,1},{1,8},{1,9}},nParams=2,mR=52,vA=false},{K={"setmetatable","listeners"},C={5,0,0,0,9,1,0,0,37,2,0,0,27,0,3,2,9,4,0,0,8,0,257,4,4,4,0,0,29,4,2,0},P={},U={{1,13}},nParams=0,mR=5,vA=false},{K={7,49,"listeners","table","insert"},C={12,4,256,256,22,0,4,257,21,0,1,0,3,3,1,1,3,3,0,0,25,3,0,0,21,0,3,0,7,5,0,258,7,4,5,1,18,3,4,0,25,3,0,0,21,0,4,0,9,3,0,0,7,4,0,258,8,4,1,3,21,0,0,0,5,7,3,0,7,3,7,260,7,7,0,258,7,4,7,1,4,5,2,0,27,3,3,1,29,0,1,0},P={},U=nil,nParams=3,mR=8,vA=false},{K={1,2,"listeners","ipairs","task","spawn"},C={10,3,256,256,22,0,3,257,21,0,1,0,3,2,1,1,3,2,0,0,25,2,0,0,21,0,2,0,7,3,0,258,7,2,3,1,25,2,0,0,21,0,15,0,5,2,3,0,7,5,0,258,7,3,5,1,27,2,2,4,42,2,0,0,32,2,0,2,21,0,7,0,5,11,4,0,7,7,11,261,4,8,6,0,35,9,0,0,27,7,0,1,39,5,0,0,21,0,-9,0,21,0,0,0,29,0,1,0},P={},U=nil,nParams=2,mR=12,vA=true},{K={"new","Enum","EasingStyle","Quad","EasingDirection","Out","Create","Play"},C={37,10,0,0,7,5,10,256,4,6,2,0,4,7,3,0,25,7,0,1,21,0,3,0,5,11,1,0,7,10,11,258,7,7,10,259,4,8,4,0,25,8,0,1,21,0,3,0,5,11,1,0,7,10,11,260,7,8,10,261,27,5,4,2,37,12,1,0,36,6,12,262,4,8,0,0,4,9,5,0,4,10,1,0,27,6,5,2,36,13,6,263,27,13,2,1,4,13,6,0,29,13,2,0},P={},U={{1,7},{1,4}},nParams=5,mR=16,vA=false},{K={"tween","BackgroundTransparency",0,"TextTransparency",0.3},C={37,7,0,0,7,2,7,256,4,3,0,0,9,4,0,0,8,4,257,258,8,4,259,258,4,5,1,0,25,5,0,1,21,0,1,0,1,5,4,0,27,2,4,0,29,2,0,0},P={},U={{1,14}},nParams=2,mR=8,vA=false},{K={"tween","BackgroundTransparency",1,"TextTransparency",0.3},C={37,7,0,0,7,2,7,256,4,3,0,0,9,4,0,0,8,4,257,258,8,4,259,258,4,5,1,0,25,5,0,1,21,0,1,0,1,5,4,0,27,2,4,0,29,2,0,0},P={},U={{1,14}},nParams=2,mR=8,vA=false},{K={"pcall",15,225,"warn",1,28,2,59,3,51,4,54,5,63,6,62,7,122,8,46,9,53,10,11,41,12,13,44,14,16,17,18,19,20,96,90},C={5,2,0,0,34,3,0,0,27,2,2,3,12,6,257,257,22,0,6,258,21,0,1,0,3,5,1,1,3,5,0,0,25,5,0,0,21,0,1,0,18,5,2,0,25,5,0,0,21,0,30,0,5,5,3,0,37,6,0,0,9,7,0,0,8,7,260,261,8,7,262,263,8,7,264,265,8,7,266,267,8,7,268,269,8,7,270,271,8,7,272,273,8,7,274,275,8,7,276,277,8,7,278,273,8,7,279,280,8,7,281,263,8,7,282,283,8,7,284,269,8,7,257,273,8,7,285,271,8,7,286,263,8,7,287,275,8,7,288,263,8,7,289,290,1,8,35,0,27,6,3,2,4,7,3,0,27,5,3,1,3,5,0,0,29,5,2,0,21,0,0,0,3,5,1,0,29,5,2,0},P={{K={"game","GetService",1,30,2,59,3,46,4,5,9,6,7,53,8,40,63,10,11,12,13,44,14,51,15,57,16,90,"GetDataStore",54,35,"SetAsync"},C={5,8,0,0,36,4,8,257,37,6,0,0,9,7,0,0,8,7,258,259,8,7,260,261,8,7,262,263,8,7,264,261,8,7,265,266,8,7,267,263,8,7,268,269,8,7,270,271,8,7,266,272,8,7,273,266,8,7,274,272,8,7,275,271,8,7,276,277,8,7,278,279,8,7,280,281,8,7,282,272,1,8,27,0,27,6,3,0,27,4,0,2,36,0,4,284,37,2,0,0,9,3,0,0,8,3,258,273,8,3,260,285,8,3,262,261,8,3,264,286,8,3,265,272,8,3,267,271,8,3,268,259,8,3,270,261,8,3,266,263,8,3,273,261,1,4,27,0,27,2,3,0,27,0,0,2,36,10,0,287,37,12,1,0,37,13,2,0,27,10,4,1,29,0,1,0},P={},U={{0,0},{1,0},{1,1}},nParams=0,mR=28,vA=false}},U={{1,1}},nParams=2,mR=36,vA=false},{K={"pcall",100,7,2,"warn",1,28,59,3,51,4,54,5,63,6,62,122,8,46,9,53,10,11,12,13,14,15,16,17,18,19,20,96,90},C={5,1,0,0,34,2,0,0,27,1,2,3,14,5,257,258,22,0,5,259,21,0,1,0,3,4,1,1,3,4,0,0,25,4,0,0,21,0,1,0,18,4,1,0,25,4,0,0,21,0,30,0,5,4,4,0,37,5,0,0,9,6,0,0,8,6,261,262,8,6,259,263,8,6,264,265,8,6,266,267,8,6,268,269,8,6,270,271,8,6,258,272,8,6,273,274,8,6,275,276,8,6,277,272,8,6,278,267,8,6,279,276,8,6,280,263,8,6,281,271,8,6,282,272,8,6,283,271,8,6,284,263,8,6,285,274,8,6,286,263,8,6,287,288,1,7,33,0,27,5,3,2,4,6,2,0,27,4,3,1,2,4,0,0,29,4,2,0,21,0,0,0,4,4,2,0,29,4,2,0},P={{K={"game","GetService",1,30,2,59,3,46,4,5,9,6,7,53,8,40,63,10,11,12,13,44,14,51,15,57,16,90,"GetDataStore",54,35,"GetAsync"},C={5,8,0,0,36,4,8,257,37,6,0,0,9,7,0,0,8,7,258,259,8,7,260,261,8,7,262,263,8,7,264,261,8,7,265,266,8,7,267,263,8,7,268,269,8,7,270,271,8,7,266,272,8,7,273,266,8,7,274,272,8,7,275,271,8,7,276,277,8,7,278,279,8,7,280,281,8,7,282,272,1,8,27,0,27,6,3,0,27,4,0,2,36,0,4,284,37,2,0,0,9,3,0,0,8,3,258,273,8,3,260,285,8,3,262,261,8,3,264,286,8,3,265,272,8,3,267,271,8,3,268,259,8,3,270,261,8,3,266,263,8,3,273,261,1,4,27,0,27,2,3,0,27,0,0,2,36,10,0,287,37,12,1,0,27,10,3,0,29,10,0,0},P={},U={{0,0},{1,0}},nParams=0,mR=28,vA=false}},U={{1,1}},nParams=1,mR=34,vA=false},{K={"print",1,2,20,3,31,4,12,5,27,6,18,7,8,9,122,10,11,34,59,13,55,14,42,15,54,16,63,17,19,52,21,51,22,46,23,24,25,26,32,28,29,30,61,33,53,56,35,36,37,38,39,40,47,41,43,44,45,48,49,50,116,90,"LocalPlayer",144,"new","addXP","Player data: ","getData","name",", Level: ","level",62,"Combat initialized with ","weapon"," (Damage: ","damage",")","on","Instance",57,"Name","WaitForChild","Parent","UDim2",0,300,200,"Size",0.5,150,100,"Position",0.1,"BackgroundColor3","BackgroundTransparency","Text","TextColor3","TextSize","Enum","Font","GothamBold","fadeIn","hookfunction",96,60,"Drawing","identifyexecutor","Executor: ","task","spawn",123},C={5,0,0,0,37,1,0,0,9,2,0,0,8,2,257,257,8,2,258,259,8,2,260,261,8,2,262,263,8,2,264,265,8,2,266,267,8,2,268,261,8,2,269,258,8,2,270,271,8,2,272,261,8,2,273,274,8,2,263,275,8,2,276,277,8,2,278,279,8,2,280,281,8,2,282,283,8,2,284,268,8,2,267,271,8,2,285,285,8,2,259,286,8,2,287,288,8,2,289,290,8,2,291,288,8,2,292,275,8,2,293,281,8,2,294,288,8,2,265,295,8,2,296,288,8,2,297,286,8,2,298,299,8,2,261,271,8,2,295,269,8,2,300,301,8,2,274,302,8,2,303,281,8,2,304,301,8,2,305,274,8,2,306,271,8,2,307,289,8,2,308,309,8,2,310,275,8,2,279,309,8,2,311,271,8,2,312,283,8,2,313,274,8,2,290,275,8,2,309,277,8,2,314,279,8,2,315,281,8,2,316,283,8,2,288,317,8,2,286,317,8,2,301,317,1,3,62,0,27,1,3,0,27,0,0,1,37,1,1,0,7,0,1,319,12,2,263,263,22,0,2,320,21,0,1,0,3,1,1,1,3,1,0,0,25,1,0,0,21,0,1,0,4,1,0,0,25,1,0,0,21,0,20,0,37,4,2,0,7,1,4,321,4,2,0,0,27,1,2,2,36,4,1,322,1,6,60,0,27,4,3,1,5,4,0,0,1,7,67,0,36,11,1,324,27,11,2,2,7,8,11,325,1,9,70,0,36,11,1,324,27,11,2,2,7,10,11,327,20,5,7,10,27,4,2,1,39,1,0,0,21,0,0,0,37,4,3,0,7,1,4,321,37,2,0,0,9,3,0,0,8,3,257,285,8,3,258,308,8,3,260,301,8,3,262,286,8,3,264,271,8,3,266,270,8,3,268,313,8,3,269,301,8,3,270,308,8,3,272,328,1,4,62,0,27,2,3,0,27,1,0,2,5,6,0,0,1,9,73,0,7,14,1,330,7,10,14,325,1,11,75,0,7,14,1,330,7,12,14,332,1,13,77,0,20,7,9,13,27,6,2,1,37,6,4,0,7,2,6,321,27,2,1,2,36,6,2,334,37,8,0,0,9,9,0,0,8,9,257,279,8,9,258,281,8,9,260,275,8,9,262,303,8,9,264,283,8,9,266,308,8,9,268,289,8,9,269,283,8,9,270,312,8,9,272,283,8,9,273,281,8,9,263,280,8,9,276,279,1,10,62,0,27,8,3,2,34,9,0,0,27,6,4,1,5,6,79,0,7,3,6,321,37,4,0,0,9,5,0,0,8,5,257,270,8,5,258,336,8,5,260,308,8,5,262,283,8,5,264,283,8,5,266,286,8,5,268,297,8,5,269,309,8,5,270,288,1,6,62,0,27,4,3,0,27,3,0,2,37,8,0,0,9,9,0,0,8,9,257,259,8,9,258,261,8,9,260,263,8,9,262,265,8,9,264,267,8,9,266,261,8,9,268,258,8,9,269,261,8,9,270,274,8,9,272,275,8,9,273,277,8,9,263,279,8,9,276,281,8,9,278,283,8,9,280,280,8,9,282,285,1,10,62,0,27,8,3,2,8,3,337,8,36,8,0,338,37,10,0,0,9,11,0,0,8,11,257,272,8,11,258,281,8,11,260,275,8,11,262,303,8,11,264,283,8,11,266,308,8,11,268,297,8,11,269,309,8,11,270,288,1,12,62,0,27,10,3,0,27,8,0,2,8,3,339,8,5,8,79,0,7,4,8,321,37,5,0,0,9,6,0,0,8,6,257,296,8,6,258,308,8,6,260,275,8,6,262,277,8,6,264,283,1,7,62,0,27,5,3,0,27,4,0,2,5,15,84,0,7,9,15,321,1,10,85,0,1,11,86,0,1,12,85,0,1,13,87,0,27,9,5,2,8,4,344,9,5,15,84,0,7,9,15,321,1,10,89,0,1,15,90,0,17,11,15,0,1,12,89,0,1,15,91,0,17,13,15,0,27,9,5,2,8,4,348,9,37,14,5,0,7,9,14,321,1,10,93,0,1,11,93,0,1,12,93,0,27,9,4,2,8,4,350,9,1,9,1,0,8,4,351,9,4,9,3,0,8,4,339,9,5,9,79,0,7,5,9,321,37,6,0,0,9,7,0,0,8,7,257,278,8,7,258,283,8,7,260,274,8,7,262,290,8,7,264,289,8,7,266,275,8,7,268,302,8,7,269,283,8,7,270,281,1,8,62,0,27,6,3,0,27,5,0,2,5,16,84,0,7,10,16,321,1,11,1,0,1,12,85,0,1,13,85,0,1,14,60,0,27,10,5,2,8,5,344,10,37,10,0,0,9,11,0,0,8,11,257,259,8,11,258,261,8,11,260,263,8,11,262,265,8,11,264,267,8,11,266,261,8,11,268,258,8,11,269,271,8,11,270,272,8,11,272,308,8,11,273,301,8,11,263,290,8,11,276,283,8,11,278,336,8,11,280,290,8,11,282,283,8,11,284,328,8,11,267,271,8,11,285,270,8,11,259,336,8,11,287,308,8,11,289,288,8,11,291,279,8,11,292,290,1,12,62,0,27,10,3,2,8,5,352,10,37,15,5,0,7,10,15,321,1,11,1,0,1,12,1,0,1,13,1,0,27,10,4,2,8,5,353,10,1,10,1,0,8,5,351,10,1,10,36,0,8,5,354,10,5,12,99,0,7,11,12,356,7,10,11,357,8,5,356,10,4,10,4,0,8,5,339,10,37,14,6,0,7,10,14,358,4,11,4,0,1,12,89,0,27,10,3,1,15,11,260,258,22,0,11,270,21,0,1,0,3,10,1,1,3,10,0,0,25,10,0,0,21,0,1,0,5,10,103,0,25,10,0,0,21,0,48,0,5,10,0,0,37,11,0,0,9,12,0,0,8,12,257,261,8,12,258,274,8,12,260,283,8,12,262,336,8,12,264,309,8,12,266,290,8,12,268,301,8,12,269,308,8,12,270,271,8,12,272,328,8,12,273,283,8,12,263,290,8,12,276,283,8,12,278,336,8,12,280,290,8,12,282,283,8,12,284,328,8,12,267,360,8,12,285,271,8,12,259,316,8,12,287,301,8,12,289,301,8,12,291,315,8,12,292,361,8,12,293,309,8,12,294,286,8,12,265,336,8,12,296,290,8,12,297,288,8,12,298,301,8,12,261,286,8,12,295,271,8,12,300,275,8,12,274,312,8,12,303,275,8,12,304,288,8,12,305,281,8,12,306,275,8,12,307,302,8,12,308,281,8,12,310,283,1,13,62,0,27,11,3,0,27,10,0,1,21,0,0,0,12,11,268,268,22,0,11,315,21,0,1,0,3,10,1,1,3,10,0,0,25,10,0,0,21,0,1,0,5,10,106,0,25,10,0,0,21,0,32,0,5,10,0,0,37,11,0,0,9,12,0,0,8,12,257,298,8,12,258,308,8,12,260,275,8,12,262,313,8,12,264,288,8,12,266,286,8,12,268,299,8,12,269,271,8,12,270,281,8,12,272,288,8,12,273,302,8,12,263,308,8,12,276,275,8,12,278,308,8,12,280,303,8,12,282,271,8,12,284,275,8,12,267,312,8,12,285,275,8,12,259,288,8,12,287,281,8,12,289,275,8,12,291,302,8,12,292,281,8,12,293,283,1,13,62,0,27,11,3,0,27,10,0,1,21,0,0,0,10,11,257,257,22,0,11,258,21,0,1,0,3,10,1,1,3,10,0,0,25,10,0,0,21,0,1,0,5,10,107,0,25,10,0,0,21,0,7,0,5,10,0,0,1,13,108,0,5,14,107,0,27,14,1,2,20,11,13,14,27,10,2,1,21,0,0,0,5,13,109,0,7,10,13,366,34,11,1,0,27,10,2,1,5,10,0,0,37,11,0,0,9,12,0,0,8,12,257,257,8,12,258,259,8,12,260,261,8,12,262,263,8,12,264,265,8,12,266,267,8,12,268,261,8,12,269,258,8,12,270,271,8,12,272,261,8,12,273,274,8,12,263,275,8,12,276,277,8,12,278,279,8,12,280,281,8,12,282,283,8,12,284,268,8,12,267,271,8,12,285,285,8,12,259,286,8,12,287,288,8,12,289,290,8,12,291,288,8,12,292,275,8,12,293,281,8,12,294,288,8,12,265,295,8,12,296,275,8,12,297,290,8,12,298,288,8,12,261,301,8,12,295,286,8,12,300,271,8,12,274,336,8,12,303,301,8,12,304,277,8,12,305,279,8,12,306,281,8,12,307,283,8,12,308,290,8,12,310,283,8,12,279,367,1,13,62,0,27,11,3,0,27,10,0,1,29,0,1,0},P={{K={"print","Event: ","name"," reached level ","level","!"},C={5,1,0,0,1,4,1,0,7,5,0,258,1,6,3,0,7,7,0,260,1,8,5,0,20,2,4,8,27,1,2,1,29,0,1,0},P={},U=nil,nParams=1,mR=9,vA=false},{K={15,225,"task","wait",5,100,7,2,"playerManager","getData",12,144,"print","Heartbeat: ","name"," | Level ","level"," | XP ","xp"},C={12,1,256,256,22,0,1,257,21,0,1,0,3,0,1,1,3,0,0,0,25,0,0,0,21,0,1,0,3,0,1,0,25,0,0,0,21,0,43,0,5,3,2,0,7,0,3,259,1,1,4,0,27,0,2,1,14,1,261,262,22,0,1,263,21,0,1,0,3,0,1,1,3,0,0,0,25,0,0,0,21,0,1,0,37,0,0,0,25,0,0,0,21,0,28,0,5,0,8,0,25,0,0,0,21,0,3,0,5,3,8,0,36,0,3,265,27,0,2,2,12,2,266,266,22,0,2,267,21,0,1,0,3,1,1,1,3,1,0,0,25,1,0,0,21,0,1,0,4,1,0,0,25,1,0,0,21,0,10,0,5,1,12,0,1,4,13,0,7,5,0,270,1,6,15,0,7,7,0,272,1,8,17,0,7,9,0,274,20,2,4,9,27,1,2,1,21,0,0,0,39,0,0,0,21,0,0,0,21,0,-53,0,29,0,1,0},P={},U={{1,0}},nParams=0,mR=18,vA=false}},U={{1,1},{1,2},{1,10},{1,12},{1,13},{1,9},{1,14}},nParams=0,mR=110,vA=false}}
return _run(_dK,_dC,_dP,{},0,41,true,_env)