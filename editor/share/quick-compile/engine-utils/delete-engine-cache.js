const e=require("del"),n=require("globby");let r="undefined"!=typeof Editor;module.exports=function(o){let i=!1;return{transform(){i=!0},async compileFinished(t){if(i){let t=[o("bin/.cache/*"),"!"+o("bin/.cache/dev")];if(0==n.sync(t).length)return;r?Editor.log(Editor.T("QUICK_COMPILER.engine_modified_info")):console.log("JavaScript Engine changes detected and the build cache was deleted.");try{e.sync(t,{force:!0})}catch(e){r?Editor.error(e):console.error(e)}i=!1}}}};