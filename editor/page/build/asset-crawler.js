"use strict";var e=require("async"),s=require("lodash");"undefined"==typeof _Scene&&(window._Scene={});var t=Editor.require("app://editor/page/scene-utils/utils/node"),i=require("./build-asset");class r{constructor(t,n,a){this._ownerCaches=Object.create(null),this._results=Object.create(null),this.texturePacker=a;this.queue=e.queue((e,n)=>{t.build(e,(t,a)=>{if(t)if(t.message===i.AssetMissing){var u=this._ownerCaches[e];u&&r._reportMissingAsset(e,u)}else Editor.error(t.message||t);else{var d=a.dependUuids,o=a.nativePaths,h=null;if(d&&d.length>0){var l=s.uniq(d);(h=h||{}).dependUuids=l;var c={assetUuid:e,dependUuids:d,ownersForDependUuids:a.ownersForDependUuids};this.parse(l,c)}o&&((h=h||{}).nativePath=o[0],h.nativePaths=o),h&&(this._results[e]=h)}this._ownerCaches[e]=void 0,n()})},n)}static _reportMissingAsset(e,s){var i=s.assetUuid,r=`Cannot find the asset referenced in "${Editor.assetdb.remote.uuidToUrl(i)}", it may have been deleted. Detailed information:\n`,n=s.ownersForDependUuids;if(n){var a=s.dependUuids.indexOf(e);if(-1!==a){var u=n[a];if(u instanceof cc.Component){var d=u.node;r+=`Node path: "${t.getNodePath(d)}"\n`,r+=`Used in Component: "${cc.js.getClassName(u)}"\n`}else if("string"==typeof u.name)r+=`Used in object: "${u.name}"\n`;else{var o=cc.js.getClassName(u);o&&(r+=`Used by "${o}"\n`)}}}r+=`uuid: "${e}"`,Editor.warn(r)}parse(e,s){if(this.texturePacker&&(e=e.filter(e=>!this.texturePacker.needPack(e))),1===e.length){let t=e[0];if(this._results[t])return;s&&(this._ownerCaches[t]=s),this._results[t]=!0,this.queue.push(t)}else{var t=[];for(let i=0;i<e.length;i++){let r=e[i];this._results[r]||(s&&(this._ownerCaches[r]=s),t.push(r),this._results[r]=!0)}t.length>0&&this.queue.push(t)}}start(e,s){this.queue.drain(()=>{Editor.error("task not pushed")}),this.parse(e),this.queue.drain(()=>{s(null,this._results)})}}module.exports=r;