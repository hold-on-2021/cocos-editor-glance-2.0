"use strict";const e=require("fs"),t=require("path"),n=(require("../utils/cache"),require("../utils/operation"),require("../utils/event")),r=require("../utils/utils"),i=require("../utils/communication");exports.template=e.readFileSync(t.join(__dirname,"../template/tools.html"),"utf-8"),exports.props=["filter"],exports.data=function(){return{input:!1,current_env_id:""}},exports.created=function(){n.on("nodes_focus",e=>{this.input=!e}),n.on("env_changed",e=>{this.current_env_id=""===e||"undefinedenv"===e?this.t("cloud-function.not-env"):e});var e=r.getCurrentEnvId();this.current_env_id=""===e||"undefinedenv"===e?this.t("cloud-function.not-env"):e},exports.methods={t:e=>Editor.T(e),refresh(){n.emit("refresh-node-tree")},createPopup(e){r.checkedCurrentEnvId()&&i.popup("create",{x:e.x-20,y:e.y+20})},onFilterAssets(){n.emit("filter-changed",event.target.value)},emptyFilter(){r.emptyFilter()},oInputnFocus(){this.input=!0},onInputBlur(){this.input=!1}};