const e = require("path"),
    t = require("fs-extra"),
    a = require("@base/electron-profile"),
    s = require("lodash/isEqual");

function r(e, t) {
    let s = a.load(e),
        r = e.startsWith("default://");
    Object.keys(t).forEach(e => {
        s.get(e) || s.set(e, t[e]), r || s.save()
    })
}

function i(e) {
    return e && "object" == typeof e && !Array.isArray(e)
}

function o(e, t) {
    let s = e.getSelfData();
    return function (e, t) {
        for (let a in t) void 0 !== e[a] ? i(t[a]) && (i(e[a]) || (e[a] = {}), arguments.callee(e[a], t[a])) : i(t[a]) || Array.isArray(t[a]) ? e[a] = JSON.parse(JSON.stringify(t[a])) : e[a] = t[a]
    }(s, a.load(`default://${t}`).get("", {
        type: "current"
    })), s
}
let n = [];
module.exports = {
    addRegisterEvents: function () {
        a.on("change", e => {
            let t = n[e];
            t && t.emit("changed")
        })
    },
    setDefaultData: r,
    loadProfile: function (i, l) {
        let c = n[i];
        if (c) return c;
        let f = e.basename(i);
        const u = Editor.App || Editor.remote.App;
        let d = e.join(u.home, f);
        if (t.existsSync(d))
            if (i.startsWith("global://")) {
                const s = e.join(u.home, "profiles");
                let r = e.join(s, f);
                t.existsSync(r) || t.copySync(d, r), c = a.load(i)
            } else c = a.load(i);
        else c = a.load(i);
        return l && r(i, l), c && (c.getSelfData = function () {
            return this.get("", {
                type: "current"
            })
        }, c._data = o(c, f), Object.defineProperty(c, "data", {
            get() {
                return console.warn(`'${this._type}/${this._file} data' has been deprecated, please use 'profile.get'`), this._data
            }
        }), c.__superSet = c.set, c.set = function (e, t) {
            if (e) this._data[e] = t;
            else if (t)
                for (let e in t) this._data[e] = t[e];
            this.__superSet(e, t)
        }, c.__superRemove = c.remove, c.remove = function (e) {
            delete this._data[e], this.__superRemove(e)
        }, c.__superSave = c.save, c.save = function () {
            s(this._data, this.getSelfData()) || Object.keys(this._data).forEach(e => {
                this.__superSet(e, this._data[e])
            }), this.__superSave()
        }, c.reload = function () {
            console.warn("'profile.reload' has been deprecated, the all data is up to date"), this._data = o(c, f)
        }, c.clear = function () {
            let e = this.getSelfData();
            Object.keys(e).forEach(e => {
                this.remove(e)
            })
        }, c.__superReset = c.reset, c.reset = async function (e) {
            e ? Object.keys(e).forEach(t => {
                this.set(t, e[t])
            }) : (await this.__superReset(), this._data = o(c, f))
        }, n[i] = c), c
    }
};