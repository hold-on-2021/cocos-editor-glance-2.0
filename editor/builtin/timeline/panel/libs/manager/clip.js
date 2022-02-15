"use strict";let e=function(e){let t=(e=e||{}).curveData||{};return Object.keys(t.paths||{})},t=function(e,t){let r,n,a=(e=e||{}).curveData||{};if(t=t.replace(/^\/[^\/]+\/?/,"")){a=(a.paths||{})[t]||{}}return{comps:r=a.comps||{},props:n=a.props||{}}},r=function(e,r,n,a){let l=t(e=e||{},r);return(l=n?l.comps[n]||{}:l.props)[a]||[]},n=function(e,t,n,a,l){let o=(e=e||{}).sample,s=r(e,t,n,a);for(let e=0;e<s.length;e++){let t=s[e];if(Math.round(t.frame*o)===l)return t}return null},a=function(e){return(e=e||{}).events||[]};const l={x:["position"],y:["position"],z:["position"],position:["x","y","z"],scaleX:["scale"],scaleY:["scale"],scaleZ:["scale"],scale:["scaleX","scaleY","scaleZ"]};let o=function(e,t,r,n){if(!e)return null;let a,o=e.curveData;if(t=t.replace(/^\/[^\/]+\/?/,"")){let e=o.paths=o.paths||{};e[t]=e[t]||{},o=e[t]}if(r){let e=o.comps=o.comps||{},t=e[r]=e[r]||{};a=t[n]=t[n]||[]}else{let e=o.props=o.props||{},t=l[n]&&l[n].find(t=>e[t]);if(t)return Editor.Dialog.messageBox({type:"warning",title:" ",buttons:[Editor.T("MESSAGE.sure")],message:Editor.T("timeline.property.add_property_warn",{a:n,b:t}),noLink:!0,defaultId:0}),!1;a=e[n]=e[n]||[]}return u(e),a},s=function(e,t,r,a,l,o){if(!e)return!1;let s=n(e,t,r,a,l);return!!s&&(s.curve=o,!0)},i=function(e,t){e&&(e.props&&Object.keys(e.props).forEach(r=>{let n=e.props[r];t(null,r,n)}),e.comps&&Object.keys(e.comps).forEach(r=>{let n=e.comps[r];n&&Object.keys(n).forEach(e=>{let a=n[e];t(r,e,a)})}))},u=function(r){let n=e(r);r._duration=0,n.push(""),n.forEach(e=>{let n=t(r,e);i(n,(e,t,n)=>{if(!n.length)return;let a=n[n.length-1];r._duration="cc.Sprite"===e&&"spriteFrame"===t?Math.max((Math.round(a.frame*r.sample)+1)/r.sample,r._duration):Math.max(a.frame,r._duration)})});let l=a(r),o=l[l.length-1];o&&(r._duration=Math.max(o.frame,r._duration))};module.exports={queryPaths:e,queryInfo:function(e){return{name:(e=e||{}).name||"",sample:e.sample||0,duration:e.duration||0,speed:e.speed||1,wrapMode:e.wrapMode||0}},queryCurve:t,queryProperty:r,queryKey:n,queryEvents:a,addCurve:function(e,t,r){if(!e)return null;t=t.replace(/\/[^\/]+(\/)?/,"");let n=e.curveData;if(t){let e=n.paths=n.paths||{};n=e[t]=e[t]||{}}return n.comps=r.comps,n.props=r.props,u(e),r},deleteCurve:function(e,r){if(!e)return null;if((r=r.replace(/\/[^\/]+(\/)?/,""))&&(!e.curveData.paths||!e.curveData.paths[r]))return null;if(0===Editor.Dialog.messageBox({type:"question",buttons:[Editor.T("timeline.manager.delete_path_button_cancel"),Editor.T("timeline.manager.delete_path_button_confirm")],title:"",message:`${Editor.T("timeline.manager.delete_path_title")}\n/\${root}/${r}`,detail:Editor.T("timeline.manager.delete_path_info"),defaultId:0,cancelId:0,noLink:!0}))return null;let n=t(e,r);return r?delete e.curveData.paths[r]:(delete e.curveData.props,delete e.curveData.comps),u(e),n},addProperty:o,deleteProperty:function(e,t,r,n){if(!e)return null;let a,l=e.curveData;if(t=t.replace(/^\/[^\/]+\/?/,"")){if(!l.paths||!l.paths[t])return null;l=l.paths[t]}if(r){if(!l.comps||!l.comps[r]||!l.comps[r][n])return null;a=l.comps[r][n]}else{if(!l.props||!l.props[n])return null;a=l.props[n]}if(a&&a.length>0&&0===Editor.Dialog.messageBox({type:"question",buttons:[Editor.T("timeline.manager.delete_property_button_cancel"),Editor.T("timeline.manager.delete_property_button_confirm")],title:"",message:Editor.T("timeline.manager.delete_property_title"),detail:Editor.T("timeline.manager.delete_property_info"),defaultId:0,cancelId:0,noLink:!0}))return null;return r?(delete l.comps[r][n],0===Object.keys(l.comps[r]).length&&(delete l.comps[r],0===Object.keys(l.comps).length&&delete l.comps)):(delete l.props[n],0===Object.keys(l.props).length&&delete l.props),0===Object.keys(l).length&&(t?(delete e.curveData.paths[t],0===Object.keys(e.curveData.paths).length&&delete e.curveData.paths):(delete e.curveData.props,delete e.curveData.comps)),u(e),a},addKey:function(e,t,r,n,a,l,i){if(!e)return null;let p=o(e,t,r,n),c=e.sample;if(p.some(e=>Math.round(e.frame*c)===a))return Editor.Dialog.messageBox({type:"question",buttons:[Editor.T("timeline.manager.add_key_button_confirm")],title:"",message:Editor.T("timeline.manager.add_key_button_exists"),detail:Editor.T("timeline.manager.add_key_info"),defaultId:0,cancelId:0,noLink:!0}),null;let d={frame:a/c,value:l};switch(p.push(d),p.sort((e,t)=>e.frame-t.frame),u(e),i){case"Enum":case"cc.Integer":s(e,t,r,n,a,"constant")}return d},deleteKey:function(e,t,n,a,l){if(!e)return null;let o=e.sample,s=r(e,t,n,a);for(let t=0;t<s.length;t++){let r=s[t];if(Math.round(r.frame*o)===l)return s.splice(t,1),u(e),r}return null},addEvent:function(e,t,r,n){if(!e)return null;let a={frame:t/e.sample,func:r||"",params:n||[]};return e.events=e.events||[],e.events.push(a),e.events.sort((e,t)=>e.frame-t.frame),u(e),a},deleteEvent:function(e,t){if(!e)return null;let r=a(e);for(let e=0;e<r.length;e++){let n=r[e];if(JSON.stringify(n)===JSON.stringify(t))return r.splice(e,1),n}return u(e),null},mountCurveToKey:s,changeSample:function(r,n){if(!r)return;let l=e(r);l.splice(0,0,""),l.forEach(e=>{let a=t(r,e);i(a,(e,t,a)=>{a.forEach(e=>{let t=Math.round(e.frame*r.sample);e.frame=t/n})})}),a(r).forEach(e=>{let t=Math.round(e.frame*r.sample);e.frame=t/n}),r.sample=n,u(r)},changeSpeed:function(e,t){e&&(e.speed=t)},changeMode:function(e,t){e&&(e.wrapMode=t)}};