const e=require("fire-path"),t=require("fire-url"),s=require("fire-fs"),{format:i,promisify:r}=require("util"),n=require("electron").ipcMain,a=require("globby"),o=require("gulp").Gulp,l=require("gulp-rename"),u=require("gulp-util"),c=require("event-stream"),d=require("stream-combiner2"),p=require("gulp-rev-all"),f=require("gulp-rev-delete-original"),b=require("del"),g=(require("async"),require("lodash")),m=require("winston"),h=require("crypto"),v=require("./compiler"),y=require("./native-utils"),j=require("../share/build-platforms"),w=require("./build-results"),k=Editor.require("app://editor/share/3d-physics-build-utils"),E="build-platform_",S="db://",A="window._CCSettings",x=5,M=["WechatSubContext","SwanSubContext","Canvas Renderer"];function _(t){return c.through(function(s){if(".html"===e.extname(s.path)){m.normal("Generating html from "+s.path);var i=t.webOrientation;"auto"===i&&(i="");const n=Editor.url("app://node_modules/vConsole/dist/vconsole.min.js"),a=`<script src="${e.basename(n)}"><\/script>`;var r={file:s,project:t.projectName||e.basename(t.project),previewWidth:t.previewWidth,previewHeight:t.previewHeight,orientation:i,webDebugger:t.embedWebDebugger?a:""};s.contents=new Buffer(u.template(s.contents,r))}else if("main.js"===e.basename(s.path)){m.normal("Generating main.js from "+s.path);let e=s.contents.toString();r={file:s,renderMode:t.renderMode,engineCode:"",projectCode:""};s.contents=new Buffer(u.template(e,r))}this.emit("data",s)})}function q(e,t){var s=JSON.stringify(e,null,t?4:0).replace(/"([A-Za-z_$][0-9A-Za-z_$]*)":/gm,"$1:");return s=t?`${A} = ${s};\n`:`${A}=${s};`}async function C(e,t,...s){let i=P(t.actualPlatform,e);if(i)try{return await i(t,...s)}catch(e){Editor.error(e)}}function P(e,t){let s=Editor.Builder.simpleBuildTargets[e];return s&&s[t]||null}function U(e,s){var i=e.customSettings,r=e.debug,n=Object.create(null),a=!e.preview,o=Editor.assetdb,l=Editor.assets,u=Editor.Utils.UuidUtils.compressUuid;function c(e,s,i,r){if(!e)return console.error("can not get url to build: "+s),null;if(!e.startsWith(S))return console.error("unknown url to build: "+e),null;var n=Editor.assetdb.isSubAssetByUuid(s);if(n){var a=t.dirname(e),o=t.extname(a);o&&(a=a.slice(0,-o.length)),e=a}var l=e.indexOf("/",S.length);if(l<0)return console.error("no mount to build: "+e),null;var u=e.slice(S.length,l);if(!u)return console.error("unknown mount to build: "+e),null;var c=e.slice(l+1);return c?("audio-clip"===i&&(r||(r=Editor.assetdb.loadMetaByUuid(s)),r&&"1"===r.downloadMode&&(c+="?useDom=1")),{mountPoint:u,relative:c,uuid:s,isSubAsset:n}):(console.error("unknown relative to build: "+e),null)}console.time("queryAssets"),function(e,t){let s=function(e){return P(e,"extends")||e}(i.platform),r=j[s].isNative;if(e){for(var n=[],a=0,u=e.length;a<u;a++){var d=e[a],p=o.uuidToUrl(d),f=o.assetInfoByUuid(d);if(f){var b=f.type;if(b){var g=c(p,d,b);if(!g)continue;var m=l[b];g.ctor=m||cc.RawAsset,n.push(g)}else console.error("Can not get asset type of "+d)}else console.error("Can not get asset info of "+d)}o.queryMetas("db://**/*","javascript",function(e,s){var i;i=r?e=>e.isPlugin&&e.loadPluginInNative:e=>e.isPlugin&&e.loadPluginInWeb;var a=s.filter(i).map(e=>e.uuid);t(null,n,a)})}else console.time("queryMetas"),o.queryMetas("db://**/*","",function(e,s){console.timeEnd("queryMetas");for(var i=[],n=[],a=0,u=s.length;a<u;a++){var d=s[a],p=d.assetType();if("folder"!==p){"javascript"===p&&d.isPlugin&&(r?d.loadPluginInNative&&n.push(d.uuid):d.loadPluginInWeb&&n.push(d.uuid));var f=d.uuid,b=c(o.uuidToUrl(f),f,p,d);if(b&&b.relative.startsWith("resources/")){var g=l[p];b.ctor=g||cc.RawAsset,i.push(b)}}}t(e,i,n)})}(e.uuidList,function(t,l,c){if(console.timeEnd("queryAssets"),t)return s(t);console.time("writeAssets"),function(e,t){var s,i=cc.RawAsset,n=e.rawAssets={assets:{}};r||(s=e.assetTypes=[]);var o={};t=g.sortBy(t,"relative");for(var l=Object.create(null),c=0,d=t.length;c<d;c++){var p=t[c],f=p.mountPoint;if(!p.ctor||i.isRawAssetType(p.ctor)){Editor.error(`Failed to get ctor of '${p.relative}'(${p.uuid}).\n`+"Since 1.10, if the asset is RawAsset, refactor to normal Asset please.\nIf not RawAsset, please ensure the class of asset is loaded in the main process of the editor.");continue}if(!p.relative.startsWith("resources/"))continue;if(p.isSubAsset&&cc.js.isChildClassOf(p.ctor,cc.SpriteFrame)){var b,m=p.relative;if(m in l)b=l[m];else{let e=m+".";b=t.some(function(t){var s=t.relative;return(s===m||s.startsWith(e))&&!t.isSubAsset&&t.ctor===cc.SpriteAtlas}),l[m]=b}if(b)continue}var h=n[f];h||(h=n[f]={});var v,y=cc.js._getClassId(p.ctor,!1);if(!r){var j=o[y];void 0===j&&(s.push(y),j=s.length-1,o[y]=j),y=j}var w=p.relative.slice("resources/".length);v=p.isSubAsset?[w,y,1]:[w,y];let e=p.uuid;a&&(e=u(e,!0)),h[e]=v}}(i,l),console.timeEnd("writeAssets"),function(e,t){for(var s=[],i=0;i<t.length;i++){var r=t[i],a=o.uuidToUrl(r);a=a.slice(S.length),n[a]=r,s.push(a)}s.sort(),s.length>0&&(e.jsList=s)}(i,c),e.sceneList.length>0&&(i.launchScene=Editor.assetdb.uuidToUrl(e.sceneList[0])),function(e,t){t=t.map(e=>{var t=Editor.assetdb.uuidToUrl(e);return t?(a&&(e=u(e,!0)),{url:t,uuid:e}):(Editor.warn(`Can not get url of scene ${e}, it maybe deleted.`),null)}).filter(Boolean),e.scenes=t}(i,e.sceneList),i.packedAssets=function(e){if(a&&e){var t={};for(var s in e){var i=e[s];t[s]=i.map(e=>u(e,!0))}e=t}return e}(e.packedAssets)||{},i.md5AssetsMap={},i.orientation=e.orientation,i.debug=r,i.subpackages=e.subpackages,i.server=e.server,(!("stringify"in e)||e.stringify)&&(i=q(i,r)),s(null,i,n)})}exports.startWithArgs=async function(t,O){let D,T;M.forEach(e=>{t.excludedModules.includes(e)||t.excludedModules.push(e)});try{D=k.getPhysicsModule(t.excludedModules),T=D&&k.getPhysicsBuildFlags(D)}catch(e){return O(e)}await async function(e){return await C("buildStart",e)}(t);var F=new o;function I(e){let t=!0;return function(...s){let i=s[0];t?(t=!1,e&&e(...s)):i&&Editor.error(i)}}var $=t.project,B=(t.projectName||e.basename($),t.platform),R=t.actualPlatform,L="runtime"===B,W=!!t.debug,N=t.sourceMaps,J=t.webOrientation;"auto"===J&&(J="");var z=t.debugBuildWorker,G=j[B].isNative,H=t.dest;if(s.existsSync(H)||(t.buildScriptsOnly=!1),Editor.log("Building "+$),Editor.log("Destination "+H),e.normalize(H)===e.normalize($))return O(new Error("Can not export project at project folder."));if(e.contains(Editor.App.path,H))return O(new Error("Can not export project to fireball app folder."));var Z,Q={tmplBase:e.resolve(Editor.url("unpack://static"),"build-templates"),jsCacheDir:Editor.url("unpack://engine/bin/.cache/"+R),backupDir:"js backups (useful for debugging)"};Z=W?G?L?"cocos2d-runtime.js":"cocos2d-jsb.js":"cocos2d-js.js":G?L?"cocos2d-runtime-min.js":"cocos2d-jsb-min.js":"cocos2d-js-min.js",Object.assign(Q,{template_shares:e.join(Q.tmplBase,"shares/**/*"),template_web_desktop:e.join(Q.tmplBase,W?"web-desktop/template-dev/**/*":"web-desktop/template/**/*"),template_web_mobile:e.join(Q.tmplBase,W?"web-mobile/template-dev/**/*":"web-mobile/template/**/*"),bundledScript:e.join(H,"src",W?"project.dev.js":"project.js"),src:e.join(H,"src"),res:e.join(H,"res"),subpackages:e.join(H,"subpackages"),settings:e.join(H,"src/settings.js"),depends:e.join(H,"res/depends.json"),jsCache:e.join(Q.jsCacheDir,Z),jsCacheExcludes:e.join(Q.jsCacheDir,W?".excludes":".excludes-min"),webDebuggerSrc:Editor.url("app://node_modules/vconsole/dist/vconsole.min.js"),template_instant_games:e.join(Q.tmplBase,"fb-instant-games/**/*"),quickScripts:e.join($,"temp/quick-scripts"),destQuickScripts:e.join(H,"scripts")});let V=new w;F.task("compile",function(e){Editor.Ipc.sendToMain("builder:state-changed","compile",.1);var t={project:$,platform:B,actualPlatform:R,destRoot:H,dest:Q.bundledScript,debug:W,sourceMaps:N,subpackages:Q.subpackages,compileFlags:T};v._runTask(t,function(t,s){t?e(t):(V._subpackages=s,e())})}),F.task("build-assets",function(e){let s=I(e);if(t.buildScriptsOnly)return s();var i,r;Editor.log("Start building assets"),Editor.Ipc.sendToMain("builder:state-changed","spawn-worker",.3);function a(e,t){if(i=!0,r&&!z){var n=r;r=null;try{n.nativeWin.destroy()}catch(e){}}"string"==typeof t&&(t=t.replace(/^Error:\s*/,""),t=new Error(t)),s(t)}n.once("app:build-project-abort",a),m.normal("Start spawn build-worker");var o=!1;Editor.App.spawnWorker("app://editor/page/build/build-worker",function(e,l){m.normal("Finish spawn build-worker"),r=e,o||(o=!0,l.once("closed",function(){i||(n.removeListener("app:build-project-abort",a),Editor.log("Finish building assets"),s())})),m.normal("Start init build-worker"),Editor.Ipc.sendToMain("builder:state-changed","init-worker",.32),r.send("app:init-build-worker",R,W,function(e){function n(){!r||z||(r.close(),r=null)}if(e)s(e),i=!0,n();else if(!i){m.normal("Finish init build-worker"),m.normal("Start build-assets in worker"),Editor.Ipc.sendToMain("builder:state-changed","build-assets",.65);let e=g.pick(t,"scenes","inlineSpriteFrames","mergeStartScene","optimizeHotUpdate"),a=P(t.actualPlatform,"buildConfig");a&&(a.hasOwnProperty("pack"),1)&&(e.pack=a.pack),r.send("app:build-assets",Q.res,R,W,e,function(e,t,r){i||(e?(s(e),i=!0):t&&(V._buildAssets=t,V._packedAssets=r),m.normal("Finish build-assets in worker"),n())},-1)}},-1)},z,!0)});var K=null,X=null;F.task("build-settings",function(i){if(t.buildScriptsOnly){if(X&&!function(t,i,r){let n,o=e.join(t.dest,"src"),l=a.sync(o+"/settings.*",{absolute:!0}),u=e.join(t.dest,r.backupDir,"settings.js");if(0===l.length&&!s.existsSync(u))return!1;0===l.length&&s.existsSync(u)?(n=e.join(t.dest,"src","settings.js"),s.copySync(u,n)):n=l[0];let c=s.readFileSync(n,"utf8");return c=c.replace(/(jsList:\s*)\[[\S\s]*?(?<!\\)"\s*\]/,"$1"+JSON.stringify(i,null,t.debug?4:0)),s.writeFileSync(n,c),!0}(t,Object.keys(X),Q))throw new Error("Update jsList fail, maybe unchecking build-script-only can fix");return i()}var r=Editor.Profile.load("project://project.json");let n={stringify:!1,customSettings:{platform:R,groupList:r.get("group-list"),collisionMatrix:r.get("collision-matrix")},sceneList:t.scenes,uuidList:V.getAssetUuids(),packedAssets:V._packedAssets,orientation:G?"":J,debug:W,subpackages:V._subpackages};"android-instant"===t.platform&&(n.server=t["android-instant"].REMOTE_SERVER_ROOT),U(n,function(e,t,s){e?i(e):(K=t,X=s,i())})});let Y=null;function ee(e,s){var i=[Q.template_shares,e];return F.src(i).pipe(_(t)).pipe(F.dest(H)).on("end",s)}F.task("compress-settings",function(e){if(W||t.buildScriptsOnly)return e();let s={};(function(){let e=K.uuids=[],t={};function i(i){var r=(t[i]||0)+1;t[i]=r,r>=2&&!(i in s)&&(s[i]=e.length,e.push(i))}let r=K.rawAssets;for(let e in r){let t=r[e];for(let e in t)i(e)}let n=K.scenes;for(let e=0;e<n.length;++e)i(n[e].uuid);let a=K.packedAssets;for(let e in a)a[e].forEach(i);let o=K.subpackages;for(let e in o)o[e].uuids&&o[e].uuids.forEach(i);let l=K.md5AssetsMap;for(let e in l){let t=l[e];for(let e=0;e<t.length;e+=2)i(t[e])}e.sort((e,s)=>t[s]-t[e]),e.forEach((e,t)=>s[e]=t)})();let i=K.rawAssets,r=K.rawAssets={};for(let e in i){let t=i[e],a=r[e]={};for(let e in t){var n=t[e];let i=s[e];void 0!==i&&(e=i),a[e]=n}}let a=K.scenes;for(let e=0;e<a.length;++e){let t=a[e],i=s[t.uuid];void 0!==i&&(t.uuid=i)}let o=K.packedAssets;for(let e in o){let t=o[e];for(let e=0;e<t.length;++e){let i=s[t[e]];void 0!==i&&(t[e]=i)}}let l=K.subpackages;for(let e in l){let t=l[e].uuids;if(t)for(let e=0;e<t.length;++e){let i=s[t[e]];void 0!==i&&(t[e]=i)}}if(t.md5Cache){let e=K.md5AssetsMap;for(let t in e){let i=e[t];for(let e=0;e<i.length;e+=2){let t=s[i[e]];void 0!==t&&(i[e]=t)}}Y=function(e){var t=e.uuids,s=e.md5AssetsMap;for(var i in s)for(var r=s[i],n=0;n<r.length;n+=2)"number"==typeof r[n]&&(r[n]=t[r[n]])}}e()}),F.task("build-web-desktop-template",function(e){ee(Q.template_web_desktop,e)}),F.task("build-web-mobile-template",function(e){ee(Q.template_web_mobile,e)}),F.task("build-fb-instant-games-template",function(e){ee(Q.template_instant_games,e)}),F.task("build-plugin-scripts",function(s){let i=I(s);Editor.log("Start building plugin scripts");var r=Editor.assetdb,n=[];let a=function(s){for(var i in X){var a=X[i];let c=r.uuidToFspath(a);var o=e.dirname(e.join(Q.src,i));console.log(`start gulpping ${c} to ${o}`);var l=F.src(c);if(!W){var u=Editor.require("unpack://engine/gulp/util/utils").uglify;let e={jsb:G&&!L,runtime:L,debug:W,support_jit:!1},i=P(t,R);i&&Object.assign(e,i),l=l.pipe(u("build",e)),d.obj([l]).on("error",function(e){s(e.message)})}l=l.pipe(F.dest(o)).on("end",()=>{console.log("finish gulpping",c)}),n.push(l)}n.length>0?c.merge(n).on("end",()=>{Editor.log("Finish building plugin scripts"),s()}):s()};X?a(i):function(e,t){Editor.Ipc.sendToMain("app:query-plugin-scripts",e,(e,s)=>{if(e)return t&&t(e,null),void 0;let i={};s.forEach(e=>{let t=Editor.assetdb.fspathToUuid(e),s=Editor.assetdb.uuidToUrl(t);s=s.slice(S.length),i[s]=t}),t&&t(null,i)})}(B,(e,t)=>{if(e)return i(e);X=t,a(i)})}),F.task("copy-main-js",function(){return F.src([e.join(Q.tmplBase,"shares/main.js")]).pipe(_(t)).pipe(F.dest(H))}),F.task("copy-build-template",function(i){Editor.Ipc.sendToMain("builder:state-changed","copy-build-templates",.98);let r=e.basename(t.dest),n=e.join(t.project,"build-templates");if(!s.existsSync(n))return i();let o=e.join(n,r),l=[e.join(o,"**/*")];["game.json","project.config.json","project.swan.json","manifest.json"].forEach(t=>{l.push(`!${e.join(o,t)}`)}),a(l,(r,a)=>{(a=a.map(t=>e.resolve(t))).forEach(i=>{let r=e.relative(n,i),a=e.join(t.buildPath,r);s.ensureDirSync(e.dirname(a)),s.copySync(i,a)}),i&&i(r)})});var te=require(Editor.url("unpack://engine/gulp/tasks/engine")),se=async function(e,s){var i=G?L?"buildRuntime":"buildJsb":"buildCocosJs";i+=W?"":"Min";let r=te.excludeAllDepends(t.excludedModules);console.log("Exclude modules: "+r);let n={runtime:L,support_jit:!1},a=await async function(e){let t=await C("compileFlags",e);return"object"==typeof t?t:null}(t);a&&Object.assign(n,a),T&&Object.assign(n,T),te[i](Editor.url("unpack://engine/index.js"),e,r,n,s,t.sourceMaps)};function ie(e){let t=h.createHash("md5");for(let i=0;i<e.length;i++){let r;try{r=s.readFileSync(e[i])}catch(e){Editor.error(e);continue}t.update(r)}let i=t.digest("hex");return i=i.slice(0,x)}function re(t){let i=ie(t),r=t,n=[],a=t[0],o=Editor.Utils.UuidUtils.getUuidFromLibPath(a),l=e.dirname(a);return e.basenameNoExt(l)===o&&(r=[l]),r.forEach(e=>{let t=e.replace(Editor.Utils.UuidUtils.Reg_UuidInLibPath,e=>e+"."+i);try{s.renameSync(e,t)}catch(e){u.log(`[31m[MD5 ASSETS] write file error: ${e.message}[0m`)}n.push(t)}),{hash:i,renamedPaths:n}}async function ne(t){const s=Editor.Utils.UuidUtils.getUuidFromLibPath;var i=await r(a)(t,{nodir:!0});let n={};for(let t=0;t<i.length;t++){let r=i[t],a=s(e.relative(H,r));a?(n[a]||(n[a]=[]),n[a].push(r)):Editor.warn(`Can not resolve uuid for path "${r}", skip the MD5 process on it.`)}for(let e in n){let t=n[e];t=t.sort(),n[e]=re(t).hash}return n}F.task("build-cocos2d",async function(){Editor.Ipc.sendToAll("builder:state-changed","cut-engine",0),await k.build(t);let i=H;G&&(i=e.join(H,"src"));let n=await async function(e){return await C("engineBuildPath",e)}(t);n&&(i=n),s.ensureDirSync(Q.jsCacheDir),t.excludedModules=t.excludedModules?t.excludedModules.sort():[];let a=await r(Editor.assetdb.queryAssets.bind(Editor.assetdb))(null,"typescript");let o=t.excludedModules.indexOf("TypeScript Polyfill");-1===o&&0===a.length?t.excludedModules.push("TypeScript Polyfill"):o>-1&&a.length>0&&t.excludedModules.splice(o,1);let u=!1;if(s.existsSync(Q.jsCacheExcludes)){let e=s.readJSONSync(Q.jsCacheExcludes);e.excludes&&e.version&&(u=Editor.versions.cocos2d===e.version&&e.excludes.toString()===t.excludedModules.toString()&&e.sourceMaps===t.sourceMaps)}function c(e){let t=[Q.jsCache];N&&t.push(Q.jsCache+".map");let s=F.src(t,{allowEmpty:!0});G&&(s=s.pipe(l(L?"cocos2d-runtime.js":"cocos2d-jsb.js"))),(s=s.pipe(F.dest(i))).on("end",e)}if(u&&s.existsSync(Q.jsCache))return await r(c)(),void 0;await r(se)(Q.jsCache),await r(c)(),s.writeFileSync(Q.jsCacheExcludes,JSON.stringify({excludes:t.excludedModules,version:Editor.versions.cocos2d,sourceMaps:t.sourceMaps}),null,4)}),F.task("copy-webDebugger",function(){var i=e.join(H,e.basename(Q.webDebuggerSrc));return t.embedWebDebugger?r(s.copy)(Q.webDebuggerSrc,i):b(i,{force:!0})}),F.task("revision-res",async function(){if(t.buildScriptsOnly)return;const s=Editor.Utils.UuidUtils.compressUuid;if(t.md5Cache){console.time("revision");let t=[],i=await ne(e.join(Q.res,"import","**"));for(let e in i)t.push(s(e,!0),i[e]);let r=[e.join(Q.res,"raw-assets","**")];for(let t in V._subpackages){let s=V._subpackages[t],i=e.join(Q.subpackages,s.name,"raw-assets","**");r.push(i)}let n=[],a=await ne(r);for(let e in a)n.push(s(e,!0),a[e]);K.md5AssetsMap={import:t,"raw-assets":n},V._md5Map=i,V._nativeMd5Map=a,console.timeEnd("revision")}}),F.task("save-settings",function(e){if(t.buildScriptsOnly)return e();var i=q(K,W);Y&&(i+=`(${Y.toString()})(${A});`),s.writeFile(Q.settings,i,e)}),F.task("revision-other",async function(){if(!t.md5Cache)return;var s=["src/**/*.js","*"],i=H,r=["index.html"];let n=[];G&&(r=r.concat(["main.js","cocos-project-template.json","project.json"]));var a=[e.relative(i,Q.bundledScript)];let o=await async function(e){let t=P(e.actualPlatform,"md5"),s=null;t&&t.renameIgnore&&(s=t.renameIgnore(e),Array.isArray(s)||Editor.warn("renameIgnore must return an array"));return Array.isArray(s)?s:null}(t);o&&(r=r.concat(o));let l=await async function(e){let t=P(e.actualPlatform,"md5"),s=null;t&&t.searchIgnore&&(s=t.searchIgnore(e),Array.isArray(s)||Editor.warn("searchIgnore must return an array"));return Array.isArray(s)?s:null}(t);l&&(a=a.concat(l));let u=await async function(e){let t=P(e.actualPlatform,"md5"),s=null;t&&t.globalIgnore&&(s=t.globalIgnore(e),Array.isArray(s)||Editor.warn("renameIgnore must return an array"));return Array.isArray(s)?s:null}(t);u&&(n=n.concat(u)),"fb-instant-games"===t.platform&&(r=r.concat(["fbapp-config.json"])),Editor.isWin32&&(a=a.map(e=>e.replace(/\\/g,"/"))),await new Promise((t,o)=>{let l=F.src(s,{cwd:H,base:i}).pipe(p.revision({debug:!0,hashLength:x,dontGlobal:n,dontRenameFile:r,dontSearchFile:a,annotator:function(e,t){return[{contents:e,path:t}]},replacer:function(t,s,i,r){".map"===e.extname(t.path)&&r.revPathOriginal+".map"!==t.path||(t.contents=t.contents.replace(s,"$1"+i+"$3$4"))}})).pipe(f()).pipe(F.dest(H));l.on("end",t),l.on("error",e=>o(e))})}),F.task("subpackages-assets",function(i){if(t.buildScriptsOnly)return i();G&&s.ensureDirSync(Q.subpackages),Editor.assetdb.queryMetas("db://assets/**","folder",async(t,n)=>{if(t)return Editor.error(t);function a(e){let t={};for(let s=0;s<e.length;++s){let i=e[s];if(V.containsAsset(i.uuid)){let e=V.getDependencies(i.uuid);e.length>0&&(t[e[0]]=!0)}}return Object.keys(t)}async function o(t){let s=null,i=null;try{s=await r(Editor.assetdb.queryAssets.bind(Editor.assetdb))(t,null),i=await async function(t){let s=t.filter(e=>"auto-atlas"===e.type),i=[];for(let t=0;t<s.length;++t){let n=e.dirname(s[t].url),o=[];try{o=await r(Editor.assetdb.queryAssets.bind(Editor.assetdb))(n+"/**/*","sprite-frame")}catch(e){throw e}let l=a(o);i=i.concat(l)}return i}(s)}catch(e){return Editor.error(e),[]}let n=(s=s.filter(e=>"javascript"!==e.type&&"typescript"!==e.type&&"folder"!==e.type)).map(e=>e.uuid).concat(i);return g.uniq(n)}n=n.filter(e=>e.isSubpackage);for(let t=0;t<n.length;++t){let a=n[t],l=Editor.assetdb.uuidToFspath(a.uuid),u=a.subpackageName||e.basenameNoExt(l),c=(e.join("subpackage",u),Editor.assetdb.uuidToUrl(a.uuid)+"/**/*"),d=null;try{d=await o(c)}catch(e){return i(e)}let p=e.join(Q.subpackages,u)+"/";for(let t=0;t<d.length;++t){let n=d[t],a=V.containsAsset(n)&&V.getNativeAssetPaths(n);if(!a||0===a.length)continue;let o=[];for(let t=0;t<a.length;++t){let n=a[t],l=e.relative(Q.res,n),u=e.join(p,l);try{await r(s.move)(n,u)}catch(e){return i(e)}o.push(u)}V._buildAssets[n].nativePath=o[0],V._buildAssets[n].nativePaths=o;let l=V._subpackages[u];l&&(l.uuids||(l.uuids=[]),-1===l.uuids.indexOf(n)&&l.uuids.push(n))}}i()})}),F.task("before-change-files",function(e){let s=require(Editor.url("app://editor/share/build-utils"));Editor.Builder.doCustomProcess("before-change-files",s.getCommonOptions(t),V,e)}),F.task("script-build-finished",function(e){let s=require(Editor.url("app://editor/share/build-utils"));Editor.Builder.doCustomProcess("script-build-finished",s.getCommonOptions(t),V,e)}),F.task("copy-runtime-scripts",function(){var t=e.join(H,"src");return F.src(e.join(Q.tmplBase,"runtime/**/*.js")).pipe(F.dest(t))}),F.task("before-finish-build",async function(){await async function(e,t){return await C("beforeFinish",e,t)}(t,K)}),F.task("encrypt-src-js",function(i){if(W||!t.encryptJs)return i(),void 0;var r=e.join(H,"src"),n=e.resolve(r,`../${Q.backupDir}`);s.copy(r,n,e=>{e&&Editor.warn("Failed to backup js files for debugging.",e),y.encryptJsFiles(t,t.subpackages,i)})}),F.task("build-jsb-adapter",function(){return Editor.require("app://editor/share/build-jsb-adapter").build({rootPath:Editor.url("packages://jsb-adapter"),dstPath:e.join(H,"jsb-adapter"),excludedModules:t.excludedModules})}),F.task("build-common",F.series("compile","build-assets","build-plugin-scripts","build-settings")),F.task("finish-build",F.series("copy-build-template","subpackages-assets","before-change-files","revision-res","compress-settings","save-settings","revision-other")),F.task(E+"web-desktop",F.series("build-cocos2d",F.parallel("build-common","copy-webDebugger"),"build-web-desktop-template","finish-build")),F.task(E+"web-mobile",F.series("build-cocos2d",F.parallel("build-common","copy-webDebugger"),"build-web-mobile-template","finish-build")),F.task(E+"fb-instant-games",F.series("build-cocos2d",F.parallel("build-common","copy-webDebugger"),"build-fb-instant-games-template","finish-build")),F.task(E+"mini-game",F.series("build-cocos2d","build-common","script-build-finished","before-finish-build","finish-build")),F.task("copy-native-files",F.series("build-common","copy-runtime-scripts","copy-main-js","finish-build","encrypt-src-js")),F.task("build-cocos-native-project",function(e){y.build(t,e)}),F.task("build-native-project",F.series("build-cocos-native-project","build-cocos2d","build-jsb-adapter","copy-native-files")),F.task("copy-win32-dll",()=>{let t=["msvcp100.dll","msvcp110.dll","msvcp120.dll","msvcp120d.dll","msvcp140.dll","msvcp140d.dll","msvcr100.dll","msvcr110.dll","msvcr120.dll","msvcr120d.dll"],i=e.join(Editor.App.path,"cocos2d-x/simulator/win32"),r=e.join(H,"frameworks/runtime-src/proj.win32","Debug.win32"),n=e.join(H,"frameworks/runtime-src/proj.win32","Release.win32");return s.ensureDirSync(r),s.ensureDirSync(n),t=t.map(t=>e.join(i,t)),F.src(t,{allowEmpty:!0}).pipe(F.dest(r)).pipe(F.dest(n))}),F.task(E+"android",F.parallel("build-native-project")),F.task(E+"ios",F.parallel("build-native-project")),F.task(E+"win32",F.series("build-native-project","copy-win32-dll")),F.task(E+"mac",F.parallel("build-native-project")),F.task(E+"android-instant",F.parallel("build-native-project")),F.task(E+"runtime",F.series("build-cocos2d","copy-native-files"));var ae=E+B;if(ae in F._registry._tasks){let i=I(O);var oe=[Q.subpackages+"/**/*"];let r=await async function(e){let t=await C("delPattern",e);return Array.isArray(t)?t:null}(t);if(r?oe=r:G?oe.push(Q.res+"/**/*",Q.src+"/**/*"):oe.push(e.join(H,"**/*")),t.buildScriptsOnly){(W?Editor.log:Editor.warn)(Editor.T("BUILDER.build_script_only_tips")),oe.push("!"+Q.res),oe.push("!"+Q.res+"/**/*"),oe.push("!"+Q.subpackages),oe.push("!"+Q.subpackages+"/**/*"),oe.push("!"+Q.src),oe.push("!"+Q.src+"/settings.js"),oe.push("!"+Q.src+"/settings.*.js"),function(t){let i=e.join(t.dest,"src"),r=a.sync(i+"/settings.*",{absolute:!0});if(0===r.length)return;r=r[0];let n=e.extname(r);s.renameSync(r,e.join(i,`settings${n}`))}(t)}Editor.log("Delete "+oe),b(oe,{force:!0}).then(()=>{F.once("error",function(e){i(function(e){return e.error?"boolean"==typeof e.error.showStack?e.error.toString():e.error.stack?e.error:new Error(String(e.error)):new Error(String(e.message))}(e))}),F.task(ae)(function(){G||Editor.Ipc.sendToMain("app:update-build-preview-path",H),i(null,V)})}).catch(O)}else{var le=[];for(var ue in F._registry._tasks)0===ue.indexOf(E)&&le.push(ue.substring(E.length));O(new Error(i("Not support %s platform, available platform currently: %s",B,le)))}},exports.getTemplateFillPipe=_,exports.buildSettings=U;