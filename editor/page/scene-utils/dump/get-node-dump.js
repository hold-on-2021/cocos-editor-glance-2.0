var e=require("lodash");const t=require("../utils/node"),n=require("../utils/scene");var r=cc.js,a=cc.Object,o=cc.Object.Flags,i=Editor.require("unpack://engine-dev/cocos2d/core/platform/CCClass").getDefault;const c={number:"Float",string:"String",boolean:"Boolean",object:"Object"};function s(e){return"object"==typeof e&&(e=e.constructor),r._getClassId(e)}function l(e,t,n){var r,a=n.ctor;if(a){if(r=s(a),t.type=r,!e[r]){var o=cc.js.isChildClassOf(a,cc.RawAsset),l=cc.js.isChildClassOf(a,cc.Node);o||l?f(e,a,r):p(e,a,r)}}else n.type&&(t.type=""+n.type);if(n.readonly&&(t.readonly=n.readonly),"default"in n){if(t.default=i(n.default),n.saveUrlAsAsset&&""===t.default)t.default=null;else if(null!=t.default&&!t.type&&(r=c[typeof t.default]))if("Object"!==r||t.default.constructor===Object)t.type=r;else{var u=cc.js._getClassId(t.default.constructor);u&&(t.type=u)}}else n.hasSetter||(t.readonly=!0);"boolean"==typeof n.visible&&(t.visible=n.visible),n.enumList&&(t.enumList=JSON.parse(JSON.stringify(n.enumList))),n.hasOwnProperty("displayName")&&(t.displayName=Editor.i18n.format(n.displayName)),n.hasOwnProperty("multiline")&&(t.multiline=n.multiline),n.hasOwnProperty("min")&&(t.min=n.min),n.hasOwnProperty("max")&&(t.max=n.max),n.hasOwnProperty("step")&&(t.step=n.step),n.slide&&(t.slide=n.slide),n.nullable&&(t.nullable=n.nullable),n.tooltip&&(t.tooltip=Editor.i18n.format(n.tooltip)),n.hasOwnProperty("animatable")&&(t.animatable=n.animatable)}function u(e){return cc.Class.getInheritanceChain(e).map(e=>s(e)).filter(e=>e)}function p(e,t,r){var a;if("object"==typeof t){if(cc.Enum.isEnum(t))return cc.Enum.getList(t);a=t.constructor}else a=t;var o={};if(e[r]=o,a){o.name=cc.js.getClassName(a),o.name.startsWith("cc.")&&(o.name=o.name.slice(3));var i=u(a);i.length>0&&(o.extends=i);var c=a.__props__;if(c){for(var s={},p=0;p<c.length;p++){var f=c[p],d={},y=cc.Class.attr(t,f);y&&l(e,d,y),s[f]=d}n.isAnyChildClassOf(a,cc._BaseNode,cc.Component)&&(s._id={type:"String",visible:!1}),o.properties=s}}return o}function f(e,t,n){var r={},a=u(t);a.length>0&&(r.extends=a),e[n]=r}function d(e,t,n){var r=s(t);if(r){var a=e[r];if(a)return a.properties[n].type}return null}function y(e,t,n){if(!t)return{type:"Object",value:null};var r,o=t.constructor;if(t instanceof a){if(t instanceof cc.Asset){var i=t._uuid;return n!==(r=s(t))?(e[r]||p(e,o,r),{type:r,value:{uuid:i}}):{type:n,value:{uuid:i}}}if(cc.Node.isNode(t)||t instanceof cc.Component)return function(e,t,n){var r={value:{name:t.isValid?t.name:void 0,uuid:t.uuid}},a=s(t);return n!==a?(e[a]||p(e,t.constructor,a),r.type=a):r.type=n,r}(e,t,n)}else if(t instanceof cc.ValueType){var c=Editor.serialize(t,{stringify:!1});e[c.__type__]||f(e,o,c.__type__);var l=c.__type__;return delete c.__type__,{type:l,value:c}}if(cc.Class._isCCClass(o)){var u={};return n!==(r=s(t))?(e[r]||p(e,o,r),u.type=r):u.type=n,h(e,u,t,o),u}return{type:"Object",value:null}}function v(e,t){try{return t.call(e)}catch(e){Editor.error(e)}return v.ERRORED}function _(e,t,r,a,o){var i=d(e,r,a);if(o.saveUrlAsAsset){var s=o.ctor;if("function"==typeof s&&cc.js.isChildClassOf(s,cc.RawAsset)&&"string"==typeof t)return{type:i,value:{uuid:t&&Editor.Utils.UuidCache.urlToUuid(t)||""}}}if("object"==typeof t||void 0===t){var l=y(e,t,i);if(!l.value){if(!o.ctor)return{type:"Object",value:null};var u=o.ctor;if(n.isAnyChildClassOf(u,cc.Node,cc.RawAsset,cc.Component))return{type:i,value:{uuid:""}}}return l}if("function"==typeof t)return null;var p=c[typeof t];return"Enum"===i&&"number"==typeof t&&(p="Enum"),"Integer"!==i&&"Float"!==i||"Float"===p&&(p=i),{type:p,value:t}}function m(t,n,r,a,o){var c,s=d(t,r,a),l=cc.Class.attr(r,a);if(c=Array.isArray(n)?{type:s,value:e.map(n,function(e){return _(t,e,r,a,l)})}:null==n&&Array.isArray(i(l.default))?{type:"Object",value:null}:_(t,n,r,a,l),"function"==typeof l.visible){var u=v(o,l.visible);u!==v.ERRORED&&(c.visible=!!u)}return c}function h(e,t,n,r){var a=r.__props__;if(a){for(var o={},i=0;i<a.length;i++){var c=a[i],s=n[c];o[c]=m(e,s,r,c,n)}t.value=o}}v.ERRORED={},module.exports=function(e){if(!e)return{types:{},value:null};var n={};return{types:n,value:function(e,n){var r,a,i=["name","opacity","active","angle","group","is3DNode"],c=i.concat(["position","color"]),f={},d=s(n);if(d){f.__type__=d;var v={name:"Node",extends:u(cc.Node)};e[d]=v;var _={};for(r=0;r<c.length;r++){a=c[r];var g={},b=cc.Class.attr(cc.Node,a);b&&l(e,g,b),_[a]=g}_.angle.readonly=t._hasFlagInComponents(n,o.IsRotationLocked),_.position.readonly=t._hasFlagInComponents(n,o.IsPositionLocked),_.anchor={readonly:t._hasFlagInComponents(n,o.IsAnchorLocked)},p(e,cc.Vec2,"cc.Vec2"),p(e,cc.Vec3,"cc.Vec3"),_.size={readonly:t._hasFlagInComponents(n,o.IsSizeLocked)},p(e,cc.Size,"cc.Size"),_.scale={readonly:t._hasFlagInComponents(n,o.IsScaleLocked)},_.skew={},p(e,cc.Color,"cc.Color"),v.properties=_}for(r=0;r<i.length;r++)f[a=i[r]]=m(e,n[a],cc.Node,a,n);if(f.uuid=n.uuid,f.anchor=y(e,new cc.Vec2(n.anchorX,n.anchorY)),f.size=y(e,new cc.Size(n.width,n.height)),f.skew=y(e,new cc.Vec2(n.skewX,n.skewY)),f.color=y(e,n.color.setA(n.opacity)),f.eulerAngles=y(e,n.eulerAngles),n.is3DNode?(f.position=y(e,n.getPosition(cc.v3())),f.scale=y(e,n.getScale(cc.v3()))):(f.position=y(e,n.getPosition(cc.v2())),f.scale=y(e,n.getScale(cc.v2()))),n._prefab){let e=n._prefab.root,t=e&&e._prefab.asset;f.__prefab__={uuid:t&&t._uuid,rootName:e&&e.name,rootUuid:e&&e.uuid,sync:e&&e._prefab.sync,assetReadonly:t&&t.readonly}}var C=n._components;if(C){f.__comps__=[];for(var O=0;O<C.length;O++){var w=C[O],A=w.constructor;if(d=s(A)){var j=p(e,w,d),E="function"==typeof w.start||"function"==typeof w.update||"function"==typeof w.lateUpdate||"function"==typeof w.onEnable||"function"==typeof w.onDisable;j.editor={inspector:A.hasOwnProperty("_inspector")&&A._inspector,icon:A.hasOwnProperty("_icon")&&A._icon,help:A._help,_showTick:E};var N={type:d};h(e,N,w,A),N.value._id={type:"string",value:w._id},f.__comps__.push(N),j.properties.__scriptAsset.visible=!!w.__scriptUuid,N.value.__scriptAsset.value={uuid:w.__scriptUuid}}}}return f}(n,e)}},module.exports.getInheritanceChain=u;