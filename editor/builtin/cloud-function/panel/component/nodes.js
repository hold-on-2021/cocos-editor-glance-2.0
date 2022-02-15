"use strict";const e=require("fs"),t=require("path"),i=(require("fire-url"),require("../utils/cache")),s=require("../utils/operation"),o=require("../utils/event"),l=(require("../utils/display"),require("../utils/communication")),r=(require("../utils/utils"),require("../../selection"));exports.template=e.readFileSync(t.join(__dirname,"../template/nodes.html"),"utf-8"),exports.props=["length"],exports.components={node:require("./node"),highlight:require("./highlight")},exports.created=function(){o.on("nodes_focus",e=>{this.focused=e,e&&this.$el&&this.$el.parentElement.focus()})},exports.data=function(){return{focused:!1,start:0,nodes:i.queryShowNodes(),list:[],allNodes:i.queryNodes(),uh:{height:0},y:-999,highlight:{node:null,state:0}}},exports.watch={start(){this.reset()},length(){this.reset()},nodes(){this.reset()}},exports.methods={reset(){this._updateLock||(this._updateLock=!0,requestAnimationFrame(()=>{this._updateLock=!1,this.updateShowList()}))},updateShowList(){let e=i.queryShowNodes();this.uh.height=0,this.list.splice(0);let t=this.start+Math.ceil(this.length);t=t>e.length?e.length:t;for(let i=this.start;i<t;i++)this.list.push(e[i]);this.uh.height=e.length*i.lineHeight+4},onMouseDown(e){if(2===e.button)return r.setContext("cloud-function",null),l.popup("context",{x:e.clientX,y:e.clientY}),void 0;r.select("cloud-function")},onScroll(e){let t=e.target.scrollTop;this.start=t/i.lineHeight|0},onFocus(){this.focused=!0},onBlur(){this.focused=!1},scrollIfNeeded(e){let t=i.queryNode(e);if(!t)return;let s=i.queryShowNodes().indexOf(t);if(-1===s)return;let o=s*i.lineHeight,l=this.$el.scrollTop+this.$el.clientHeight-i.lineHeight-2;o<this.$el.scrollTop-2?this.$el.scrollTop-=this.$el.scrollTop-2-o:o>=l&&(this.$el.scrollTop+=o-l)},scrollToItem(e){let t=i.queryNode(e);if(!t)return;s.recParentNodes(e,!1);let o=i.queryShowNodes();setTimeout(()=>{let l=o.indexOf(t);l>-1&&(this.$el.scrollTop=i.lineHeight*l-i.lineHeight*this.length/2,s.hint(e))},50)}},exports.directives={init(e,t){requestAnimationFrame(()=>{this.vm.reset()})}};