"use strict";const e=require("../lib/tasks"),n=require("./node"),t=require("./animation"),o=require("./prefab"),{Vec3:c,Quat:r,Mat4:i}=cc.math;let d=null,a=null,s=function(e){return Editor.Utils.arrayCmpFilter(e,(e,n)=>e===n?0:n.isChildOf(e)?1:e.isChildOf(n)?-1:0)},l=function(e,t,o,c,r){let i;t&&(i=cc.engine.getInstanceById(t)),i||(i=cc.director.getScene()),Editor.Selection.unselect("node",Editor.Selection.curSelection("node"),!1);let d=e.map(e=>{return new Promise(function(t,r){n.createNodeFromAsset(e,(e,n)=>{if(e)return r(e);let d;if(n){if(d=n.uuid,i&&(n.parent=i),c){n.parent=null;let e=cc.engine.getInstanceById(c).getSiblingIndex();n.parent=i,n.setSiblingIndex(e)}_Scene.Undo.recordCreateNode(d)}d&&Editor.Selection.select("node",d,!1,!1),cc.engine.repaintInEditMode(),o&&o.unlinkPrefab&&(n&&n.parent&&n.parent._prefab||_Scene.breakPrefabInstance([d])),t(n)})}).catch(n=>{Editor.failed(`Failed to drop asset ${Editor.remote.assetdb.uuidToUrl(e)}, message: ${n.stack}`)})});Promise.all(d).then(e=>{_Scene.Undo.commit(),Editor.Selection.confirm(),r&&r(null,e)}).catch(e=>{_Scene.Undo.commit(),Editor.Selection.cancel(),r&&r(e)})},u=function(e,n,t){if(n._disallowMultiple){let o=e.getComponent(n._disallowMultiple);if(o){let e,c;return e=o.constructor===n?Editor.T("MESSAGE.scene.contain_same_component"):Editor.T("MESSAGE.scene.contain_derive_component",{className:cc.js.getClassName(o)}),c=t?"MESSAGE.scene.cant_add_required_component":"MESSAGE.scene.cant_add_component",Editor.Dialog.messageBox({type:"warning",buttons:["OK"],title:Editor.T("MESSAGE.warning"),message:Editor.T(c,{className:cc.js.getClassName(n)}),detail:e,noLink:!0}),!1}}let o=n._requireComponent;return!(o&&!e.getComponent(o))||u(e,o,!0)},m=function(e,n){let t=Editor.Utils.UuidUtils.isUuid(n),o=cc.js._getClassById(n);if(!o)return t?(Editor.error(`Can not find cc.Component in the script ${n}.`),!1):(Editor.error(`Failed to get component ${n}`),!1);let c=cc.engine.getInstanceById(e);return c?u(c,o):(Editor.error(`Can not find node ${e}`),!1)},p=function(e,n){let o=cc.engine.getInstanceById(n);if(!o)return Editor.error(`Can not find component ${n}`),!1;if(t.STATE.RECORD&&o instanceof cc.Animation)return Editor.Dialog.messageBox({type:"warning",buttons:[Editor.T("MESSAGE.ok")],title:Editor.T("MESSAGE.warning"),message:Editor.T("MESSAGE.scene.cant_remove_component",{className:cc.js.getClassName(o)}),detail:Editor.T("MESSAGE.scene.cant_remove_component_detail",{className:Editor.T("MAIN_MENU.panel.timeline")}),noLink:!0}),!1;let c=cc.engine.getInstanceById(e);if(!c)return Editor.error(`Can not find node ${e}`),void 0;let r=c._getDependComponent(o);return!r||(Editor.Dialog.messageBox({type:"warning",buttons:[Editor.T("MESSAGE.ok")],title:Editor.T("MESSAGE.warning"),message:Editor.T("MESSAGE.scene.cant_remove_component",{className:cc.js.getClassName(o)}),detail:Editor.T("MESSAGE.scene.cant_remove_component_detail",{className:cc.js.getClassName(r)}),noLink:!0}),!1)},g=function(e){var n=e.__asyncStates;for(var t in n){if("start"===n[t].state)return!0}return!1};module.exports={createDefaultScene:function(){let e=new cc.Scene,n=new cc.Node("Canvas");n.parent=e,n.addComponent(cc.Canvas);let t=n.addComponent(cc.Widget);return t.isAlignTop=!0,t.isAlignBottom=!0,t.isAlignLeft=!0,t.isAlignRight=!0,e},loadScene:function(e,n){cc.director.runSceneImmediate(e),Editor.Ipc.sendToMain("scene:set-current-scene",null,function(e,...t){n&&n(e,...t)})},loadSceneByUuid:function(n,t){e.push({name:"load-scene-by-uuid",run(e){cc.director.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING),cc.director._loadSceneByUuid(n,t=>{if(t)return e&&e(t),void 0;Editor.Ipc.sendToMain("scene:set-current-scene",n,n=>{e&&e(n)})})}},t)},isAnyChildClassOf:function(e,...n){for(var t=0;t<n.length;++t)if(cc.js.isChildClassOf(e,n[t]))return!0;return!1},copyNodes:function(e){let n=e.map(e=>cc.engine.getInstanceById(e)).filter(e=>!!e);n=function(e){return Editor.Utils.arrayCmpFilter(e,(e,n)=>e===n?0:n.isChildOf(e)?1:e.isChildOf(n)?-1:0)}(n).filter(e=>!!e);let t={sceneId:cc.director.getScene().uuid,nodes:{}};n.forEach(e=>{t.nodes[e.uuid]=cc.instantiate(e)}),d=t},pasteNodes:function(e){if(!d||t.STATE.RECORD)return;let n;e&&(n=cc.engine.getInstanceById(e)),n||(n=cc.director.getScene());let o=[];for(let e in d.nodes){let t=cc.instantiate(d.nodes[e]);t.parent=n,o.push(t.uuid),_Scene.Undo.recordCreateNode(t.uuid)}_Scene.Undo.commit(),Editor.Selection.select("node",o)},duplicateNodes:function(e){if(t.STATE.RECORD)return;let n=e.map(e=>cc.engine.getInstanceById(e));n=n.filter(e=>!!e);let o=[];(n=s(n)).forEach(e=>{let n=cc.instantiate(e);n.parent=e.parent;let t=e.getSiblingIndex();n.name=e.name&&e.name.endsWith(" copy")?e.name:`${e.name} copy`,n.setSiblingIndex(t+1),o.push(n.uuid),_Scene.Undo.recordCreateNode(n.uuid)}),_Scene.Undo.commit(),Editor.Selection.select("node",o)},moveNodes:function(e,n,t){let o,c=function(e){return e._parent?e._parent._children.indexOf(e):-1};o=n?cc.engine.getInstanceById(n):cc.director.getScene();let r=t?cc.engine.getInstanceById(t):null;o&&(e.forEach(e=>{let n=cc.engine.getInstanceById(e);if(n&&!o.isChildOf(n))if(_Scene.Undo.recordMoveNode(e),n.parent!==o){let e=n.getWorldPosition(cc.v3()),t=n.worldEulerAngles,i=n.getWorldScale(cc.v3());n.parent=o,n.setWorldPosition(e),n.worldEulerAngles=t,n.setWorldScale(i),_Scene.adjustNodePosition(n,5),_Scene.adjustNodeScale(n,5),n.parent=null;let d=r?c(r):-1;n.parent=o,n.setSiblingIndex(d)}else{let e=c(n),t=r?c(r):-1;e<t&&(t-=1),n.setSiblingIndex(t)}}),_Scene.Undo.commit())},hasCopiedComponent:function(){return!!a},copyComponent:function(e){let n=cc.engine.getInstanceById(e);n&&(a=cc.instantiate(n,!0))},pasteComponent:function(e,n){let t=cc.engine.getInstanceById(e);if(t&&a){let o=cc.instantiate(a,!0);t._addComponentAt(o,n),cc.director._nodeActivator.resetComp(o),_Scene.Undo.recordAddComponent(t.uuid,o,n,"Paste Component"),_Scene.Undo.commit(),Editor.Ipc.sendToAll("scene:node-component-pasted",{node:e,component:cc.js.getClassName(o)})}},createNodes:l,createNodesAt:function(e,n,t,o){l(e,null,o,null,(e,o)=>{if(e)return Editor.error(e),void 0;o.forEach(e=>{e&&(e.setPosition(_Scene.view.pixelToScene(cc.v2(n,t))),_Scene.adjustNodePosition(e))})})},createNodeByClassID:function(e,t,o,c){let r;o&&(r=cc.engine.getInstanceById(o),c&&(r=r.parent)),r||(r=cc.director.getScene());n.createNodeFromClass(t,(n,t)=>{if(n)return Editor.error(n);t.name=e,t.parent=r,cc.engine.repaintInEditMode(),Editor.Selection.select("node",t.uuid,!0,!0),_Scene.Undo.recordCreateNode(t.uuid),_Scene.Undo.commit()})},createNodeByPrefab:function(e,t,c,r){let i;n.createNodeFromAsset(t,(n,t)=>{if(n)return Editor.error(n),void 0;o.unlinkPrefab(t),t.name=e,c&&(i=cc.engine.getInstanceById(c),r&&(i=i.parent)),i||(i=cc.director.getScene());var d=t.getComponent(cc.Canvas);d&&_Scene._applyCanvasPreferences(d),t.parent=i,cc.engine.repaintInEditMode(),Editor.Selection.select("node",t.uuid,!0,!0),_Scene.Undo.recordCreateNode(t.uuid),_Scene.Undo.commit()})},deleteNodes:function(e){if(t.STATE.RECORD)return;let o=[];for(let n=0;n<e.length;++n){let t=cc.engine.getInstanceById(e[n]);t&&o.push(t)}s(o).forEach(e=>{n._destroyForUndo(e,()=>{_Scene.Undo.recordDeleteNode(e.uuid)})}),_Scene.Undo.commit(),Editor.Selection.unselect("node",e,!0)},checkAddComponentID:m,addComponent:function(e,o){if(!m(e,o))return;let c=cc.engine.getInstanceById(e),r=cc.js._getClassById(o),i=c.addComponent(r);i&&(cc.director._nodeActivator.resetComp(i),_Scene.Undo.recordAddComponent(e,i,c._components.indexOf(i)),_Scene.Undo.commit(),t.onAddComponent(c,i)),n.addComponentHandle(c,i)},checkRemoveComponentID:p,removeComponent:function(e,o){if(!p(e,o))return;let c=cc.engine.getInstanceById(o),r=cc.engine.getInstanceById(e);n._destroyForUndo(c,()=>{_Scene.Undo.recordRemoveComponent(e,c,r._components.indexOf(c))}),_Scene.Undo.commit(),t.onRemoveComponent(r,c)},createProperty:function(e,n,t){const o=Editor.require("unpack://engine-dev/cocos2d/core/platform/CCClass").getDefault;let c=cc.engine.getInstanceById(e);if(c)try{let r,i=cc.Class.attr(c.constructor,n);if(i&&Array.isArray(o(i.default)))r=[];else{let e=cc.js._getClassById(t);if(e)try{r=new e}catch(t){return Editor.error(`Can not new property at ${n} for type ${cc.js.getClassName(e)}.\n${t.stack}`),void 0}}r&&(_Scene.Undo.recordObject(e),Editor.setDeepPropertyByPath(c,n,r,t),_Scene.Undo.commit(),cc.engine.repaintInEditMode())}catch(e){Editor.warn(`Failed to new property ${c.name} at ${n}, ${e.message}`)}},resetProperty:function(e,n,t){let o=cc.engine.getInstanceById(e);if(o){_Scene.Undo.recordObject(e);try{Editor.resetPropertyByPath(o,n,t)}catch(e){Editor.warn(`Failed to reset property ${o.name} at ${n}, ${e.message}`)}_Scene.Undo.commit(),cc.engine.repaintInEditMode()}},setProperty:function(e){let n=cc.engine.getInstanceById(e.id);if(!n)return!1;if(t.isRecordCurrentClip(n,e))return!1;try{let o=n;if(o instanceof cc.Component&&(o=n.node),_Scene.Undo.recordNode(o.uuid),Editor.setPropertyByPath(n,e),cc.engine.repaintInEditMode(),g(n)){let e=setInterval(()=>{g(n)||(clearInterval(e),t.recordNodeChanged([o],n))},100)}else t.recordNodeChanged([o],n);return!0}catch(t){return t instanceof Editor.setPropertyByPath.ProhibitedException||Editor.warn(`Failed to set property ${n.name} to ${e.value} at ${e.path}, ${t.stack}`),!1}},copyNodeDataToNodes:function(e,n){if(e&&n&&n.length>0){let t=(n=n.map(e=>cc.engine.getInstanceById(e)))[0],o=cc.mat4();t.getWorldRT(o),i.invert(o,o);let d=t.getWorldRotation(cc.quat());r.invert(d,d);let a=e.getWorldPosition(cc.v3()),s=e.getWorldRotation(cc.quat()),l=cc.mat4();if(e.getWorldRT(l),_Scene.Undo.recordNode(t.uuid),t.setWorldPosition(a),t.setWorldRotation(s),n.length>1)for(let e=1;e<n.length;e++){let t=n[e],i=t.getWorldPosition(cc.v3()),a=t.getWorldRotation(cc.quat());_Scene.Undo.recordNode(t.uuid),c.transformMat4(i,i,o),r.mul(a,d,a),c.transformMat4(i,i,l),t.setWorldPosition(i),r.mul(a,s,a),t.setWorldRotation(a)}_Scene.Undo.commit()}}};