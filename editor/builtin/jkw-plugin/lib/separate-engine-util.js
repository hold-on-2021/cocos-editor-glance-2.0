let e=require("path"),i=require("fs-extra"),o=require("glob"),n=require("crypto");let r,t,c,s,a,u,d,l,p=!1,g={cocos:{provider:"com.cocos.creator.engine2d",version:Editor.versions.CocosCreator,path:"cocos"}},m={main:"cocos2d-runtime.js"},j={provider:"com.cocos.creator.engine2d",signature:[{path:"cocos2d-runtime.js",md5:""}]};module.exports={gatherInfo(i){r=i.cpk,l=i.gameConfig,p=i.customConfig.separateEngineMode;let n=i.buildPath;if(t=e.join(n,"cocos"),i.md5Cache){let i=e.join(n,"src"),r=o.sync(e.join(i,"cocos2d-runtime.*.js"));c=r[0]}else c=e.join(n,"src","cocos2d-runtime.js");s=e.join(t,"cocos2d-runtime.js"),d=e.join(n,"main.js"),a=e.join(t,"plugin.json"),u=e.join(t,"signature.json")},organizeResources(){if(!p)return;Editor.info(Editor.T("cpk-publish.separate_engine_begin_hint")),i.existsSync(t)||i.ensureDirSync(t),i.moveSync(c,s);let o=i.readFileSync(s);j.signature[0].md5=n.createHash("md5").update(o).digest("hex"),i.writeJSONSync(a,m),i.writeJSONSync(u,j);let r=i.readFileSync(d,"utf-8"),f=e.join("src",e.basename(c));f=f.replace(/\\/g,"/");let h=e.join("cocos",e.basename(s));h=h.replace(/\\/g,"/");let y=`require('${f}');`;if(r.indexOf(y)>-1){let e="if (typeof requirePlugin === 'function') {\n\t\t\trequirePlugin('cocos');\n\t\t} else {\n\t\t\trequire('"+h+"');\n\t\t}";r=r.replace(y,e),i.writeFileSync(d,r)}l.plugins=g,Editor.info(Editor.T("cpk-publish.separate_engine_end_hint"))},pack(){p&&r.directory(t,"cocos")}};