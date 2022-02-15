var e=require("lodash"),s=require("fire-url"),r=require("../../share/engine-extends/object-walker"),i=Editor.require("app://editor/page/scene-utils/utils/node"),t=cc.js._getClassById,n=require("./missing-reporter");function o(r,t,o,a,c,d){d=d||r._$erialized&&r._$erialized.__type__,function(e,r,t,o){var a=n.getObjectType(t),c=o&&s.basename(o);if(t instanceof cc.SceneAsset||t instanceof cc.Prefab){var d,l,p;e instanceof cc.Component?p=(l=e).node:cc.Node.isNode(e)&&(p=e);var u=c?` in ${a} "${c}"`:"",f=r,h=!1;if(l){var g=cc.js.getClassName(l);l instanceof cc._MissingScript&&(h=!0,f=g=l._$erialized.__type__),d=`Class "${r}" used by component "${g}"${u} is missing or invalid.`}else{if(!p)return;h=!0,d=`Script attached to "${p.name}"${u} is missing or invalid.`}d+=n.INFO_DETAILED,d+=`Node path: "${i.getNodePath(p)}"\n`,o&&(d+=`Asset url: "${o}"\n`),h&&Editor.Utils.UuidUtils.isUuid(f)&&(d+=`Script UUID: "${Editor.Utils.UuidUtils.decompressUuid(f)}"\n`,d+=`Class ID: "${f}"\n`),d.slice(0,-1),Editor.warn(d)}}(t instanceof cc.Component||cc.Node.isNode(t)?t:e.findLast(o,e=>e instanceof cc.Component||cc.Node.isNode(e)),d,a,c)}function a(e){n.call(this,e)}cc.js.extend(a,n),a.prototype.report=function(){r.walk(this.root,(e,s,r,i)=>{this.missingObjects.has(r)&&o(r,e,i,this.root)})},a.prototype.reportByOwner=function(){var e;this.root instanceof cc.Asset&&(e=Editor.assetdb.remote.uuidToUrl(this.root._uuid)),r.walkProperties(this.root,(s,r,i,t)=>{var n=this.missingOwners.get(s);if(n&&r in n){var a=n[r];o(i,s,t,this.root,e,a)}},{dontSkipNull:!0})};var c={reporter:new a,classFinder:function(e,s,r,i){var n=t(e);return n||(e&&(c.hasMissingClass=!0,c.reporter.stashByOwner(r,i,e)),null)},hasMissingClass:!1,reportMissingClass:function(e){c.hasMissingClass&&(c.reporter.root=e,c.reporter.reportByOwner(),c.hasMissingClass=!1)},reset(){c.reporter.reset()}};c.classFinder.onDereferenced=function(e,s,r,i){var t=c.reporter.removeStashedByOwner(e,s);t&&c.reporter.stashByOwner(r,i,t)},module.exports={MissingClass:c,MissingClassReporter:a};