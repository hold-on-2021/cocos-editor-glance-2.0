const e=require("fire-path"),t=require("util"),s=require("async");let r=cc.AssetLibrary._loadBuiltins;cc.AssetLibrary._loadBuiltins=function(e){r(()=>{s.eachSeries(["db://assets/**/*.effect","db://internal/effects/**/*.effect"],(e,t)=>{Editor.assetdb.queryAssets(e,null,async(e,r)=>{if(e)return t(e);s.eachSeries(r,(e,t)=>{cc.AssetLibrary.loadAsset(e.uuid,t)},e=>{t(e)})})},t=>{e(t)})})},cc.EffectAsset.prototype.onLoad=function(){let e=cc.renderer._forward._programLib;for(let t=0;t<this.shaders.length;t++){let s=this.shaders[t];delete e._templates[s.name],e._cache={},e.define(s)}cc.AssetLibrary.getBuiltins("effect")[this.name]=this,_Scene.MaterialUtils.onEffectReload(this)},module.exports={assetChanged(e){"effect"===e.type&&cc.AssetLibrary.loadAsset(e.uuid,e=>{if(e)return Editor.error(e);clearTimeout(this._softReloadTimerID),this._softReloadTimerID=setTimeout(()=>{console.log("scene:soft-reload"),Editor.Ipc.sendToWins("scene:soft-reload",!0)},250)})},async assetsCreated(e){let s=!1;await Promise.all(e.map(async e=>{if("effect"===e.type)return s=!0,t.promisify(cc.AssetLibrary.loadAsset)(e.uuid)})),s&&Editor.Ipc.sendToWins("scene:soft-reload",!0)},assetsMoved(t){let s=!1,r=cc.AssetLibrary.getBuiltins("effect");t.forEach(t=>{if(".effect"!==e.extname(t.destPath))return;s=!0;let a=e.basenameNoExt(t.srcPath),i=r[a];delete r[a],a=e.basenameNoExt(t.destPath),r[a]=i}),s&&Editor.Ipc.sendToWins("scene:soft-reload",!0)},assetsDeleted(t){let s=!1;t.forEach(t=>{if(".effect"!==e.extname(t.path))return;s=!0;let r=e.basenameNoExt(t.path);delete cc.AssetLibrary.getBuiltins("effect")[r]}),s&&Editor.Ipc.sendToWins("scene:soft-reload",!0)}};