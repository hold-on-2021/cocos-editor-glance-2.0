"use strict";const e=require("electron").BrowserWindow,o=require("./core/menu");require("./core/external-app"),module.exports={panel_is_open:!1,load(){},unload(){},messages:{open(){Editor.Panel.open("cloud-function")},"print-to-console"(e,o,n){"object"==typeof n&&(n=JSON.stringify(n,null,"\t")),"log"===o?Editor.log(n):"error"===o?Editor.error(n):"info"===o?Editor.info(n):"warn"===o?Editor.warn(n):"success"===o?Editor.success(n):"failed"===o&&Editor.failed(n)},"panel-changed"(e,o){this.panel_is_open=o},"env-changed"(e,o){this.panel_is_open&&Editor.Ipc.sendToPanel("cloud-function","cloud-function:env-changed",o,(o,n)=>{e.reply&&e.reply(null,n)})},refresh(e){this.panel_is_open&&Editor.Ipc.sendToPanel("cloud-function","cloud-function:refresh")},hint(e,o){this.panel_is_open&&Editor.Ipc.sendToPanel("cloud-function","cloud-function:hint",o)},"query-tcb-safety-source"(e,o,n){this.panel_is_open&&Editor.Ipc.sendToPanel("cloud-function","cloud-function:query-tcb-safety-source",o,n,(o,n)=>{e.reply&&e.reply(null,n)})},"query-tcb-safety-source-available"(e,o,n){this.panel_is_open&&Editor.Ipc.sendToPanel("cloud-function","cloud-function:query-tcb-safety-source-available",o,n,(o,n)=>{e.reply&&e.reply(null,n)})},"popup-create-menu"(n,t,r){let l=o.getCreateTemplate(),i=new Editor.Menu(l,n.sender);t=Math.floor(t),r=Math.floor(r),i.nativeMenu.popup(e.fromWebContents(n.sender),t,r),i.dispose()},"popup-context-menu"(n,t,r,l,i,s,u){let c=o.getContextTemplate(l,i,s,u),p=new Editor.Menu(c,n.sender);t=Math.floor(t),r=Math.floor(r),p.nativeMenu.popup(e.fromWebContents(n.sender),t,r),p.dispose()}}};