"use strict";
const {
    EventEmitter: e
} = require("events"), {
    loadProfile: t,
    addRegisterEvents: r
} = require("./utils");
r();
module.exports = new class extends e {
    load(e, r) {
        let l, n = null;
        try {
            l = t(e)
        } catch (e) {
            l = null, n = e, console.error(e)
        }
        return r && (console.warn("'Editor.Profile.load' async changed to sync, don't need callback."), r(n, l)), l
    }
};