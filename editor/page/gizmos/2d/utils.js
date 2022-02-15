"use strict";const e=Editor.require("scene://utils/node");var n={};module.exports=n,n.addMoveHandles=function(e,n,t){var o,l;2===arguments.length&&(t=n,n={});var r=n.cursor||"default",u=n.ignoreWhenHoverOther||!1,i=function(n){if(n.stopPropagation(),"undefined"==typeof _Scene||cc.director.getScene()){var r=n.clientX-o,u=n.clientY-l;t.update&&t.update.call(e,r,u,n)}}.bind(e),d=function(n){document.removeEventListener("mousemove",i),document.removeEventListener("mouseup",d),Editor.UI.removeDragGhost(),window.getSelection().removeAllRanges(),t.end&&t.end.call(e,n),n.stopPropagation()}.bind(e);e.on("mousedown",function(n){if(u){var c=Editor.Selection.curSelection("node"),s=Editor.Selection.hovering("node");if(-1===c.indexOf(s))return}1===n.which&&(o=n.clientX,l=n.clientY,Editor.UI.addDragGhost(r),document.addEventListener("mousemove",i),document.addEventListener("mouseup",d),t.start&&t.start.call(e,n.offsetX,n.offsetY,n)),n.stopPropagation()})},n.snapPixel=function(e){return Math.floor(e)+.5},n.snapPixelWihVec2=function(e){return e.x=n.snapPixel(e.x),e.y=n.snapPixel(e.y),e},n.getCenter=function(e){let t=n.getCenterWorldPos(e);return cc.director.getScene().convertToNodeSpace(t)},n.getCenterWorldPos=function(n){for(var t=null,o=null,l=null,r=null,u=0;u<n.length;++u){for(var i,d=n[u],c=e.getWorldOrientedBounds(d),s=0;s<c.length;++s)i=c[s],(null===t||i.x<t)&&(t=i.x),(null===l||i.x>l)&&(l=i.x),(null===o||i.y<o)&&(o=i.y),(null===r||i.y>r)&&(r=i.y);i=e.getWorldPosition3D(d),(!t||i.x<t)&&(t=i.x),(!l||i.x>l)&&(l=i.x),(!o||i.y<o)&&(o=i.y),(!r||i.y>r)&&(r=i.y)}var a=.5*(t+l),g=.5*(o+r);return cc.v2(a,g)},n.getCenterWorldPos3D=function(e){return n.getWorldBounds3D(e).center},n.getWorldBounds3D=function(n){for(var t=null,o=null,l=null,r=null,u=null,i=null,d=0;d<n.length;++d){for(var c,s=n[d],a=e.getWorldOrientedBounds(s),g=0;g<a.length;++g)c=a[g],(null===t||c.x<t)&&(t=c.x),(null===r||c.x>r)&&(r=c.x),(null===o||c.y<o)&&(o=c.y),(null===u||c.y>u)&&(u=c.y),(null===l||c.z<l)&&(l=c.z),(null===i||c.z>i)&&(i=c.z);c=e.getWorldPosition3D(s),(null===t||c.x<t)&&(t=c.x),(null===r||c.x>r)&&(r=c.x),(null===o||c.y<o)&&(o=c.y),(null===u||c.y>u)&&(u=c.y),(null===l||c.z<l)&&(l=c.z),(null===i||c.z>i)&&(i=c.z)}var v=.5*(t+r),f=.5*(o+u),x=.5*(l+i);return new cc.geomUtils.Aabb(v,f,x,r-t,u-o,i-l)},n.getRecursiveNodes=function(e,t){for(let o=0;o<e.length;o++)e[o].active&&(t.push(e[o]),n.getRecursiveNodes(e[o].children,t))},n.getRecursiveWorldBounds3D=function(e){let t=[];return n.getRecursiveNodes(e,t),n.getWorldBounds3D(t)};