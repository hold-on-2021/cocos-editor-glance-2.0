const e=require("electron"),n=require("fs-extra"),t=(require("path"),require("util"),Editor.require("scene://edit-mode")),i=Editor.require("packages://scene/panel/tools/camera"),o=Editor.require("scene://utils/scene"),r=Editor.require("scene://lib/sandbox"),s=Editor.require("scene://utils/prefab"),a=Editor.require("scene://utils/animation");function c(e){let n=Editor.assets[e];return n&&n.prototype.createNode}Editor.require("packages://scene/panel/settings/rendering-setting"),Editor.require("packages://scene/panel/scene-view");let l={template:n.readFileSync(Editor.url("packages://scene/panel/scene.html"),"utf8"),style:n.readFileSync(Editor.url("packages://scene/panel/scene.css"),"utf8"),$:{dropArea:"#dropArea",loader:"#loader",border:"#border"},messages:Editor.require("packages://scene/panel/messages"),ready(){this._vm=function(e){return new window.Vue({el:e,data:{selection:[],align:!1,distribute:!1},watch:{selection:"_selectionChanged"},methods:{_T:e=>Editor.T(e),_selectionChanged(){this.align=this.selection.length>1,this.distribute=this.selection.length>2},_onZoomUp(){i.zoomUp()},_onZoomDown(){i.zoomDown()},_onZoomReset(){i.zoomReset()},_onAlignTop(){_Scene.alignSelection("top")},_onAlignVCenter(){_Scene.alignSelection("v-center")},_onAlignBottom(){_Scene.alignSelection("bottom")},_onAlignLeft(){_Scene.alignSelection("left")},_onAlignHCenter(){_Scene.alignSelection("h-center")},_onAlignRight(){_Scene.alignSelection("right")},_onDistributeTop(){_Scene.distributeSelection("top")},_onDistributeVCenter(){_Scene.distributeSelection("v-center")},_onDistributeBottom(){_Scene.distributeSelection("bottom")},_onDistributeLeft(){_Scene.distributeSelection("left")},_onDistributeHCenter(){_Scene.distributeSelection("h-center")},_onDistributeRight(){_Scene.distributeSelection("right")}}})}(this.shadowRoot),this._viewReady=!1,this._ipcList=[],this._copyingIds=null,this._pastingId="",this._ensureClose=!1,console.time("scene:reloading"),Editor.Ipc.sendToAll("scene:reloading"),this.multi=!0,this.$dropArea.setAttribute("droppable","asset,file,cloud-function"),_Scene.init(),this.$loader.hidden=!0,this.$border.insertBefore(_Scene.view,this.$loader),_Scene.view.init(),e.ipcRenderer.on("editor:panel-undock",e=>{"scene"===e&&_Scene.EngineEvents.unregister()})},run(e){if(!e||!e.uuid)return;this.confirmCloseScene(()=>{this._loadScene(e.uuid)})},close(){if(!this._ensureClose){let n=e.ipcRenderer.sendSync("app:is-main-window-attemp-to-close");this.confirmCloseScene(()=>{this._clearSelection(),this._ensureClose=!0;var e=Editor.remote.Panel.findWindow("scene");n?e.nativeWin.close():e.nativeWin.reload()})}return!!this._ensureClose},confirmCloseScene(e){s.confirmEditingPrefabSynced(),t.close(e)},_clearSelection:function(){Editor.Selection.clear("node"),_Scene.unselect(this._vm.selection),this._vm.selection=[]},_onDropAreaEnter(e){e.stopPropagation()},_onDropAreaLeave(e){e.stopPropagation()},async _onDropAreaAccept(e){e.stopPropagation();let n=e.detail.dragOptions.unlinkPrefab,t=await Promise.all(e.detail.dragItems.map(async n=>"cloud-function"===e.detail.dragType?new Promise((e,t)=>{Editor.Ipc.sendToPackage("node-library","import-cloud-component",n.path,(n,i)=>{if(n)return t(n);e(i)})}):n.id));t=t.filter(Boolean);let i=e.detail.offsetX,r=e.detail.offsetY;o.createNodesAt(t,i,r,{unlinkPrefab:n})},_onDropAreaMove(e){if(a.STATE.RECORD)return Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer,"none"),void 0;if("cloud-function"===e.detail.dragType)return Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer,"copy"),void 0;if("asset"!==e.detail.dragType&&"file"!==e.detail.dragType)return Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer,"none"),void 0;let n="copy";for(let t of e.detail.dragItems){if("folder"===t.assetType||"skeleton-animation-clip"===t.assetType&&t.isSubAsset){n="none";break}if(!c(t.assetType)){if(!t.subAssetTypes||0===t.subAssetTypes.length){n="none";break}for(let e of t.subAssetTypes)if(!c(e)){n="none";break}}}Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer,n)},_onEngineReady(){_Scene.EngineEvents.register()},_onSceneViewReady(){this._loadSceneScripts(),this._viewReady=!0,this.$loader.hidden=!0,_Scene.Undo.clear(),Editor.Ipc.sendToAll("scene:ready"),console.timeEnd("scene:reloading")},_onSceneViewInitError(e){let n=e.error;Editor.failed(`Failed to init scene: ${n.stack}`),this.$loader.hidden=!0},_onPanelResize(){this._resizeDebounceID||(this._resizeDebounceID=setTimeout(()=>{this._resizeDebounceID=null,_Scene.view._resize()},10))},_onPanelCopy(){let e=Editor.Selection.curSelection("node");o.copyNodes(e)},_onPanelPaste(){let e=Editor.Selection.curActivate("node");o.pasteNodes(e)},_onPanelUnload(){Editor.Ipc.sendToAll("scene:panel-unload")},_loadScene(e){_Scene.isLoadingScene=!0,Editor.Ipc.sendToAll("scene:reloading"),this.$loader.hidden=!1,_Scene.loadSceneByUuid(e,e=>{if(_Scene.isLoadingScene=!1,e){let n=new Event("scene-view-init-error");return n.error=e,this.dispatchEvent(n),void 0}this.dispatchEvent(new Event("scene-view-ready"))})},_newScene(){this.$loader.hidden=!1,Editor.Ipc.sendToAll("scene:reloading"),_Scene.newScene(()=>{this.dispatchEvent(new Event("scene-view-ready")),_Scene._applyCanvasPreferences()})},_loadSceneScript:function(e,t){let i,o=Editor.url(t);if(!n.existsSync(o))return Editor.error(`Package [${e}] scene script [${t}] not exists.`),void 0;try{i=require(o)}catch(e){return Editor.error(e),void 0}this._sceneScripts[e]={path:o,messages:[]};for(let n in i){let t=i[n];if("function"!=typeof t)return Editor.warn(`[${n}] in package [${e}] is not a function.`),void 0;let o=`${e}:${n}`;this.messages[o]=t.bind(i),this._sceneScripts[e].messages.push(o)}},_unloadSceneScript:function(e){let n=this._sceneScripts[e].messages;for(let e=0;e<n.length;e++){let t=n[e];delete this.messages[t]}delete r.getElectronRequire().cache[this._sceneScripts[e].path],delete this._sceneScripts[e]},_loadSceneScripts:function(){this._sceneScripts={};for(let e in Editor.sceneScripts){let n=Editor.sceneScripts[e];this._loadSceneScript(e,n)}}};Object.assign(l,{listeners:{"drop-area-enter":l._onDropAreaEnter,"drop-area-leave":l._onDropAreaLeave,"drop-area-accept":l._onDropAreaAccept,"drop-area-move":l._onDropAreaMove,"engine-ready":l._onEngineReady,"scene-view-ready":l._onSceneViewReady,"scene-view-init-error":l._onSceneViewInitError,"panel-show":l._onPanelResize,"panel-resize":l._onPanelResize,"panel-copy":l._onPanelCopy,"panel-paste":l._onPanelPaste,"panel-unload":l._onPanelUnload}}),Editor.Panel.extend(l);