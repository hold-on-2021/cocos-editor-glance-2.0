"use strict";
const e = require("../share/i18n");
module.exports = e, require("electron").ipcMain.on("editor:get-i18n-phrases", r => {
    r.returnValue = e.polyglot.phrases
});