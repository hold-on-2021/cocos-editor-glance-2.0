"use strict";let e={};module.exports=e;const t=require("electron"),o=require("./ipc");let n,i=!1;function l(e){return e?"WEBVIEW"===e.tagName?e:e.parentNode&&e.parentNode.host&&"WEBVIEW"===e.parentNode.host.tagName?e.parentNode.host:null:null}function d(e){e.preventDefault(),e.stopPropagation(),n.remove();let t=function(e,t){let o=document.elementFromPoint(e,t);for(;o&&o.shadowRoot;){let n=o.shadowRoot.elementFromPoint(e,t);if(!n||n===o)return o;o=n}return o}(e.clientX,e.clientY),o=t.getBoundingClientRect();l(t)?(n.style.backgroundColor="rgba( 128, 0, 0, 0.4)",n.style.outline="1px solid #f00"):(n.style.backgroundColor="rgba( 0, 128, 255, 0.5)",n.style.outline="1px solid #09f"),document.body.appendChild(n),n.style.top=`${o.top+1}px`,n.style.left=`${o.left+1}px`,n.style.width=`${o.width-2}px`,n.style.height=`${o.height-2}px`,n.children[0].innerText=`<${t.tagName.toLowerCase()} class="${t.className}" />`}function r(e){e.preventDefault(),e.stopPropagation(),c();let o=l(document.elementFromPoint(e.clientX,e.clientY));if(o)return o.openDevTools(),o.devToolsWebContents&&o.devToolsWebContents.focus(),void 0;t.ipcRenderer.send("editor:window-inspect-at",e.clientX,e.clientY)}function s(e){e.preventDefault(),e.stopPropagation(),27===e.which&&c()}function c(){i=!1,n.remove(),n=null,window.removeEventListener("mousemove",d,!0),window.removeEventListener("mousedown",r,!0),window.removeEventListener("keydown",s,!0)}e.open=function(e,t,n){o.sendToMain("editor:window-open",e,t,n)},e.focus=function(){o.sendToMain("editor:window-focus")},e.load=function(e,t){o.sendToMain("editor:window-load",e,t)},e.resize=function(e,t,n){o.sendToMain("editor:window-resize",e,t,n)},e.resizeSync=function(e,o,n){n?t.remote.getCurrentWindow().setContentSize(e,o):t.remote.getCurrentWindow().setSize(e,o)},e.center=function(){o.sendToMain("editor:window-center")},t.ipcRenderer.on("editor:window-inspect",function(){(function(){if(!i){if(i=!0,!n){(n=document.createElement("div")).style.position="fixed",n.style.zIndex="999",n.style.top="0",n.style.right="0",n.style.bottom="0",n.style.left="0",n.style.backgroundColor="rgba( 0, 128, 255, 0.5)",n.style.outline="1px solid #09f",n.style.cursor="default";let e=document.createElement("div");e.style.display="inline-block",e.style.position="relative",e.style.top="-18px",e.style.left="0px",e.style.padding="0px 5px",e.style.fontSize="12px",e.style.fontWeight="bold",e.style.whiteSpace="nowrap",e.style.color="#333",e.style.backgroundColor="#f90",e.innerText="",n.appendChild(e),document.body.appendChild(n)}window.addEventListener("mousemove",d,!0),window.addEventListener("mousedown",r,!0),window.addEventListener("keydown",s,!0)}})()});