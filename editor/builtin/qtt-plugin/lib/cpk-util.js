let e=require("./jszip.min.js"),t=require("path"),i=require("fs-extra"),a=require("./worker-util.js"),n=require("./adapter-util.js"),o=require("./tinypack-util.js"),r={};e.prototype.directory=function(e,a){if(!i.statSync(e).isDirectory())return Editor.error(e+" is not a folder!"),void 0;i.readdirSync(e).forEach(function(e){let a=this.zip,n=t.join(this.srcPath,e),o=i.statSync(n);o.isDirectory()?a.directory(n,e):o.isFile()?a.file(e,i.readFileSync(n)):Editor.error(n+" was not added to zip!")}.bind({srcPath:e,zip:this.folder(a)}))},e.prototype.append=function(e,t){if(!i.statSync(e).isFile())return Editor.error(e+" is not a file!"),void 0;this.file(t,i.readFileSync(e))},module.exports={async gatherInfo(s,c){if(void 0!==Editor.Profile.load.getSelfData?r.customConfig=Editor.Profile.load("project://qtt-runtime.json").getSelfData():r.customConfig=Editor.Profile.load("profile://project/qtt-runtime.json").data,!1===this.checkData(r,c))return!1;let u=r.customConfig;r.isTinyPackage=!!u.tinyPackageMode,r.projectPath=s.project,r.buildPath=s.dest,r.subpackages=s.buildResults._subpackages,r.title=s.title,r.cpkName=r.customConfig.package+"_"+r.customConfig.versionName+"_"+r.customConfig.versionCode+".cpk";let m=u.outputCpkPath,d=u.useCustomCpkPath;return r.buildResults=s.buildResults,r.startScene=s.startScene,!0===d?""!==m&&i.existsSync(m)?r.cpkPath=t.join(m,r.cpkName):(Editor.log(Editor.T("qtt-runtime.out_cpk_path_error")),r.cpkPath=t.join(r.buildPath,r.cpkName)):r.cpkPath=t.join(r.buildPath,r.cpkName),r.gameConfig={deviceOrientation:u.deviceOrientation,showStatusBar:u.showStatusBar,runtimeVersion:u.runtimeVersion},r.mainfest={deviceOrientation:u.deviceOrientation,package:u.package,name:u.name,versionName:u.versionName,versionCode:u.versionCode,icon:"logo.png"},r.JsZip=e,r.cpk=new e,await a.gatherInfo(r),await n.gatherInfo(r),await o.gatherInfo(r),!0},checkData(e,t){var a=e.customConfig.package,n=e.customConfig.name,o=e.customConfig.versionName,r=e.customConfig.versionCode,s=e.customConfig.icon,c=!0,u=[],m="";[{name:Editor.T("qtt-runtime.package"),value:a},{name:Editor.T("qtt-runtime.name"),value:n},{name:Editor.T("qtt-runtime.desktop_icon"),value:s},{name:Editor.T("qtt-runtime.version_name"),value:o},{name:Editor.T("qtt-runtime.version_number"),value:r}].forEach(function(e){e.value||(c=!1,u.push(e.name))}),c||(m+=u.join("、")+Editor.T("qtt-runtime.not_empty")),s&&(i.existsSync(s)||(c=!1,m+=s+Editor.T("qtt-runtime.icon_not_exist")));a.match(/^[a-zA-Z]+[0-9a-zA-Z]*(\.[a-zA-Z]+[0-9a-zA-Z]*)*$/)||(c=!1,m+=Editor.T("qtt-runtime.package_name_error"));n.match(/^[0-9a-zA-Z]*(\.[a-zA-Z]+[0-9a-zA-Z]*)*$/)||(c=!1,m+=Editor.T("qtt-runtime.game_name_error"));o.match(/^[0-9]*(\.[0-9]*)*$/)||(m+=Editor.T("qtt-runtime.game_version_name_error"));return r.match(/^[1-9]+[0-9]*]*$/)||(m+=Editor.T("qtt-runtime.game_version_number_error")),!!c||(t.reply(new Error(m)),!1)},async organizeResources(e){let o=r.buildPath;return await a.organizeResources(),!1!==await n.organizeResources(e)&&(i.writeFileSync(t.join(o,"game.config.json"),JSON.stringify(r.gameConfig)),i.writeFileSync(t.join(o,"manifest.json"),JSON.stringify(r.mainfest)),!0)},async pack(){let e=r.cpk,s=r.cpkPath,c=r.buildPath;i.existsSync(s)&&i.unlinkSync(s);let u=i.createWriteStream(s);await a.pack(),await n.pack(),await o.pack(),e.directory(t.join(c,"src"),"src"),e.append(r.customConfig.icon,"logo.png"),e.append(t.join(c,"main.js"),"main.js"),e.append(t.join(c,"game.config.json"),"game.config.json"),e.append(t.join(c,"manifest.json"),"manifest.json"),e.generateNodeStream({type:"nodebuffer",base64:!1,compression:"DEFLATE"}).pipe(u).on("finish",function(){o.packFinished()})}};