"use strict";let e=require("./controller-shape");const t=require("../../../utils/external"),r=t.NodeUtils,n=require("./controller-shape-collider"),{gfx:o,create3DNode:c,addMeshToNode:i,setMeshColor:l,setNodeOpacity:u}=require("../../../utils/engine"),s=require("../../../utils"),a=t.EditorMath,d=cc.Vec3;let f={};f.YELLOW=new cc.Color(255,255,0),f.arrow=function(t,r,u,s){let a=c("arrow"),d=c("ArrowBody");d.parent=a,i(d,e.lineWithBoundingBox(u),{alpha:200,noDepthTestForLines:!0}),l(d,s),d.eulerAngles=cc.v3(0,0,90);let f=d.addComponent(n);f.isDetectMesh=!1;let D=c("ArrowHead");return D.parent=a,i(D,e.cone(r,t),{cullMode:o.CULL_BACK}),l(D,s),D.setPosition(cc.v3(0,u+t/2,0)),(f=D.addComponent(n)).isDetectMesh=!1,a},f.quad=function(t,r,n=cc.Color.RED,o={}){let u=c("quad");return i(u,e.quad(t,r),o),l(u,n),u},f.borderPlane=function(t,r,o,s){let a=t/2,d=r/2,f=c("borderPlane"),D=c("Plane");function p(t,r,n){let o=c("border");return i(o,e.line(t,r),{alpha:200,noDepthTestForLines:!0}),l(o,n),o.parent=f,o}return i(D,e.quad(t,r)),l(D,o),u(D,s),D.parent=f,D.addComponent(n).isDetectMesh=!1,p(cc.v3(0,r/2,0),cc.v3(a,r/2,0),o),p(cc.v3(a,d,0),cc.v3(a,0,0),o),f},f.circle=function(t,r,n,o){let u=c("circle");return i(u,e.circle(t,r,n)),l(u,o),u},f.torus=function(t,r,u,s){let a=c("torus");i(a,e.torus(t,r,u),{cullMode:o.CULL_BACK}),l(a,s);let d=a.addComponent(n);return d.isDetectMesh=!0,d.isRender=!1,a},f.cube=function(t,r,u,s){let a=c("cube");return i(a,e.cube(t,r,u),{cullMode:o.CULL_BACK}),l(a,s),a.addComponent(n).isDetectMesh=!1,a},f.scaleSlider=function(t,r,o){let u=c("scaleSlider"),s=f.cube(t,t,t,o);s.name="ScaleSliderHead",s.parent=u,s.setPosition(0,r+t/2,0);let a=c("ScaleSliderBody");return i(a,e.lineWithBoundingBox(r),{noDepthTestForLines:!0}),l(a,o),a.parent=u,a.eulerAngles=cc.v3(0,0,90),a.addComponent(n).isDetectMesh=!1,u},f.getCameraDistanceFactor=function(e,t){let n=r.getWorldPosition3D(t);return d.distance(e,n)},f.lineTo=function(t,r,n=cc.Color.RED,o){let u=c("line");return i(u,e.line(t,r),o),l(u,n),u},f.disc=function(t,r,n,o=cc.Color.RED){let u=c("disc");return i(u,e.disc(t,r,n)),l(u,o),u},f.sector=function(t,r,n,o,u,s=cc.Color.RED,a){let d=c("sector");return i(d,e.sector(t,r,n,o,u,60),a),l(d,s),d},f.arc=function(t,r,n,o,u,s=cc.Color.RED,a){let d=c("arc");return i(d,e.arc(t,r,n,o,u),a),l(d,s),d},f.arcDirectionLine=function(t,r,n,o,u,s,a,d=cc.Color.RED){let f=c("arcDirLine");return i(f,e.arcDirectionLine(t,r,n,o,u,s,a)),l(f,d),f},f.lines=function(t,r,n=cc.Color.RED){let o=c("lines");return i(o,e.lines(t,r)),l(o,n),o},f.wireframeBox=function(t,r,n){let o=c("wireframeBox");return i(o,e.wireframeBox(t,r)),l(o,n),o},f.frustum=function(t,r,n,o,u){let s=c("frustumNode");return i(s,e.frustum(t,r,n,o)),l(s,u),s},f.angle=function(e,t){let r=Math.sqrt(s.getSqrMagnitude(e)*s.getSqrMagnitude(t));if(r<a.EPSILON)return 0;let n=a.clamp(d.dot(e,t)/r,-1,1);return Math.acos(n)*a.R2D},module.exports=f;