"use strict";const e=require("fire-path"),r=(require("fire-url"),require("async")),i=(require("fire-fs"),require("node-uuid")),o=(require("./source-maps"),require("../global-variables-protecter"));let s,t,a,n=require,l=!1,c=require("../../project-scripts"),d=c.loadScript;c.loadScript=function(r,i){var o=p._globalsVerifier_loadPluginScript,s=e.relative(Editor.Project.path,r);"."===s[0]&&(s=r),o.info="loading "+s,o.record(),d.call(c,r,()=>{o.restore(),i()})};let u=c.loadCommon;c.loadCommon=function(e){var r=p._globalsVerifier_loadScript;r.info="loading common project scripts",r.record(),u.call(c,()=>{r.restore(),e()})};let p={reset(){cc.Object._deferredDestroy(),cc._componentMenuItems=a.slice(),cc.js._registeredClassIds=s,cc.js._registeredClassNames=t,this._globalsVerifier_editing.isRecorded()&&this._globalsVerifier_editing.restore(),this._globalsProtecter.isRecorded()&&this._globalsProtecter.restore(),cc._RF.reset(),Editor.Utils.UuidCache.clear(),cc.director.reset(),cc.loader.releaseAll()},reload(e,i){this.compiled=e,this.reloading=!0;var o=_Scene.getEditingWorkspace();_Scene.reset();var s={scene:cc.director.getScene(),sceneName:cc.director.getScene().name,undo:_Scene.Undo.dump(),stashedDatas:this._liveReloadableDatas},t=Editor.serialize(s,{stringify:!1,discardInvalid:!1,reserveContentsForSyncablePrefab:!0});(function(){var e=Editor.require("unpack://engine-dev/cocos2d/core/load-pipeline/uuid-loader").isSceneObj(t);console.assert(e,"jsons should be scene object to support missing script")})();var a=cc.deserialize.reportMissingClass;r.waterfall([e=>{e(null,Editor.Profile.load("global://settings.json"))},(e,r)=>{e.get("auto-refresh")?_Scene.stashScene(()=>{Editor.Ipc.sendToMain("app:reload-on-device"),r()}):r()},e=>{p.reset(),e()},p.loadScripts,e=>{this._globalsVerifier_loadScene.record(),cc.deserialize.reportMissingClass=function(){},cc.AssetLibrary.loadJson(t,e)},(e,r)=>{cc.deserialize.reportMissingClass=a,this._globalsVerifier_loadScene.restore(),e.scene.name=e.sceneName,e.scene._prefabSyncedInLiveReload=!0,this._globalsVerifier_unloadScene.record(),this._globalsVerifier_runScene.record(),cc.director.runSceneImmediate(e.scene,()=>{this._globalsVerifier_unloadScene.restore()}),this._globalsVerifier_runScene.restore(),this._globalsVerifier_editing.record(),e.scene._prefabSyncedInLiveReload=!1,_Scene.Undo.restore(e.undo),this._liveReloadableDatas=e.stashedDatas,_Scene.loadWorkspace(o),r(null)}],(e,r)=>{cc.deserialize.reportMissingClass=a,this.reloading=!1,i(e,r)})},loadScripts(e){l||(l=!0,p._globalsProtecter.record(),s=cc.js._registeredClassIds,t=cc.js._registeredClassNames,a=cc._componentMenuItems.slice()),c.load(r=>{let i=cc.js,o=["i18n:MAIN_MENU.component.renderers","i18n:MAIN_MENU.component.mesh","i18n:MAIN_MENU.component.ui","i18n:MAIN_MENU.component.collider","i18n:MAIN_MENU.component.physics","i18n:MAIN_MENU.component.others","i18n:MAIN_MENU.component.scripts","|%%separator%%|"];o.forEach((e,r)=>{o[r]=Editor.i18n.formatPath(e)});let s={};o.forEach(e=>{s[e]=[]}),cc._componentMenuItems.forEach((e,r)=>{let i=Editor.i18n.formatPath(e.menuPath.split("/")[0]);s[i]||(s[i]=[],o.push(i)),s[i].push(e)}),o.forEach(e=>{s[e].sort((e,r)=>e.menuPath.localeCompare(r.menuPath,"en",{numeric:!0}))});let t=[];for(let e in s)if("|%%separator%%|"===e)t.push({type:"separator"});else{s[e].forEach(e=>{t.push({path:Editor.i18n.formatPath(e.menuPath),panel:"scene",message:"scene:add-component",params:[null,i._getClassId(e.component)]})})}Editor.Menu.register("add-component",t,!0),Editor.MainMenu.update(Editor.T("MAIN_MENU.component.title"),t),e(r)})},_liveReloadableDatas:Object.create(null),registerReloadableData(e){var r=i.v4();return this._liveReloadableDatas[r]=e,r},popReloadableData(e){var r=this._liveReloadableDatas[e];return delete this._liveReloadableDatas[e],r},restoreElectronRequire(){require=n},getElectronRequire:()=>n,compiled:!1,reloading:!1,_globalsProtecter:new o,_globalsVerifier_loadPluginScript:new o({ignoreNames:["require"],callbacks:{modified:Editor.log,deleted:Editor.warn},dontRestore:{introduced:!0}}),_globalsVerifier_loadScript:new o({ignoreNames:["require"],callbacks:{modified:Editor.warn,deleted:Editor.warn},dontRestore:{introduced:!0}}),_globalsVerifier_editing:new o({info:"editing",callbacks:Editor.log}),_globalsVerifier_loadScene:new o({info:"deserializing scene by using new scripts",callbacks:Editor.warn}),_globalsVerifier_unloadScene:new o({info:"unloading the last scene",callbacks:Editor.warn}),_globalsVerifier_runScene:new o({info:"launching scene by using new scripts",callbacks:Editor.warn})};module.exports=p;