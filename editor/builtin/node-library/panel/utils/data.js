"use strict";const e=require("fire-fs"),r=require("path"),t=require("events");let o=require("./icon"),n=require("./prefab"),s=null;exports.event=new t.EventEmitter,exports.event.setMaxListeners(100),exports.set=function(e){let r=e.local,t=r.get("user");t&&t.classify&&!t.prefab?(r.remove("classify"),r.remove("title"),r.remove("modify"),r.save(),exports.event.emit("profile-save")):t||(t={name:"User",prefab:[]},r.set("user",t),r.save(),exports.event.emit("profile-save")),s=e},exports.get=function(){return s},exports.queryZoom=function(){return s.global.get("prefabZoom")||1},exports.setZoom=function(e){s.global.set("prefabZoom",e),s.global.save(),exports.event.emit("profile-save")},exports.queryList=async function(e){let r=s.local.get("user");return 2===e&&r?[r]:await n.query(e)},exports.setIcon=function(t,o){if(!e.existsSync(o))return!1;if(e.statSync(o).size>20480)return Editor.warn(Editor.T("node-library.warning.icon_size")),!1;let n=r.join(Editor.Project.path,"temp","node-library-icon");e.ensureDirSync(n);let s=r.join(n,`${t}.png`);e.copySync(o,s),exports.event.emit("prefab-icon-changed",t)},exports.deleteIcon=function(t){let o=r.join(Editor.Project.path,"temp","node-library-icon",`${t}.png`);e.existsSync(o)&&e.removeSync(o),exports.event.emit("prefab-icon-changed",t)},exports.queryIcon=function(t){let n=o[t];if(!n){let s=r.join(Editor.Project.path,"temp","node-library-icon",`${t}.png`);n=e.existsSync(s)?s:o.default}return n},exports.pushUserPrefab=function(e){Editor.assetdb.queryInfoByUuid(e,(t,o)=>{let n=r.basename(o.path).replace(/\.([^\.]+)$/,""),i=s.local.get("user")||{name:"User",prefab:[]};if(i.prefab.some(r=>r.uuid===e))return Editor.warn(Editor.T("node-library.warning.prefab_exists"));i.prefab.push({name:n,uuid:e}),s.local.set("user",i),s.local.save(),exports.event.emit("profile-save")})},exports.deleteUserPrefab=function(e){let r=s.local.get("user");r&&r.prefab&&(r.prefab.some((t,o)=>t.uuid===e&&(r.prefab.splice(o,1),!0)),s.local.set("user",r),s.local.save(),exports.event.emit("profile-save"))},exports.renameUserPrefab=function(e,r){let t=s.local.get("user");t&&t.prefab&&(t.prefab.some((t,o)=>t.uuid===e&&(t.name=r,!0)),s.local.set("user",t),s.local.save(),exports.event.emit("profile-save"))};