"use strict";var e=[];exports.add=function(r){if(r){var a=JSON.parse(r);e.push(a)}},exports.get=function(){if(!e)return null;var r=e[0];if(!r||!r.value)return null;e.forEach(e=>{var r={};e.value.__comps__.forEach(e=>{var a=e.type;r[a]||(r[a]=0),e.__orderedType=a+r[a],r[a]+=1})});var a={types:{},value:{uuid:e.map(e=>e.value.uuid).join("^"),uuids:e.map(e=>e.value.uuid),__type__:r.value.__type__,__comps__:[]}};e.every(e=>{Object.keys(e.types).forEach(r=>{a.types[r]||(a.types[r]=e.types[r])})});var t=["__type__","uuid","__comps__","__prefab__"];return Object.keys(r.value).forEach(r=>{if(-1===t.indexOf(r)){var _=[];e.every(e=>{var a=e.value[r];return _.push(a),!!a})&&(a.value[r]=u(_))}}),1===e.length&&r.value.__prefab__&&(a.value.__prefab__=r.value.__prefab__),r.value.__comps__.forEach(r=>{if(e.every(e=>{return e.value.__comps__.some(e=>e.type===r.type)})){var t=!1,_=e.map(e=>{var a;return e.value.__comps__.some(e=>{e.__orderedType===r.__orderedType&&(a=e)}),a||(t=!0),a});t||a.value.__comps__.push(function(e,r,a){var t=a[r],_={type:r,value:{}};return Object.keys(t.properties||{}).forEach(r=>{var a=e.map(e=>JSON.parse(JSON.stringify(e.value[r])));_.value[r]=u(a)}),_}(_,r.type,a.types))}}),a.multi=e.length>1,a},exports.onSendBegin=null,exports.onSendEnd=null;var r={};exports.change=function(u,_,n,p){if(e&&e[0]){var o=e[0].types[n];e.forEach(e=>{var t=function(e,r){if(!r)return e;var a=r.match(/target\.__comps__\[(\d+)\]/);return a?e.value.__comps__[a[1]]:null}(e,_),l=function(e,r,u,t){if(e&&r&&-1==a.indexOf(e)){var _={};return Object.keys(r).forEach(e=>{null==t[e]||Array.isArray(t[e])?_[e]=u.value[e]:_[e]=t[e]}),_}return t}(n,o?o.properties:null,t.value[u],p),v=t.value.uuid.value||t.value.uuid;let s={id:v,path:u,type:n,value:l,isSubProp:!1};r[`${v}.${u}`]=s}),exports.onSendBegin&&exports.onSendBegin(),clearTimeout(t),t=setTimeout(()=>{for(let e in r)Editor.Ipc.sendToPanel("scene","scene:set-property",r[e]),delete r[e];exports.onSendEnd&&exports.onSendEnd()},200)}};var a=["cc.Color","cc.Node"];function u(e){var r=e[0],a={type:r.type,value:r.value,values:e.map(e=>e.value)};return Object.keys(r).forEach(u=>{"type"!=u&&"value"!=u&&"values"!=u&&(e.every(e=>r[u]==e[u])&&(a[u]=r[u]))}),a}exports.clear=function(){e.length=0};var t=null;