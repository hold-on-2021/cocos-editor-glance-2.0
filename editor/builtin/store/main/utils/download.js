"use stirct";const e=require("fs-extra"),r=require("path"),o=require("crypto"),t=require("request"),n=require("request-progress"),i=Editor.remote?Editor.remote.App.home:Editor.App.home,u=r.join(i,"download");e.ensureDirSync(u),exports.downloadZip=function(r,o,i){return new Promise((u,s)=>{r=encodeURI(r),n(t(r),{delay:300}).on("progreass",function(e){i(e.percent)}).on("error",function(e){s(e)}).on("end",function(){u()}).pipe(e.createWriteStream(o))})},exports.md5=function(e){var r=o.createHash("md5");return r.update(e||""),r.digest("hex")};