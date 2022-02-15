"use strict";const e=require("jsondiffpatch"),{promisify:t}=require("util");let r=e.create({objectHash:(e,t)=>e.uuid?e.uuid:e.name&&e.attrs?e.name:`$$index:${t}`,arrays:{detectMove:!0}}),n="",i={},o=!1,c=function(e,t,r,n){if(!(n=n||i[e]))throw"timeline 找不到指定的节点数据，无法获取关键帧";if(t){let e=t,i=r;for(let r in n.types){if(n.types[r].name===t){e=r;break}}let o=null;for(let t in n.value.__comps__){let r=n.value.__comps__[t];if(r.type===e){o=r.value;break}}let c=cc.js._getClassById(e);if(!c)return o[i]?o[i].value:null;let l=cc.Class.attr(c,i);if(!l.ctor)return o[i]?o[i].value:null;if(cc.js.isChildClassOf(l.ctor,cc.RawAsset)){let e=o[i].value;return e.uuid?Editor.serialize.asAsset(e.uuid):null}let a=new l.ctor,s=n.types[a.__cid__];if(s&&s.properties){let e=s.properties;for(let t in e)a[t]=o[i].value[t]}return a}"x"===r?r="positionX":"y"===r?r="positionY":"z"===r&&(r="positionZ");let o=r,c=null,a=o.substr(0,o.length-1);n.value[a]&&(c=o[o.length-1].toLocaleLowerCase(),o=a),"width"!==o&&"height"!==o||(c=o,o="size");let s=n.value[o],u=s?l[s.type]:null;if(!u)throw`The timeline replication attribute has an error: ${s.type}`;let p=u(s.value);return"position"===r?void 0!==p.z?[p.x,p.y,p.z]:[p.x,p.y]:c?p[c]:p},l={"cc.Vec2"(e){var t=new cc.Vec2;return t.x=e.x,t.y=e.y,t},"cc.Vec3"(e){var t=new cc.Vec3;return t.x=e.x,t.y=e.y,t.z=e.z,t},"cc.Color"(e){var t=new cc.Color;return t.r=e.r,t.g=e.g,t.b=e.b,t},"cc.Size"(e){var t=new cc.Size;return t.width=e.width,t.height=e.height,t},String:e=>e,Float:e=>e,Boolean:e=>e,Integer:e=>e};module.exports={update:async function(e){clearTimeout(o),o=setTimeout(()=>{(async function(e){let r=Editor.Selection.curSelection("node");n&&-1===r.indexOf(n)&&r.push(n);for(let e=0;e<r.length;e++){let n=r[e],o=await t(Editor.Ipc.sendToPanel)("scene","scene:query-node",n);i[n]=JSON.parse(o)}Object.keys(i).forEach(e=>{-1===r.indexOf(e)&&delete i[e]}),e&&e()})(e)},100)},diff:function(e,t){let n=[],o=i[e];if(!o)return Editor.warn("The cached node data cannot be found."),n;let l=r.diff(o.value,t.value);if(!l)return n;let a=l,s=l&&l.__comps__||{};return delete l.__comps__,Object.keys(a).forEach(r=>{let i=c(e,null,r,t);n.push({component:null,property:r,value:i});let o=Object.keys(a[r].value);o&&o.forEach(e=>{let t,o=r+e[0].toUpperCase()+e.substr(1);switch(o){case"positionX":o="x",t=i[0];break;case"positionY":o="y",t=i[1];break;case"positionZ":o="z",t=i[2];break;case"sizeWidth":o="width",t=i.width;break;case"sizeHeight":o="height",t=i.height;break;default:t=i[e]}n.push({component:null,property:o,value:t})})}),Object.keys(s).forEach(r=>{if(!t.value.__comps__[r])return;let i=t.value.__comps__[r].type,o=s[r].value;i&&o&&Object.keys(o).forEach(r=>{let o=c(e,i,r,t);n.push({component:i,property:r,value:o})})}),i[e]=t,n.forEach(e=>{if(!e.component||e.component.startsWith("cc."))return;const t=o.types[e.component];t&&(e.component=t.name)}),n},getProperty:c,get root(){return n},set root(e){n=e},hasAnimaiton:function(e){let t=i[e];if(!t)return!1;for(let e in t.types){let r=t.types[e];if("cc.Animation"===e)return!0;let n=r.extends;if(n)for(let e=0;e<n.length;e++)if("cc.Animation"===n[e])return!0}}},window.abc=i;