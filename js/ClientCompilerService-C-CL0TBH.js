class b{static _wandboxEndpoint="https://wandbox.org/api/compile.json";static _wandboxListEndpoint="https://wandbox.org/api/list.json";static _pistonEndpoint="https://emkc.org/api/v2/piston/execute";static _cachedCsharpCompiler=null;static MAX_PAYLOAD_BYTES=262144;static EXE_B64_START="__EXE_B64_START__";static EXE_B64_END="__EXE_B64_END__";static _pistonLanguageMap={javascript:{language:"javascript",version:"*"},js:{language:"javascript",version:"*"},python:{language:"python",version:"*"},php:{language:"php",version:"*"},java:{language:"java",version:"*"},c:{language:"c",version:"*"},cpp:{language:"c++",version:"*"},csharp:{language:"csharp",version:"*"},cs:{language:"csharp",version:"*"},bash:{language:"bash",version:"*"},sql:{language:"sqlite3",version:"*"}};static _wandboxCompilerMap={csharp:"mono-6.12.0.199",cs:"mono-6.12.0.199",cpp:"gcc-head",c:"gcc-head-c",python:"cpython-head",php:"php-head"};static _bundleCSharpParts(n,s=[]){const t=new Set(["using System;","using System.Collections.Generic;","using System.Linq;",...s]),r=[];for(const o of n){const c=String(o.name||"Program.cs").replace(/"/g,""),i=String(o.content||"").replace(/\r\n/g,`
`).split(`
`),a=[];for(const e of i){const l=e.trim();/^using\s+[A-Za-z0-9_.]+\s*;$/.test(l)?(t.add(l),a.push("")):a.push(e)}r.push(`#line 1 "${c}"
${a.join(`
`)}`)}return{usingsBlock:Array.from(t).join(`
`),bodyBlock:r.join(`

`)}}static bundleCSharpFiles(n){const{usingsBlock:s,bodyBlock:t}=this._bundleCSharpParts(n);return`${s}

${t}`}static _utf8ToBase64(n){if(typeof Buffer<"u")return Buffer.from(String(n),"utf8").toString("base64");const s=new TextEncoder().encode(String(n));let t="";for(let r=0;r<s.length;r++)t+=String.fromCharCode(s[r]);return btoa(t)}static _base64ToBytes(n){const s=String(n||"").replace(/\s+/g,"");if(typeof Buffer<"u")return new Uint8Array(Buffer.from(s,"base64"));const t=atob(s),r=new Uint8Array(t.length);for(let o=0;o<t.length;o++)r[o]=t.charCodeAt(o);return r}static _prepareExePayload(n,s="Program.exe"){const t=String(s||"Program.exe").trim().replace(/[^A-Za-z0-9_.-]/g,"")||"Program.exe",r=t.toLowerCase().endsWith(".exe")?t:`${t}.exe`,o=r.replace(/\.exe$/i,"").replace(/[^A-Za-z0-9 _.-]/g,"")||"Program",{usingsBlock:c,bodyBlock:i}=this._bundleCSharpParts(n,["using System.Reflection;","using System.Text;"]),a=/System\.Windows\.Forms/i.test(`${c}
${i}`);let e=`${c}

${i}`;if(a)e=`${c}
[assembly: AssemblyTitle("${o}")]
[assembly: AssemblyProduct("${o}")]
[assembly: AssemblyDescription("Aplikacja Windows napisana w kursie C#")]
[assembly: AssemblyVersion("1.0.0.0")]
[assembly: AssemblyFileVersion("1.0.0.0")]

${i}`;else{const l=i.replace(/((?:public|private|internal|protected)\s+)?static\s+(void|int)\s+Main\s*\(/,"public static $2 __UserMain(");l!==i&&(e=`${c}
[assembly: AssemblyTitle("${o}")]
[assembly: AssemblyProduct("${o}")]
[assembly: AssemblyDescription("Program napisany w kursie C#")]
[assembly: AssemblyVersion("1.0.0.0")]
[assembly: AssemblyFileVersion("1.0.0.0")]

${l}

internal static class __ConsoleAppEntry
{
    public static int Main(string[] args)
    {
        try { Console.OutputEncoding = Encoding.UTF8; } catch { }
        try { Console.Title = "${o}"; } catch { }
        int exitCode = 0;
        try
        {
            MethodInfo userMain = null;
            foreach (Type t in Assembly.GetExecutingAssembly().GetTypes())
            {
                userMain = t.GetMethod("__UserMain", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);
                if (userMain != null) break;
            }
            if (userMain != null)
            {
                ParameterInfo[] p = userMain.GetParameters();
                object ret = p.Length == 1 ? userMain.Invoke(null, new object[] { args }) : userMain.Invoke(null, null);
                if (ret is int) exitCode = (int)ret;
            }
        }
        catch (TargetInvocationException tie)
        {
            Console.WriteLine();
            Console.WriteLine("[BLAD] " + (tie.InnerException != null ? tie.InnerException.Message : tie.Message));
            exitCode = 1;
        }
        catch (Exception ex)
        {
            Console.WriteLine();
            Console.WriteLine("[BLAD] " + ex.Message);
            exitCode = 1;
        }
        finally
        {
            if (!Console.IsInputRedirected)
            {
                Console.WriteLine();
                Console.WriteLine("Nacisnij dowolny klawisz, aby zamknac okno...");
                try { Console.ReadKey(true); } catch { }
            }
        }
        return exitCode;
    }
}
`)}return{finalName:r,usesWinForms:a,sourceB64:this._utf8ToBase64(e)}}static buildInlineExeEmitter(n,s="Program.exe"){const{sourceB64:t,usesWinForms:r}=this._prepareExePayload(n,s);return`
    private static void __EmitBundledExe()
    {
        try
        {
            string src = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String("${t}"));
            string outPath = Path.Combine(Path.GetTempPath(), "UserProgram_" + Guid.NewGuid().ToString("N") + ".exe");
            var provider = new Microsoft.CSharp.CSharpCodeProvider();
            var cp = new System.CodeDom.Compiler.CompilerParameters();
            cp.GenerateExecutable = true;
            cp.GenerateInMemory = false;
            cp.OutputAssembly = outPath;
            cp.CompilerOptions = "${r?"/target:winexe /optimize+":"/target:exe /optimize+"}";
            cp.ReferencedAssemblies.Add("System.dll");
            cp.ReferencedAssemblies.Add("System.Core.dll");
            ${r?'cp.ReferencedAssemblies.Add("System.Windows.Forms.dll"); cp.ReferencedAssemblies.Add("System.Drawing.dll");':""}
            var res = provider.CompileAssemblyFromSource(cp, src);
            if (!res.Errors.HasErrors && File.Exists(outPath))
            {
                byte[] exeBytes = File.ReadAllBytes(outPath);
                try { File.Delete(outPath); } catch { }
                Console.WriteLine("${this.EXE_B64_START}");
                Console.WriteLine(Convert.ToBase64String(exeBytes));
                Console.WriteLine("${this.EXE_B64_END}");
            }
        }
        catch { }
    }`}static parseExeBase64(n,s="Program.exe"){const t=String(s||"Program.exe").trim().replace(/[^A-Za-z0-9_.-]/g,"")||"Program.exe",r=t.toLowerCase().endsWith(".exe")?t:`${t}.exe`;if(!n)return null;try{const o=this._base64ToBytes(n);return o.length<64||o[0]!==77||o[1]!==90?null:{ok:!0,bytes:o,fileName:r,sizeBytes:o.length,provider:"bundled"}}catch{return null}}static buildExePackagerSource(n,s="Program.exe"){const{sourceB64:t,usesWinForms:r}=this._prepareExePayload(n,s);return`
using System;
using System.IO;
using System.Text;
using System.CodeDom.Compiler;
using Microsoft.CSharp;

class __ExePackager
{
    static int Main()
    {
        string src = Encoding.UTF8.GetString(Convert.FromBase64String("${t}"));
        string outPath = Path.Combine(Path.GetTempPath(), "UserProgram_" + Guid.NewGuid().ToString("N") + ".exe");

        var provider = new CSharpCodeProvider();
        var cp = new CompilerParameters();
        cp.GenerateExecutable = true;
        cp.GenerateInMemory = false;
        cp.OutputAssembly = outPath;
        cp.CompilerOptions = "${r?"/target:winexe /optimize+":"/target:exe /optimize+"}";
        cp.ReferencedAssemblies.Add("System.dll");
        cp.ReferencedAssemblies.Add("System.Core.dll");
        ${r?'cp.ReferencedAssemblies.Add("System.Windows.Forms.dll"); cp.ReferencedAssemblies.Add("System.Drawing.dll");':""}

        CompilerResults res = provider.CompileAssemblyFromSource(cp, src);
        if (res.Errors.HasErrors)
        {
            foreach (CompilerError err in res.Errors)
            {
                if (!err.IsWarning)
                {
                    Console.Error.WriteLine(string.Format("{0}({1},{2}): error {3}: {4}",
                        Path.GetFileName(err.FileName), err.Line, err.Column, err.ErrorNumber, err.ErrorText));
                }
            }
            return 1;
        }

        byte[] exeBytes = File.ReadAllBytes(outPath);
        try { File.Delete(outPath); } catch { }
        Console.WriteLine("${this.EXE_B64_START}");
        Console.WriteLine(Convert.ToBase64String(exeBytes));
        Console.WriteLine("${this.EXE_B64_END}");
        return 0;
    }
}
`}static async compileToExe(n,s="Program.exe",t={}){const r=String(s||"Program.exe").trim().replace(/[^A-Za-z0-9_.-]/g,"")||"Program.exe",o=r.toLowerCase().endsWith(".exe")?r:`${r}.exe`;if(!Array.isArray(n)||n.length===0)return{ok:!1,fileName:o,error:"Brak plików źródłowych C#.",provider:"client"};const c=this.buildExePackagerSource(n,o),i=await this.execute("csharp",[{name:"__ExePackager.cs",content:c}],t);if(!i.ok)return{ok:!1,fileName:o,error:i.stderr||i.compilerError||i.content||"Błąd kompilacji pliku .exe.",provider:i.provider};const a=String(i.stdout||i.content||""),e=a.indexOf(this.EXE_B64_START),l=a.indexOf(this.EXE_B64_END);if(e===-1||l===-1||l<=e)return{ok:!1,fileName:o,error:"Kompilator nie zwrócił danych binarnych pliku .exe.",provider:i.provider};const u=a.slice(e+this.EXE_B64_START.length,l).trim(),p=this._base64ToBytes(u);return p.length<64||p[0]!==77||p[1]!==90?{ok:!1,fileName:o,error:"Odebrany plik nie jest poprawnym plikiem wykonywalnym Windows PE (.exe).",provider:i.provider}:{ok:!0,bytes:p,fileName:o,sizeBytes:p.length,provider:i.provider}}static _buildSignal(n=null,s=15e3){const t=typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"?AbortSignal.timeout(s):void 0;return n&&t&&typeof AbortSignal.any=="function"?AbortSignal.any([n,t]):n||t}static async execute(n,s,t=null){const r=String(n||"").toLowerCase().trim(),o=typeof t=="string"?{endpoint:t}:t||{},c=typeof o.stdin=="string"?o.stdin:"",i=o.signal||null;if(!Array.isArray(s)||s.length===0)return{ok:!1,type:"error",content:"Brak plików źródłowych do skompilowania.",stdout:"",stderr:"",compilerError:"",exitCode:-1,provider:"client"};if(s.reduce((e,l)=>e+String(l?.content||"").length,0)>this.MAX_PAYLOAD_BYTES)return{ok:!1,type:"error",content:`Kod przekracza bezpieczny limit rozmiaru (${Math.round(this.MAX_PAYLOAD_BYTES/1024)} KB).`,stdout:"",stderr:"",compilerError:"",exitCode:-1,provider:"client"};if(o.endpoint&&o.endpoint.includes("piston"))return this._executePiston(r,s,c,o.endpoint,i);if(this._wandboxCompilerMap[r]){const e=await this._executeWandbox(r,s,c,i);if(!e._networkOrServiceFailure||i?.aborted)return e}return this._executePiston(r,s,c,o.endpoint||this._pistonEndpoint,i)}static async _resolveWandboxCsharpCompiler(){if(this._cachedCsharpCompiler)return this._cachedCsharpCompiler;try{const n=await fetch(this._wandboxListEndpoint,{signal:AbortSignal.timeout(6e3)});if(n.ok){const s=await n.json(),t=s.find(r=>typeof r?.name=="string"&&r.name.startsWith("mono-")&&r.name!=="mono-head")||s.find(r=>typeof r?.name=="string"&&r.name.startsWith("mono-"));if(t?.name)return this._cachedCsharpCompiler=t.name,t.name}}catch{}return this._wandboxCompilerMap.csharp}static async _executeWandbox(n,s,t="",r=null){let o=this._wandboxCompilerMap[n];(n==="csharp"||n==="cs")&&(o=this._cachedCsharpCompiler||o);const c=n==="csharp"||n==="cs",i=c?this.bundleCSharpFiles(s):s[0]?.content||"",a={compiler:o,code:i,stdin:t};if(c){const e=["-codepage:utf8"];/System\.Windows\.Forms/i.test(i)&&e.push("-r:System.Windows.Forms.dll","-r:System.Drawing.dll"),a["compiler-option-raw"]=e.join(`
`)}!c&&s.length>1&&(a.codes=s.slice(1).map(e=>({file:e.name,code:e.content})));try{let e=await fetch(this._wandboxEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a),signal:this._buildSignal(r,15e3)});if(!e.ok&&c&&e.status===400){const g=await this._resolveWandboxCsharpCompiler();g&&g!==a.compiler&&(a.compiler=g,e=await fetch(this._wandboxEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a),signal:this._buildSignal(r,15e3)}))}if(!e.ok)return{ok:!1,type:"error",content:`Błąd serwisu Wandbox: HTTP ${e.status}`,stdout:"",stderr:"",compilerError:"",exitCode:e.status,provider:"wandbox",_networkOrServiceFailure:!0};const l=await e.json(),u=(l.compiler_error||"").trim(),p=l.program_output||"",m=(l.program_error||"").trim(),d=Number.parseInt(l.status??"0",10);return u&&d!==0&&!p?{ok:!1,type:"error",content:`BŁĄD KOMPILACJI:
${u}`,stdout:p,stderr:m,compilerError:u,exitCode:Number.isNaN(d)?1:d,provider:"wandbox"}:d!==0&&m?{ok:!1,type:"error",content:`BŁĄD WYKONANIA (kod ${d}):
${m}`,stdout:p,stderr:m,compilerError:u,exitCode:d,provider:"wandbox"}:{ok:d===0,type:d===0?"text":"error",content:p||m||u||"(brak wyniku z konsoli)",stdout:p,stderr:m,compilerError:u,exitCode:Number.isNaN(d)?0:d,provider:"wandbox"}}catch(e){return{ok:!1,type:"error",content:e.name==="TimeoutError"?"TIMEOUT: Kompilacja lub wykonanie trwało zbyt długo (limit: 15s).":`Błąd sieciowy Wandbox: ${e.message}`,stdout:"",stderr:"",compilerError:"",exitCode:-1,provider:"wandbox",_networkOrServiceFailure:!0}}}static async _executePiston(n,s,t="",r=null,o=null){const c=r||this._pistonEndpoint,i=this._pistonLanguageMap[n]??{language:n,version:"*"},a={language:i.language,version:i.version,files:s.map(e=>({name:e.name||"Program.cs",content:e.content})),stdin:t,args:[]};try{const e=await fetch(c,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a),signal:this._buildSignal(o,15e3)});if(!e.ok)return{ok:!1,type:"error",content:`Błąd serwisu wykonawczego (Piston): HTTP ${e.status}`,stdout:"",stderr:"",compilerError:"",exitCode:e.status,provider:"piston"};const l=await e.json(),u=l.compile||null,p=l.run||null;if(u&&u.code!==0){const y=(u.stderr||u.output||"Błąd kompilacji").trim();return{ok:!1,type:"error",content:`BŁĄD KOMPILACJI:
${y}`,stdout:"",stderr:"",compilerError:y,exitCode:u.code,provider:"piston"}}if(!p)return{ok:!1,type:"error",content:"Brak odpowiedzi od serwisu wykonawczego.",stdout:"",stderr:"",compilerError:"",exitCode:-1,provider:"piston"};const m=p.stdout||"",d=(p.stderr||"").trim(),g=p.code??0;return g!==0&&d?{ok:!1,type:"error",content:`BŁĄD WYKONANIA (kod ${g}):
${d}`,stdout:m,stderr:d,compilerError:"",exitCode:g,provider:"piston"}:{ok:g===0,type:g===0?"text":"error",content:m||d||"(brak wyniku z konsoli)",stdout:m,stderr:d,compilerError:"",exitCode:g,provider:"piston"}}catch(e){return{ok:!1,type:"error",content:e.name==="TimeoutError"?"TIMEOUT: Kod wykonywał się zbyt długo (limit: 15s).":`Błąd sieciowy: ${e.message}`,stdout:"",stderr:"",compilerError:"",exitCode:-1,provider:"piston"}}}}export{b as ClientCompilerService};
