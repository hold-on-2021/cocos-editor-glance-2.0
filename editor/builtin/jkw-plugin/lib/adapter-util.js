let e,r,a=require("path"),t=require("fs-extra"),i=require("./build-jsb-adapter.js"),n=Editor.url("packages://jkw-adapter"),o=!1,s="";module.exports={gatherInfo(t){e=t.cpk,o=t.isTinyPackage,s=t.customConfig.tinyPackageServer,r=a.join(t.buildPath,"jsb-adapter")},async organizeResources(e){if(o&&""===s)return e.reply(new Error("please enter remote server root")),!1;let c=a.join(r,"engine","index.js");t.emptyDirSync(r),await i.build({rootPath:a.join(n,"./engine/index.js"),dstPath:c});var d=t.readFileSync(c,"utf8");return d=o?d.replace("REMOTE_SERVER_ROOT_PLACE_HOLDER",s):d.replace("REMOTE_SERVER_ROOT_PLACE_HOLDER",""),t.writeFileSync(c,d),!0},pack(){e.directory(r,"jsb-adapter")}};