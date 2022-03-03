"use strict";
(() => {
    let t = global.Editor;
    if (t) {
        const s = require("./lib/meta");
        t.metas || (t.metas = {}), t.metas["raw-asset"] = s.RawAssetMeta, t.metas.asset = s.AssetMeta, t.metas.folder = s.FolderMeta, t.isMainProcess && (t.versions["asset-db"] = require("./package.json").version, require("./core/protocol"))
    }
    const s = require("events"),
        i = require("util"),
        e = require("fire-fs"),
        a = require("fire-path"),
        r = require("async"),
        h = require("lodash");

    function n(t, s) {
        if ("string" != typeof t) return typeof t;
        if (s <= 3 || t.length <= s) return t;
        let i = Math.floor(s / 2);
        return t.length > s && t.length < s + 3 ? t.substr(0, i) + "..." + t.substr(t.length - i + (t.length - s + 3)) : t.substr(0, i) + "..." + t.substr(t.length - i)
    }

    function u(s) {
        s = s || {}, this.silent = s.silent, void 0 === this.silent && (this.silent = !1), this.dev = s.dev, void 0 === this.dev && (this.dev = !1), this.metaBackupPath = s.metaBackupPath, this.assetBackupPath = s.assetBackupPath, this.cwd = s.cwd || process.cwd();
        let i = s.library || "library";
        this.library = a.resolve(this.cwd, i), e.ensureDirSync(this.library), this._mounts = {}, this._uuid2mtime = {}, this._uuid2path = {}, this._uuid2meta = {}, this._path2uuid = {}, this._paths = [], this._pathsDirty = !0, this._extname2infos = {}, this._importPath = a.join(this.library, "imports"), e.ensureDirSync(this._importPath), this._uuid2mtimePath = a.join(this.library, "uuid-to-mtime.json");
        try {
            this._uuid2mtime = JSON.parse(e.readFileSync(this._uuid2mtimePath))
        } catch (t) {
            "ENOENT" !== t.code && this.warn(`Failed to parse ${this._uuid2mtimePath}: ${t.message}.`)
        }
        this._genTaskID = -1, this._curTask = null, this._tasks = r.queue((s, i) => {
            let e = s.name;
            s.params.length > 0 && (e += " ");
            for (let t = 0; t < s.params.length; ++t) e += n(s.params[t], 20), t !== s.params.length - 1 && (e += ", ");
            let a = function (s) {
                this._curTask.silent || s || this.success("done!"), this._curTask = null;
                try {
                    i.apply(null, arguments)
                } catch (t) {
                    this.failed("Exception ", t.stack)
                }
                t && t.Window.main && this._tasks.idle() && this._dispatchEvent("asset-db:state-changed", "idle")
            }.bind(this);
            s.params.unshift(this), s.params.push(a), s.id = ++this._genTaskID % 100;
            try {
                t && t.Window.main && this._dispatchEvent("asset-db:state-changed", "busy"), s.silent || this.log("[db-task][%s] running...", e), this._curTask = s, s.run.apply(this, s.params)
            } catch (s) {
                this.failed("Exception ", s.stack), this._curTask = null, i(s), t && t.Window.main && this._tasks.idle() && this._dispatchEvent("asset-db:state-changed", "idle")
            }
        }, 1)
    }
    i.inherits(u, s), h.assign(u.prototype, require("./lib/utils")), h.assign(u.prototype, require("./lib/interface")), h.assign(u.prototype, require("./lib/internal")), t && t.isMainProcess && h.assign(u.prototype, require("./core/watch")), module.exports = u
})();