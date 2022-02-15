"use strict";const e=require("fs"),t=require("path"),i=require("fire-url"),o=require("globby"),s=require("../utils/cache"),r=require("../utils/operation"),l=require("../utils/event"),n=require("../utils/display"),a=require("../utils/communication"),d=require("../utils/utils");exports.template=e.readFileSync(t.join(__dirname,"../template/nodes.html"),"utf-8"),exports.props=["length"],exports.components={node:require("./node"),highlight:require("./highlight")},exports.created=function(){l.on("nodes_focus",e=>{this.focused=e,e&&this.$el&&this.$el.parentElement.focus()})},exports.data=function(){return{focused:!1,start:0,nodes:s.queryShowNodes(),list:[],allNodes:s.queryNodes(),uh:{height:0},y:-999,highlight:{node:null,state:0}}},exports.watch={start(){this.reset()},length(){this.reset()},nodes(){this.reset()}},exports.methods={reset(){this._updateLock||(this._updateLock=!0,requestAnimationFrame(()=>{this._updateLock=!1,this.updateShowList()}))},updateShowList(){let e=s.queryShowNodes();this.uh.height=0,this.list.length=0;let t=this.start+Math.ceil(this.length);t=t>e.length?e.length:t;for(let i=this.start;i<t;i++)this.list.push(e[i]);this.uh.height=e.length*s.lineHeight+4},onMouseDown(e){if(2===e.button)return Editor.Selection.setContext("asset",null),a.popup("context",{x:e.clientX,y:e.clientY}),void 0;Editor.Selection.select("asset")},onScroll(e){let t=e.target.scrollTop;this.start=t/s.lineHeight|0},onFocus(){this.focused=!0},onBlur(){this.focused=!1},scrollIfNeeded(e){let t=s.queryNode(e);if(!t)return;let i=s.queryShowNodes().indexOf(t);if(-1===i)return;let o=i*s.lineHeight,r=this.$el.scrollTop+this.$el.clientHeight-s.lineHeight-2;o<this.$el.scrollTop-2?this.$el.scrollTop-=this.$el.scrollTop-2-o:o>=r&&(this.$el.scrollTop+=o-r)},scrollToItem(e){let t=s.queryNode(e);if(!t)return;r.recParentNodes(e,!1);let i=s.queryShowNodes();setTimeout(()=>{let o=i.indexOf(t);o>-1&&(this.$el.scrollTop=s.lineHeight*o-s.lineHeight*this.length/2,r.hint(e))},50)},onDragStart:d.onDragStart,onDragOver:d.onDragOver,onDragEnd:d.onDragEnd,onDropAreaMove(e){e.preventDefault(),e.stopPropagation(),e.target;let t=this.$el.getBoundingClientRect();this.y=this.$el.scrollTop+e.detail.clientY-t.top-5;let i=e.detail.dragType,o="none";"asset"===i||"file"===i||"cloud-function"===i?o="copy":"node"===i&&(o="move"),Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer,o)},onDropAreaAccept(e){e.stopPropagation(),Editor.Selection.cancel();let l=n.point(this.y);if(!l.node)return;let a=e.detail.dragType,d=e.detail.dragItems;if("cloud-function"===a)return d.forEach(e=>{Editor.Ipc.sendToPackage("node-library","import-cloud-component",e.path)}),void 0;if("file"===a?d=(d=Editor.UI.DragDrop.filterFiles(d)).map(e=>e.path):"asset"!==a&&"node"!==a||(d=d.map(e=>e.id)),0===d.length)return;if(l.node&&-1!==d.indexOf(l.node.id))return;this.y=-999,1,l.node&&console.log(`插入目标节点：${l.node.name} - ${l.node.id}`);let h=r.getRealUrl(l.node.id),u=!0;if("folder"!==l.node.assetType&&"mount"!==l.node.assetType&&(h=r.getPath(l.node.id),u=!1),"file"===e.detail.dragType){let e;if(u)e=l.node.children.map(e=>e.name+e.extname);else{let t=s.queryNode(l.node.parent);if(!t)return;e=t.children.map(e=>e.name+e.extname)}let i=[];for(let o=0;o<d.length;o++){let s=t.basename(d[o]);e.indexOf(s)>=0&&i.push(d[o])}if(i.length>0)for(let e=0;e<i.length;e++){let o=i.length-e,s=t.basename(i[e]),r=null,l="";o>1?(r=[Editor.T("MESSAGE.assets.skip"),Editor.T("MESSAGE.assets.merge"),Editor.T("MESSAGE.assets.skip_all"),Editor.T("MESSAGE.assets.merge_all")],l=Editor.T("MESSAGE.assets.left_count",{leftCount:o})):r=[Editor.T("MESSAGE.assets.skip"),Editor.T("MESSAGE.assets.merge")];let n=Editor.Dialog.messageBox({type:"warning",buttons:r,title:Editor.T("MESSAGE.warning"),message:Editor.T("MESSAGE.assets.import_conflict",{fileName:s}),detail:l,noLink:!0,defaultId:0,cancelId:1});if(0===n){let t=d.indexOf(i[e]);t>=0&&d.splice(t,1)}else{if(2===n){for(let t=e;t<i.length;t++){let e=d.indexOf(i[t]);e>=0&&d.splice(e,1)}break}if(3===n)break}}d.length>0&&Editor.assetdb.import(d,h,!0)}else{e.detail.dragItems.map(e=>({uuid:e.id,assetType:e.assetType})).forEach((n,a)=>{let d=n.uuid,u=h;switch(e.detail.dragType){case"node":Editor.Ipc.sendToPanel("scene","scene:create-prefab",d,u);break;case"asset":if("auto-atlas"===n.assetType){if(o.sync(t.join(Editor.remote.assetdb.urlToFspath(u),"*.pac")).length>0)return Editor.Dialog.messageBox({type:"warning",title:" ",buttons:[Editor.T("MESSAGE.sure")],message:Editor.T("MESSAGE.assets.auto_atlas"),noLink:!0,defaultId:0}),void 0}if(s.queryNode(d).parent===l.node.parent&&"folder"!==l.node.assetType)return;let a=r.getRealUrl(d);u=i.join(u,i.basename(a)),Editor.assetdb.move(a,u,!0)}window.requestAnimationFrame(()=>{r.hint(d)})})}}},exports.directives={init(e,t){requestAnimationFrame(()=>{this.vm.reset()})}};