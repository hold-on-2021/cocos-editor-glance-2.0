"use strict";const t=require("fs"),e=require("path"),s=require("../utils/cache"),i=require("../utils/display");exports.template=t.readFileSync(e.join(__dirname,"../template/highlight.html"),"utf-8"),exports.props=["y"],exports.data=function(){return{show:!1,node:null,name:"",slength:0,state:0,style:{top:0,left:0,width:0,height:0},cstyle:{top:0,height:0}}},exports.watch={y(t){this.show=-999!==t;let e=i.point(t);if(!e||!e.node)return!1;let s=e.y%20;this.state=s<=5?1:s<=10?2:3,this.node=e.node},node(t){let e=s.queryNode(t.parent),h=!1;this.name="",e?this.name=e.name:(h=!0,e=t);let l=i.info(e.id);this.style.top=20*e.showIndex,this.style.left=15*e.level,this.style.width=this.$el.parentNode.scrollWidth-this.style.left-4,this.style.height=20*l.length;let n=i.info(t.id);this.cstyle.height=20*n.length-2,this.cstyle.top=h?0:20*n.slength}},exports.methods={updateLineStyle:t=>`transform: translateY(${20*t}px);`};