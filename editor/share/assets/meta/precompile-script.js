const e=require("fire-path"),t=Editor.require("app://editor/page/refine-sourcemap");module.exports={compile:function(o,r,c,s){var u=e.basenameNoExt(r);let i=e.relative(Editor.Project.path,r);c.sourceMapObject.sources=[i],c.sourceMapObject.sourceRoot="/",function(e,o,r,c){var s,u=r.outputText,i=(Editor.assetdb.getRelativePath(o)||"").replace(/\\/g,"/"),n=u[u.length-1],p="\n"===n||"\r"===n;s=e?'"use strict";\n'+`cc._RF.push(module, '${e=Editor.Utils.UuidUtils.compressUuid(e)}', '${c}');\n`+`// ${i}\n\n`:'"use strict";\n'+`cc._RF.push(module, '${c}');\n`+`// ${i}\n\n`;var a="\ncc._RF.pop();";p||(a="\n"+a),r.outputText=s+u+a,r.sourceMapObject=t.offsetLines(r.sourceMapObject,4)}(o,r,c,u),s(null,c)}};