"use strict";const t=Editor.require("scene://utils/node");module.exports=class extends Editor.Gizmo{hide(){Editor.Gizmo.prototype.hide.call(this),this.target.editing=!1}rectHitTest(i,e){if(!this._root)return!1;let r=this._root.tbox(),o=t.getWorldPosition(this.node);return!!e&&i.containsRect(cc.rect(o.x-r.width/2,o.y-r.height/2,r.width,r.height))}createMoveCallbacks(t){let i=Editor.Gizmo.prototype.createMoveCallbacks.call(this,t),e=(this._root,this);return{start:function(){e.target.editing&&i.start.apply(e,arguments)},update:function(){e.target.editing&&i.update.apply(e,arguments)},end:function(){e.target.editing&&i.end.apply(e,arguments)}}}dirty(){var t=Editor.Gizmo.prototype.dirty.call(this);return this.target.editing?this._targetEditing||(this._targetEditing=!0,this.enterEditing(),t=!0):this._targetEditing&&(this._targetEditing=!1,this.leaveEditing(),t=!0),t}};