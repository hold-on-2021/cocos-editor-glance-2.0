"use strict";const e={"cc.ClickEvent":"cc-event-prop","cc.CurveRange":"cc-curve-range","cc.GradientRange":"cc-gradient-range","cc.Gradient":"cc-gradient","cc.ShapeModule":"cc-shape-module"};function t(r,a,n,c,p){let l=n.value,i=n.type;n.name=c.displayName?c.displayName:Editor.UI.toHumanText(a),n.path=r,n.attrs=Object.assign({},c),i?"visible"in n&&(n.attrs.visible=n.visible):n.attrs.visible=!1;let s=p[i],o=!1,_=!1,y=Editor.UI.getProperty(i);s&&s.extends&&(o="cc.Asset"===i||"cc.RawAsset"===i||-1!==s.extends.indexOf("cc.Asset")||-1!==s.extends.indexOf("cc.RawAsset"),_=-1!==s.extends.indexOf("cc.Object")),!Array.isArray(n.value)||"default"in c&&!Array.isArray(c.default)?o?(n.type="cc.Asset",n.attrs.assetType=c.type):_?(n.type="cc.Node",n.attrs.typeid=c.type,s&&(n.attrs.typename=s.name)):y||(n.type="Object",s&&(n.attrs.typename=s.name)):(n.type="Array",n.elementType=i,o?(n.elementType="cc.Asset",n.attrs.assetType=c.type):_?(n.elementType="cc.Node",n.attrs.typeid=c.type,s&&(n.attrs.typename=s.name)):y||(n.elementType="Object")),n.compType="cc-prop";let d=!1;"Object"!==n.type||null!==n.value&&void 0!==n.value||(d=!0);let u=!1;if(!1===d&&n.attrs.type&&i!==n.attrs.type&&(s&&s.extends?-1===s.extends.indexOf(n.attrs.type)&&(u=!0):u=!0),d)s=p[n.attrs.type],n.attrs.typename=s?s.name:n.attrs.type,n.compType="cc-null-prop";else if(u)n.compType="cc-type-error-prop";else if("Array"===n.type){n.compType="cc-array-prop";for(let e=0;e<l.length;++e){t(`${r}.${e}`,`[${e}]`,l[e],c,p)}}else if("Object"===n.type){let a=e[i];n.compType=a||"cc-object-prop";let c=p[i];for(let e in n.value){let a=n.value[e],l=c.properties[e];a&&l?t(`${r}.${e}`,e,a,l,p):delete n.value[e]}}}function r(e,r,a){let n=r.type;if(!n)return Editor.warn("Type can not be null"),void 0;let c=a[n];c&&(c.editor&&(r.__editor__=c.editor),r.__displayName__=c.name?c.name:n);for(let n in r.value){let p=r.value[n],l=c.properties[n];p&&l?t(`${e}.${n}`,n,p,l,a):delete r.value[n]}}let a=/^target\.__comps__\.(\d+)/;module.exports={buildNode:function(e,t,a){let n=t.__type__;if(!n)return Editor.warn("Type can not be null"),void 0;let c=a[n];c&&(c.editor&&(t.__editor__=c.editor),c.name&&(t.__displayName__=c.name));for(let n in t){if("__type__"===n||"__displayName__"===n||"uuid"===n)continue;if("__comps__"===n){let c=t[n];for(let t=0;t<c.length;++t)r(`${e}.__comps__.${t}`,c[t],a);continue}let p=t[n];p.path=`${e}.${n}`,p.readonly=!1;let l=c.properties[n];l&&(t[n].readonly=!!l.readonly)}},compPath:function(e){let t=a.exec(e);return t?t[0].replace(a,"target.__comps__[$1]"):""},normalizePath:function(e){return e=(e=e.replace(/^target\./,"")).replace(/^__comps__\.\d+\./,"")},findRootVue:function(e){for(var t=null;e;){if(e.__vue__){t=e;break}e=e.parentElement}return t.__vue__},syncObjectProperty:function(e,t,r,a){for(var n,c=t.match(/target\.__comps__\.\d+/)[0],p=t.match(/target\.__comps__\.\d+\.(\S*)/)[1],l=c.split("."),i=e,s=0;s<l.length;s++){if(null==i)return cc.warn('Failed to parse "%s", %s is nil',t,l[s]),null;i=n=i[l[s]]}Editor.Ipc.sendToPanel("scene","scene:set-property",{id:n.value.uuid.value,path:p,type:r,value:a})}};