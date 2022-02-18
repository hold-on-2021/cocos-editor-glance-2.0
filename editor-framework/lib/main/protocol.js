"use strict";
let e = {};
module.exports = e;
const t = require("electron"),
    r = require("fire-url"),
    o = require("fire-path"),
    a = require("fire-fs"),
    i = require("./console");
let n = ["http:", "https:", "ftp:", "ssh:", "file:"],
    s = {};
e.init = function (e) {
    const i = t.protocol;

    function n(e) {
        return t => t.pathname ? o.join(e, t.hostname, t.pathname) : o.join(e, t.hostname)
    }
    i.registerFileProtocol("editor-framework", (t, a) => {
        if (!t.url) return a(-3), void 0;
        let i = decodeURIComponent(t.url),
            n = r.parse(i),
            s = n.hostname;
        n.pathname && (s = o.join(s, n.pathname)), a({
            path: o.join(e.frameworkPath, s)
        })
    }, t => {
        if (t) return e.failed("Failed to register protocol editor-framework, %s", t.message), void 0;
        e.success("protocol editor-framework registered")
    }), i.registerFileProtocol("app", (t, a) => {
        if (!t.url) return a(-3), void 0;
        let i = decodeURIComponent(t.url),
            n = r.parse(i),
            s = n.hostname;
        n.pathname && (s = o.join(s, n.pathname)), a({
            path: o.join(e.App.path, s)
        })
    }, t => {
        if (t) return e.failed("Failed to register protocol app, %s", t.message), void 0;
        e.success("protocol app registered")
    }), i.registerFileProtocol("theme", (t, i) => {
        if (!t.url) return i(-3), void 0;
        let n, s = decodeURIComponent(t.url),
            l = r.parse(s),
            p = l.hostname;
        l.pathname && (p = o.join(p, l.pathname));
        for (let t = 0; t < e.themePaths.length; ++t) {
            let r = o.join(e.themePaths[t], e.theme);
            if (a.isDirSync(r)) {
                n = o.join(r, p);
                break
            }
        }
        if (!n) return i(-6);
        i({
            path: n
        })
    }, t => {
        if (t) return e.failed("Failed to register protocol theme, %s", t.message), void 0;
        e.success("protocol theme registered")
    }), i.registerFileProtocol("packages", (t, a) => {
        if (!t.url) return a(-3), void 0;
        let i = decodeURIComponent(t.url),
            n = r.parse(i),
            s = e.Package.packagePath(n.hostname);
        if (!s) return a(-6);
        let l = e.Package.packageInfo(s);
        return l ? 0 === n.pathname.indexOf("/test") ? a({
            path: o.join(s, n.pathname)
        }) : a({
            path: o.join(l._destPath, n.pathname)
        }) : a(-6)
    }, t => {
        if (t) return e.failed("Failed to register protocol packages, %s", t.message), void 0;
        e.success("protocol packages registered")
    }), e.Protocol.register("editor-framework", n(e.frameworkPath)), e.Protocol.register("app", n(e.App.path)), e.Protocol.register("theme", function (t) {
        let r;
        for (let t = 0; t < e.themePaths.length; ++t) {
            let i = o.join(e.themePaths[t], e.theme);
            if (a.isDirSync(i)) {
                r = i;
                break
            }
        }
        return r ? t.pathname ? o.join(r, t.hostname, t.pathname) : o.join(r, t.hostname) : ""
    }), e.Protocol.register("profile", function (t) {
        let r = e.Profile.query(t.hostname);
        return r ? t.pathname ? o.join(r, t.pathname) : r : ""
    }), e.Protocol.register("packages", function (t) {
        let r = e.Package.packagePath(t.hostname);
        return r ? t.pathname ? o.join(r, t.pathname) : r : ""
    })
}, e.url = function (e) {
    if (!e) return null;
    let t = r.parse(e);
    if (!t.protocol) return e;
    if (-1 !== n.indexOf(t.protocol)) return e;
    let o = s[t.protocol];
    return o ? o(t) : (i.error(`Failed to load url ${e}, please register the protocol for it.`), null)
}, e.register = function (e, t) {
    s[e + ":"] = t
};