"use strict";const e=require("lodash/pullAll"),r=require("fire-fs"),t=require("fire-path"),o=require("../../share/manual"),n=require("electron").ipcMain,l=Editor.Profile.load("global://settings.json");n.on("app:query-recent",e=>{let r=l.get("recently-opened"),t=!1,o=r.map(e=>new Promise((o,n)=>{Editor.App.getProjectInfo(e,n=>{if(!n){let o=r.indexOf(e);r.splice(o,1),t=!0}o(n||null)})}));Promise.all(o).then(r=>{r=r.filter(e=>!!e),t&&l.save(),e.reply(null,r)})}),n.on("app:query-templates",async o=>{try{const n="manifest.txt";let l,a,i=Editor.url("unpack://templates");if(!r.existsSync(i)||!r.isDirSync(i))return console.log(`Can not find folder ${i}.`),o.reply(null,[]);try{l=r.readFileSync(t.join(i,n),"utf8").split(/\r?\n/).filter(Boolean)}catch(e){console.log(`Failed to read manifest.txt from ${i}: ${e.message}`),l=[]}try{a=r.readdirSync(i)}catch(e){console.log(`Can not read dir "${i}": ${e.message}`),a=[]}a=a.filter(e=>e!==n),e(a,l),a=l.concat(a);let p=await Promise.all(a.map(e=>{e=t.join(i,e);let o=t.join(e,"template.json");return new Promise((n,l)=>{r.readJson(o,(r,l)=>{if(r)return console.error(`Can not read "${o}": ${r}`),n(null);l.banner=t.join(e,l.banner),l.name=Editor.T(l.name),l.desc=Editor.T(l.desc),l.path=e,l.templateName=t.basename(e),n(l)})})}));p=p.filter(Boolean),o.reply(null,p)}catch(e){console.error(`Failed to query templates: ${e}`),o.reply(null,[])}}),n.on("app:create-project",(e,o)=>{Editor.log(`Creating new project from template: ${o.template}`),Editor.App.createProject(o,n=>{if(n)return e.reply(Editor.Utils.wrapError(n)),void 0;try{let e=r.readFileSync(t.join(o.path,"project.json"),"utf8");e=JSON.parse(e),Editor.CocosAnalytics.trackCocosEvent("CreateProjectId",{projectId:e.id,projectNm:t.basename(o.path),template:o.templateName,dimension:null})}catch(e){console.error(e)}Editor.App.runEditor(o.path,Editor.requireLogin,Editor.dev,()=>{Editor.App.addProject(o.path),Editor.Window.main.close(),e.reply(null)})})}),n.on("app:open-project",(e,r,t)=>{Editor.App.checkProject(r,(o,n)=>{if(o)return e.reply(Editor.Utils.wrapError(o),n),void 0;if(n.abort)return e.reply(null,n),void 0;let l=Editor.requireLogin;t||(l=!1),Editor.App.runEditor(r,l,Editor.dev,()=>{Editor.App.addProject(r),Editor.Window.main.close(),e.reply(null,n)})})}),n.on("app:delete-project",(e,r)=>{Editor.App.deleteProject(r)}),n.on("app:close-project",(e,r)=>{Editor.App.removeProject(r)}),n.on("app:window-minimize",()=>{Editor.Window.main.minimize()}),n.on("app:window-close",()=>{Editor.Window.main.close()}),n.on("app:get-last-create",e=>{let r=l.get("last-create");void 0===r&&(r=null),e.returnValue=r}),n.on("app:open-manual-doc",(e,r)=>{o.openManual(r),e.reply(null)}),n.on("app:open-api-doc",(e,r)=>{o.openAPI(r),e.reply(null)}),n.on("app:query-last-create-path",(e,r)=>{e.reply(null,l.get("last-create-path")||null)});