require('/Applications/CocosCreator/Creator/2.3.4/CocosCreator.app/Contents/Resources/app.asar.unpacked/editor/share/quick-compile/plugins/maiya.js');
const e=require("fire-fs"),n=require("fire-path"),r=require("convert-source-map"),i=require("../../../page/refine-sourcemap"),{formatPath:o,isNodeModulePath:t}=require("../utils"),u="undefined"!=typeof Editor?Editor.url("unpack://editor/share/quick-compile/plugins/__quick_compile__.js"):n.join(__dirname,"__quick_compile__.js"),_=e.readFileSync(u,"utf8");module.exports=function(t){t.bundle=void 0===t.bundle||t.bundle,t.prefix=t.prefix||"",t.sourceMapPrefix=t.sourceMapPrefix||"",t.modularName=t.modularName?`__quick_compile_${t.modularName}__`:"__quick_compile__";let u=function(e,r,i){let u;return u=t.transformPath?t.transformPath(e,r,i):n.join(t.prefix||"",n.relative(i.out,r)),o(u)},c=t.excludes||[];Array.isArray(c)||(c=[c]),c=c.map(e=>o(e));let l=t.requireInNodeEnv||"require",s=t.modularName;return{nodeModule:!0,transform(e,o){let{src:_,dst:c,source:d}=e,a=`\n                (function() {\n                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';\n                    var __module = nodeEnv ? module : {exports:{}};\n                    var __filename = '${u(_,c,o)}';\n                    var __require = nodeEnv ? function (request) {\n                        return ${l}(request);\n                    } : function (request) {\n                        return ${s}.require(request, __filename);\n                    };\n                    function __define (exports, require, module) {\n                        if (!nodeEnv) {${s}.registerModule(__filename, module);}`,m=`\n                    }\n                    if (nodeEnv) {\n                        __define(__module.exports, __require, __module);\n                    }\n                    else {\n                        ${s}.registerModuleFunc(__filename, function () {\n                            __define(__module.exports, __require, __module);\n                        });\n                    }\n                })();`,f=!0;if(".json"===n.extname(_)?(d="module.exports = "+d,f=!1):t.exludesForSourceMap&&t.exludesForSourceMap.includes(_)&&(f=!1),f){let n=r.fromSource(d);n?(n=n.toObject(),n=i.offsetLines(n,a.match(/\n/g).length),t.onSourceMap&&t.onSourceMap(e,n),mapComment=r.fromObject(n).toComment(),d=a+d.replace(/\n\/\/# sourceMappingURL.*/,"")+m+"\n"+mapComment):f=!1}f||(d=a+d+m),e.source=d},async compileFinished(r){let i=r.getSortedScripts(),l=(i=i.filter(e=>-1===c.indexOf(e.src))).map(e=>{let n={};for(let r in e.deps)n[r]=i.findIndex(function(n){return n.src===e.deps[r]});return{mtime:r._mtimes[e.src],deps:n,path:u(e.src,e.dst,r)}}),s="";if(t.bundle){console.time("Generate QUICK_COMPILE_BUNDLE"),s=o(n.join(t.prefix,"__qc_bundle__.js"));let u=n.join(r.out,"__qc_bundle__.js"),_="";i.forEach((e,n)=>{_+=e.source+"\n//------QC-SOURCE-SPLIT------\n"}),e.writeFileSync(u,_),console.timeEnd("Generate QUICK_COMPILE_BUNDLE")}let d=r.entries.map(e=>u(e,r.getDstPath(e),r)),a=function(e,n,r,i){let o=_.replace(/{prefix}/g,i.prefix);return`\n(function () {\nvar scripts = ${e};\nvar entries = ${n};\nvar bundleScript = '${r}';\n\n${o=o.replace(/__quick_compile__/g,i.modularName)}\n})();\n    `}(JSON.stringify(l),JSON.stringify(d),s,t);e.writeFileSync(n.join(r.out,"__quick_compile__.js"),a)}}};