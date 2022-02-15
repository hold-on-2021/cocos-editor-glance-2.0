"use strict";let e=require("./utils.js"),s=e.getCreatorHomePath()+"/local/service.json",r=e.readJson(s),i=void 0!==r.devmode&&r.devmode,a=e.getProjectPath()+(i?"/settings/dev-services.json":"/settings/services.json");module.exports={needExecNative(){var s=e.readJson(a);return void 0===s.needExecNative?!!s.configs:s.needExecNative},readBindGame:()=>e.readJson(a).game,writeBindGame(s){var r=e.readJson(a);if(r.game=s,r.configs){var i=!1;for(var v of r.configs)i=v.appid===r.game.appid;i||r.configs.push({appid:s.appid})}e.saveJson(a,r)},readEnableService(){var s=e.readJson(a),r=[];if(s.configs)for(var i of s.configs)if(i.appid===s.game.appid&&i.services)for(var v of i.services)v.enable&&r.push(v.service_id);return r},wirteEnableService(s,r){var i=e.readJson(a),v=!1;if(r&&(i.needExecNative=!0),i.configs){for(var d of i.configs)if(d.appid===i.game.appid)if(d.services){for(var o of d.services)s===o.service_id&&(o.enable=r,v=!0);if(!v){o={service_id:s,enable:r};d.services.push(o)}}else{var n=[];n.push({service_id:s,enable:r}),d.services=n}}else{var c=[];c.push({appid:i.game.appid,services:[{service_id:s,enable:r}]}),i.configs=c}e.saveJson(a,i)},writeServiceParam(s,r){var i=e.readJson(a),v=!1;if(i.configs){for(var d of i.configs)if(d.appid===i.game.appid)if(d.services){for(var o of d.services)s===o.service_id&&(o.params=r,v=!0);if(!v){o={service_id:s,enable:isEnable,params:r};d.services.push(o)}}else{var n=[];n.push({service_id:s,enable:isEnable,params:r}),d.services=n}}else{var c=[];c.push({appid:i.game.appid,services:[{service_id:s,enable:isEnable,params:r}]}),i.configs=c}e.saveJson(a,i)},readServiceParam(s){var r=e.readJson(a),i={};if(r.configs)for(var v of r.configs)if(v.appid===r.game.appid&&v.services)for(var d of v.services)s===d.service_id&&d.params&&(i=d.params);return i},writeServiceList(r){var i=e.readJson(s);i&&i.devmode?i.dev_services=r:i.services=r,i.lang=e.getLang(),e.saveJson(s,i)},readServiceList(){var r=e.readJson(s);return r?r.devmode&&r.dev_services?r.dev_services:!r.devmode&&r.services?r.services:null:null},readDebugMode(){var r=e.readJson(s);return void 0!==r.debug&&r.debug},readDevMode(){var r=e.readJson(s);return void 0!==r.devmode&&r.devmode},writeDevMode(r){var i=e.readJson(s);i.devmode=r,e.saveJson(s,i)},readServiceConfig:()=>e.readJson(s)};