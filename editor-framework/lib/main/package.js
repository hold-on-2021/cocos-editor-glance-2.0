"use strict";let e={};module.exports=e;const n=require("electron"),a=require("fire-path"),t=require("fire-fs"),i=require("async"),r=require("semver"),o=require("lodash"),l=require("../profile"),d=require("./console"),s=require("./main-menu"),c=require("./ipc"),f=require("../app"),u=require("./i18n"),p=require("../share/ipc-listener");let m="en",h={},g={},y={},$={},k={},P=[];function v(e,n){return-1===n.indexOf(":")?`${e}:${n}`:n}e.load=function(P,j){if(g[P]||y[P])return j&&j(),void 0;y[P]="load";let b,q=a.join(P,"package.json");try{b=JSON.parse(t.readFileSync(q))}catch(e){return delete y[P],j&&j(new Error(`Failed to load 'package.json': ${e.message}`)),void 0}if(!b.name)return delete y[P],d.warn(`Invalid package name: The plug-in name is not defined \n  ${P}.`),j&&j(new Error("Failed to load 'package.json': The plug-in name is not defined.")),void 0;b.name!==b.name.toLowerCase()&&(b.name=b.name.toLowerCase(),d.warn(`Invalid package name: ${b.name}: do not contains uppercase characters.`));for(let e in b.hosts){let n=h[e];if(!n)return delete y[P],j&&j(new Error(`Host '${e}' does not exist.`)),void 0;let a=b.hosts[e];if(!r.satisfies(n,a,{includePrerelease:!0}))return delete y[P],j&&j(new Error(`Host '${e}' require ver ${a}`)),void 0}i.series([n=>{let a=b.packages;if(b.pkgDependencies&&(d.warn(`Package ${b.name} parse warning: "pkgDependencies" is deprecated, use "packages" instead.`),a=b.pkgDependencies),!a)return n(),void 0;i.eachSeries(Object.keys(a),(n,a)=>{let t=e.find(n);if(!t)return a(new Error(`Cannot find dependent package ${n}`));e.load(t,a)},n)},i=>{b._path=P,b._destPath=P,b["entry-dir"]&&(b._destPath=a.join(b._path,b["entry-dir"]));let r=a.join(b._destPath,"i18n",`${m}.js`);if(t.existsSync(r))try{u.extend({[b.name]:require(r)})}catch(e){return i(new Error(`Failed to load ${r}: ${e.stack}`)),void 0}let c=null;if(b.main){let e=a.join(b._destPath,b.main);try{c=require(e)}catch(e){return i(new Error(`Failed to load ${b.main}: ${e.stack}`)),void 0}}if(c){let e=new p;for(let n in c.messages){let a=c.messages[n];"function"==typeof a&&e.on(v(b.name,n),a.bind(c))}b._ipc=e}let f=b["main-menu"];if(f&&"object"==typeof f)for(let e in f){let t=u.formatPath(e),i=a.dirname(t);if("."===i){d.failed(`Failed to add menu ${t}`);continue}let r=f[e],o=Object.assign({label:a.basename(t)},r);if(r.icon){let e=n.nativeImage.createFromPath(a.join(b._destPath,r.icon));o.icon=e}s.add(i,o)}let h=b,j=!1;b.panels&&(d._temporaryConnent(),d.warn(`\n           Package ${b.name} parse warning: "panels" is deprecated, use "panel" instead.\n           For multiple panel, use "panel.x", "panel.y" as your register field.\n           NOTE: Don't forget to change your "Editor.Ipc.sendToPanel" message, since your panelID has changed.\n        `),d._restoreConnect(),h=b.panels,j=!0);for(let e in h){if(0!==e.indexOf("panel"))continue;let n=h[e];for(let e in n.profiles){d._temporaryConnent(),d.warn(`The profile of the panel (${b.name}) needs to be moved to the package root`),d._restoreConnect(),b.profiles||(b.profiles={}),b.profiles[e]||(b.profiles[e]={});let a=n.profiles[e],t=b.profiles[e];Object.keys(a).forEach(e=>{t[e]=a[e]})}}if(b.profiles)try{for(let e in b.profiles){let n=l.load(`${e}://${b.name}.json`),a=b.profiles[e];Object.keys(a).forEach(e=>{void 0===n.get(e)&&n.set(e,a[e])})}}catch(e){d.failed(`Initial Package Profile [${b._destPath}] failed！`+e)}for(let e in h){let n;if(j)n=`${b.name}.${e}`;else{if(0!==e.indexOf("panel"))continue;n=e.replace(/^panel/,b.name)}if(k[n]){d.failed(`Failed to load panel "${e}" from "${b.name}", the panelID ${n} already exists`);continue}let i=h[e];o.defaults(i,{path:b._destPath,type:"dockable",title:n,popable:!0,"shadow-dom":!0,frame:!0,resizable:!0,devTools:!0,profileTypes:Object.keys(b.profiles||{}),engineSupport:!1}),i.main?t.existsSync(a.join(b._destPath,i.main))?k[n]=i:d.failed(`Failed to load panel "${e}" from "${b.name}", main file "${i.main}" not found.`):d.failed(`Failed to load panel "${e}" from "${b.name}", "main" field not found.`)}if(g[P]=b,$[b.name]=P,c&&c.load)try{c.load(),y[P]="ready"}catch(n){return e.unload(P,()=>{i(new Error(`Failed to execute load() function: ${n.stack}`))}),void 0}i()},e=>{if(f.loadPackage)return f.loadPackage(b,e),void 0;e()},e=>{d.success(`${b.name} loaded`),c.sendToWins("editor:package-loaded",b.name),e()}],e=>{e?delete y[P]:y[P]="ready",j&&j(e)})},e.unload=function(e,n){let t=g[e];if(!t||"ready"!==y[e])return n&&n(),void 0;const r=y[e];y[e]="unload",i.series([e=>{if(f.unloadPackage)return f.unloadPackage(t,e),void 0;e()},n=>{u.unset([t.name]);let i=t,r=!1;t.panels&&(i=t.panels,r=!0);for(let e in i){let n;if(r)n=`${t.name}.${e}`;else{if(0!==e.indexOf("panel"))continue;n=e.replace(/^panel/,t.name)}delete k[n]}let o=t["main-menu"];if(o&&"object"==typeof o)for(let e in o){let n=u.formatPath(e);s.remove(n)}if(t._ipc&&t._ipc.clear(),t.main){let e=require.cache,n=a.join(t._destPath,t.main),i=e[n];if(i){let a=i.exports;if(a&&a.unload)try{a.unload()}catch(e){d.failed(`Failed to unload "${t.main}" from "${t.name}": ${e.stack}.`)}(function e(n,a){if(!n)return;let t=[];a.forEach(e=>{let a=e.filename;0===a.indexOf(n)&&(e.children.forEach(e=>{t.push(e)}),delete require.cache[a])});t.length>0&&e(n,t)})(t._destPath,i.children),delete e[n]}else d.failed(`Failed to uncache module ${t.main}: Cannot find it.`)}delete g[e],delete $[t.name],d.success(`${t.name} unloaded`),c.sendToWins("editor:package-unloaded",t.name),n()}],a=>{a?y[e]=r:delete y[e],n&&n(a)})},e.reload=function(n,a){const t=y[n];t&&"ready"!==t||i.series([e=>{if(!g[n])return e(),void 0;e()},a=>{e.unload(n,a)},a=>{e.load(n,a)}],e=>{a&&a(e)})},e.panelInfo=function(e){return k[e]},e.packageInfo=function(e){for(let n in g)if(a.contains(n,e))return g[n];return null},e.packagePath=function(e){return $[e]},e.addPath=function(e){Array.isArray(e)||(e=[e]),P=o.union(P,e)},e.removePath=function(e){let n=P.indexOf(e);-1!==n&&P.splice(n,1)},e.resetPath=function(){P=[]},e.find=function(e){for(let n=0;n<P.length;++n){let i=P[n];if(t.isDirSync(i)){if(-1!==t.readdirSync(i).indexOf(e))return a.join(i,e)}}return null},Object.defineProperty(e,"paths",{enumerable:!0,get:()=>P.slice()}),Object.defineProperty(e,"lang",{enumerable:!0,set(e){m=e},get:()=>m}),Object.defineProperty(e,"versions",{enumerable:!0,set(e){h=e},get:()=>h});const j=n.ipcMain;j.on("editor:package-query-infos",e=>{let n=[];for(let e in g)n.push({path:e,enabled:!0,info:g[e]});e.reply(null,n)}),j.on("editor:package-query-info",(e,n)=>{let a=$[n],t=g[a=a||""];e.reply(null,{path:a,enabled:!0,info:t})}),j.on("editor:package-reload",(n,a)=>{let t=$[a];if(!t)return d.error(`Failed to reload package ${a}, not found`),void 0;e.reload(t)});