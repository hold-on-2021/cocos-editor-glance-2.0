"use strict";function e(e,i){Editor.require("packages://cocos-services/panel/utils/ccServices.js").execInstallNativePlatformScript(e,e=>e&&i())}async function i(e=!1){let i=Editor.require("packages://cocos-services/panel/utils/ccServices.js");await i.init(e),!e&&Editor.info("Cocos Service load base data!")}function r(){i(!0),Editor.info("Cocos Service reload base data!")}function o(){i(!0)}module.exports={panelStatus:{},load(){Editor.Builder.removeListener("before-change-files",e),Editor.Builder.on("before-change-files",e),Editor.User.removeListener("login",r),Editor.User.removeListener("logout",o),Editor.User.on("login",r),Editor.User.on("logout",o),i(),this.downloadImPlugin()},unload(){Editor.Builder.removeListener("before-change-files",e),Editor.User.removeListener("login",r),Editor.User.removeListener("logout",o)},loadImPlugin:async(e,i)=>new Promise((r,o)=>{Editor.Package.unload(`${i}/${e}`,()=>{Editor.Package.load(`${i}/${e}`,()=>r())})}),async downloadImPlugin(){try{let r=require("./panel/utils/utils"),o=require("./panel/utils/ccServices"),s=require("fs");if(s.existsSync(`${r.getCreatorHomePath()}/packages/im-plugin`)||s.existsSync(`${r.getProjectPath()}/packages/im-plugin`))return;await o.init();var e=await o.getIMSettings(),i=r.getCreatorHomePath()+"/download/im-plugin.zip";let t=r.getCreatorHomePath()+"/packages/";require("./panel/utils/network").download(e.data.plugin_url,i,(e,o)=>{e||"complete"!==o.status||r.unzip(i,t,e=>{s.existsSync(i)&&s.unlinkSync(i),e||this.loadImPlugin("im-plugin",t)})})}catch(e){console.log(e)}},messages:{log(e,i){Editor.log(i)},error(e,i){Editor.error(i)},info(e,i){Editor.info(i)},warnning(e,i){Editor.warn(i)},success(e,i){Editor.success(i)},failed(e,i){Editor.failed(i)},open(e,i){Editor.Panel.open("cocos-services")},"panel-status-changed"(e,i,r){this.panelStatus[i]=r},openBrowser(e,i){Editor.Panel.open("cocos-services-browser",i)},execH5Script(e,i){Editor.require("packages://cocos-services/panel/utils/ccServices.js").execInstallH5PlatformScript(i.service,i.params,i.enable)},"plugin-messages"(e,i,r){this.panelStatus["cocos-services"]&&Editor.Ipc.sendToPanel("cocos-services","plugin-messages",i,r,(i,r)=>e.reply&&e.reply(null,r))},async"tcb-get-temp-key"(e,i){let r=Editor.require("packages://cocos-services/panel/utils/ccServices.js"),o=Editor.require("packages://cocos-services/panel/utils/serviceConfig.js");for(var s of o.readServiceList())if("service-tcb"===s.service_component_name){var t=o.readBindGame().appid,a=await r.getTCBTempKey(s.service_id,t);return e.reply&&e.reply(null,a),void 0}},"change-float-window-size"(e,i,r){require("electron").BrowserWindow.fromWebContents(e.sender).setContentSize(i,r,!0)}}};