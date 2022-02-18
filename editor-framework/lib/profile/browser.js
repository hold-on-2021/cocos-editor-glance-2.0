"use strict";
const {
    EventEmitter: e
} = require("events"), r = require("@base/electron-profile"), t = require("../app"), {
    loadProfile: o,
    setDefaultData: s,
    addRegisterEvents: i
} = require("./utils"), l = require("path"), n = require("fs-extra");
module.exports = new class extends e {
    query(e) {
        return r.query(e)
    }
    register(e, t) {
        r.register(e, t)
    }
    clear() {
        r.clear()
    }
    inherit(e, t) {
        r.inherit(e, t)
    }
    reset() {
        console.warn("'Editor.Profile.reset' has been deprecated, please use 'Editor.Profile.clear'."), r.clear()
    }
    getPath(e) {
        return console.warn("'Editor.Profile.getPath' has been deprecated, please use 'Editor.Profile.query'."), r.query(e)
    }
    setDefault(e, r) {
        console.warn("'Editor.Profile.setDefault' has been deprecated. please use profile.set(key, value)."), s(e, r)
    }
    load(e, r) {
        let t;
        try {
            t = o(e, r)
        } catch (e) {
            t = null, console.error(e)
        }
        return t
    }
    mount(e, r) {
        s(e, r)
    }
};
if (i(), l.isAbsolute(t.home)) {
    const e = l.join(t.home, "default-profiles");
    n.ensureDirSync(e), r.register("default", e);
    const o = l.join(t.home, "profiles");
    n.ensureDirSync(o), r.register("global", o)
}
r.inherit("global", "default"),
    function () {
        try {
            const e = l.join(t.home, "profiles");
            let r = l.join(e, "layout.windows.json"),
                o = l.join(e, "layout.dashboard.json");
            !n.existsSync(o) && n.existsSync(r) && n.renameSync(r, o)
        } catch (e) {
            console.error(e)
        }
    }();