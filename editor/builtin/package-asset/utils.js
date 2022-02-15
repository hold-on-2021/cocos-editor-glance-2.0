const e=require("fire-fs"),t=require("fire-path"),o=require("async"),r=require("electron").remote.dialog;exports.ASSET_TYPE="&asset&type&.json",exports.init=function(e){this.localProfiles=e.local},exports.getDataByKey=function(e){return this.localProfiles.get(e)||""},exports.save=function(e,t){this.localProfiles.set(e,t),this.localProfiles.save()};let s=Object.create(null);exports.setSelectedStates=function(e,t){s[e]=t},exports.getSelectedStates=function(e){let t=s[e];return void 0===t||t},exports.showErrorMessageBox=function(e,t){r.showErrorBox(e,t)},exports.showImportConflictMessageBox=function(e,t,o){r.showMessageBox({type:"info",title:e,message:t,buttons:[Editor.T("MESSAGE.yes"),Editor.T("MESSAGE.no")]},e=>{o&&o(null,0===e)})},exports.showImportMessageBox=function(e,t,o){r.showMessageBox({type:"info",title:e,message:t,buttons:[Editor.T("MESSAGE.yes"),Editor.T("MESSAGE.no")],defaultId:0,cancelId:1},e=>{o&&o(null,0===e)})},exports.showImportZipDialog=function(e){r.showOpenDialog({defaultPath:this.localProfiles.get("import-folder-path")||Editor.Project.path,properties:["openFile"],filters:[{name:"zip",extensions:["zip".toLowerCase()]}]},t=>{if(!e||!t)return;let o=t[0];e(null,o),this.save("import-folder-path",o)})},exports.showImportOutPathDialog=function(e){r.showOpenDialog({defaultPath:this.localProfiles.get("out-path")||t.join(Editor.Project.path,"assets"),properties:["openDirectory"]},o=>{if(!e||!o)return;let r=t.join(o[0],"/");e(null,r),this.save("out-path",r)})},exports.showExportResDialog=function(e){r.showOpenDialog({defaultPath:this.localProfiles.get("current-resource")||Editor.Project.path,properties:["openFile"],filters:[{name:"resource",extensions:["fire","prefab"]}]},t=>{if(!e||!t)return;let o=t[0],r=Editor.assetdb.remote.loadMetaByPath(o);e(null,{path:o,uuid:r.uuid}),this.save("current-resource",o)})},exports.showExportOutPathDialog=function(e){let t=this.localProfiles.get("export-resource-path")||Editor.Project.path,o=r.showSaveDialog({title:Editor.T("EXPORT_ASSET.title"),defaultPath:t,filters:[{name:"Package",extensions:["zip"]}]});o&&(e(null,o),this.save("export-resource-path",o))},exports.isDirectory=function(t){return e.existsSync(t)},exports.createFolder=function(t){e.existsSync(t)||e.mkdirSync(t)},exports.copyFile=function(t,o){let r=e.createReadStream(t),s=e.createWriteStream(o);e.statSync(t),r.on("data",function(e){!1===s.write(e)&&r.pause()}),r.on("end",function(){s.end()}),s.on("drain",function(){r.resume()})},exports.copy=function(r,s,i,n){let a=e.readdirSync(r);if(0===a.length)return n(),void 0;o.each(a,(o,n)=>{if(!i[o])return n(),void 0;let a=t.join(r,o),l=t.join(s,o);e.statSync(a).isDirectory()?(this.createFolder(l),this.copy(a,l,i,n)):(this.copyFile(a,l),n())},n)},exports.getIcon=function(e){let t=Editor.assetdb.remote.loadMetaByUuid(e),o=t.assetType();if("texture"===o)return`thumbnail://${e}?32`;if("sprite-frame"===o)return`thumbnail://${t.rawTextureUuid}?32`;if("dragonbones"===o)o="spine";else{if("effect"===o)return"unpack://static/icon/assets/shader.png";if("fbx"===o||"gltf"===o)return"unpack://static/icon/assets/prefab.png"}return"unpack://static/icon/assets/"+o+".png"};