"use strict";let e=require("../../utils");cc.mat4();module.exports=class{constructor(e){this.hovering=!1,this.selecting=!1,this.editing=!1,this._isInited=!1,this._hidden=!0,this.target=e}get target(){return this._target}set target(e){let t=this.nodes;t&&t.length>0&&(this.unRegisterTransformEvent(this.nodes),this.unRegisterNodeEvents(this.nodes)),this._target=e,(t=this.nodes)&&t.length>0?(this.registerTransformEvent(this.nodes),this.registerNodeEvents(this.nodes),this.onTargetUpdate&&this.onTargetUpdate()):this.hide()}layer(){return"scene"}getGizmoRoot(){return this._rootNode||(this._rootNode=e.getGizmoRoot()),this._rootNode}recordChanges(){this._recorded||(e.recordChanges(this.nodes),this._recorded=!0)}commitChanges(){this._recorded=!1,e.commitChanges(this.nodes)}_checkLockStatus(){return this.node._objFlags&cc.Object.Flags.LockedInEditor}targetValid(){let e=this.target;return Array.isArray(e)&&(e=e[0]),e&&e.isValid}visible(){return!this._hidden}hide(){this._hidden||(this.onHide&&this.onHide(),this._hidden=!0)}show(){this._hidden&&(this._isInited||(this.init&&this.init(),this._isInited=!0),this.onShow&&this.onShow(),this._hidden=!1)}onNodeTransformChanged(){this.updateControllerTransform&&this.updateControllerTransform()}registerTransformEvent(e){if(this.onNodeTransformChanged)for(let t=0;t<e.length;t++)e[t].on("transform-changed",this.onNodeTransformChanged,this)}unRegisterTransformEvent(e){if(this.onNodeTransformChanged)for(let t=0;t<e.length;t++)e[t].off("transform-changed",this.onNodeTransformChanged,this)}registerNodeEvents(e){if(this.onNodeChanged)for(let t=0;t<e.length;t++)e[t].on("change",this.onNodeChanged,this)}unRegisterNodeEvents(e){if(this.onNodeChanged)for(let t=0;t<e.length;t++)e[t].off("change",this.onNodeChanged,this)}get node(){let e=this.target;return Array.isArray(e)&&(e=e[0]),cc.Node.isNode(e)?e:e instanceof cc.Component?e.node:null}get nodes(){let e=[],t=this.target;if(Array.isArray(t))for(let s=0;s<t.length;++s){let i=t[s];cc.Node.isNode(i)?e.push(i):i instanceof cc.Component&&e.push(i.node)}else cc.Node.isNode(t)?e.push(t):t instanceof cc.Component&&e.push(t.node);return e}get topNodes(){return this.target.filter(e=>{let t=e.parent;for(;t;){if(-1!==this.target.indexOf(t))return!1;t=t.parent}return!0})}get selecting(){return this._selecting}set selecting(e){this._selecting=e}get editing(){return this._editing}set editing(e){this._editing=e}get hovering(){return this._hovering}set hovering(e){this._hovering=e}};