"use strict";
let e = {};
module.exports = e;
const t = require("electron"),
    r = require("fire-fs"),
    i = require("fire-path"),
    n = require("globby"),
    a = require("chokidar"),
    o = require("async"),
    l = require("minimatch"),
    s = require("lodash"),
    u = require("../app"),
    d = require("./ipc"),
    p = require("./menu"),
    c = require("./protocol"),
    f = require("../profile"),
    h = require("./console"),
    m = require("./window"),
    g = require("./debugger"),
    q = require("./package"),
    w = require("./panel"),
    v = require("./main-menu"),
    k = require("./i18n"),
    y = require("../share/selection"),
    b = require("../share/undo");
let x, T = !1,
    P = "en";

function j(e, t) {
    if (void 0 === t) return !1;
    if ("string" == typeof t && (t = [t]), !Array.isArray(t)) return h.error(`${t} is not a valid patterns.`), !1;
    let r = function (e) {
        let t = [],
            r = [];
        return e.forEach((e, i) => {
            let n = "!" === e[0];
            (n ? r : t).push({
                index: i,
                pattern: n ? e.slice(1) : e
            })
        }), {
            positives: t,
            negatives: r
        }
    }(t);
    if (0 === r.positives.length) return !1;
    let i = !1;
    for (let t in r.positives) {
        let n = r.positives[t].index,
            a = r.positives[t].pattern;
        if (!a || "string" != typeof a) {
            h.warn(`${a} should be a non-empty string.`);
            continue
        }
        if (!l(e, a)) continue;
        let o = !1;
        for (let t in r.negatives) {
            let i = r.negatives[t].index,
                a = r.negatives[t].pattern;
            if (!(i < n) && l(e, a)) {
                o = !0;
                break
            }
        }
        if (!o) {
            i = !0;
            break
        }
    }
    return i
}
Object.defineProperty(e, "isClosing", {
    enumerable: !0,
    get: () => T
}), Object.defineProperty(e, "lang", {
    enumerable: !0,
    set(e) {
        P = e
    },
    get: () => P
}), e.url = c.url, e._quit = function () {
    if (T) return;
    T = !0, x && x.close(), m.windows.forEach(e => {
        e.close()
    }), g.stopRepl(), g.stopNodeInspector(), u.quit ? (u.quit(() => {
        u.emit("quit"), t.app.quit()
    }), e.dev && setTimeout(() => {
        h.warn("You have still not quit your application. Did you forget to invoke the callback function in Editor.App.quit()?")
    }, 5e3)) : (u.emit("quit"), t.app.quit())
}, e.loadPackagesAt = function (e, t) {
    if (-1 === q.paths.indexOf(e)) return h.warn("The package path %s is not registerred", e), void 0;
    let r = n.sync(`${e}/*/package.json`);
    o.eachSeries(r, (e, t) => {
        e = i.normalize(e);
        let r = i.dirname(e);
        q.load(r, e => {
            e && h.failed(`Failed to load package at ${r}: ${e.message}`), t()
        })
    }, () => {
        t && t()
    })
}, e.loadAllPackages = function (e) {
    let t, r = [];
    for (t = 0; t < q.paths.length; ++t) r.push(`${q.paths[t]}/*/package.json`);
    let a = n.sync(r);
    o.eachSeries(a, (e, t) => {
        e = i.normalize(e);
        let r = i.dirname(e);
        q.load(r, e => {
            e && h.failed(`Failed to load package at ${r}: ${e.message}`), t()
        })
    }, () => {
        e && e()
    })
}, e.require = function (t) {
    return require(e.url(t))
}, Object.defineProperty(e, "watcher", {
    enumerable: !0,
    get: () => x
});
let $ = null,
    _ = [];
e.watchPackages = function (e) {
    let t = q.paths.filter(e => !!r.existsSync(e) && (-1 === e.indexOf(".asar/") && -1 === e.indexOf(".asar\\")));
    if (0 === t.length) return e && e(), void 0;
    (x = a.watch(t, {
        ignored: [new RegExp("[\\/\\\\]\\.(?!" + u.name + ")"), /[\/\\]bin/, /[\/\\]test[\/\\](fixtures|playground)/, /[\/\\]node_modules/, /[\/\\]bower_components/],
        ignoreInitial: !0,
        persistent: !0
    })).on("add", e => {
        setTimeout(() => {
            q.load(e)
        }, 100)
    }).on("addDir", e => {
        setTimeout(() => {
            q.load(e)
        }, 100)
    }).on("unlink", e => {
        q.unload(e)
    }).on("unlinkDir", e => {
        q.unload(e)
    }).on("change", e => {
        let t, r = q.packageInfo(e);
        if (!r) return;
        _.some(e => e.path === r._path && (t = e, !0)), t || (t = {
            path: r._path,
            reloadTest: !1,
            reloadRenderer: !1,
            reloadMain: !1
        });
        let n = s.defaults(r.reload, {
                test: ["test/**/*", "tests/**/*"],
                renderer: ["renderer/**/*", "panel/**/*"],
                ignore: [],
                main: []
            }),
            a = i.relative(r._path, e);
        j(a, n.ignore) || (j(a, n.test) ? t.reloadTest = !0 : j(a, n.renderer) ? t.reloadRenderer = !0 : n.main && 0 !== n.main.length && !j(a, n.main) || (t.reloadMain = !0), (t.reloadTest || t.reloadRenderer || t.reloadMain) && (_.includes(t) || _.push(t), $ && (clearTimeout($), $ = null), $ = setTimeout(() => {
            (function (e, t) {
                o.each(e, (e, t) => {
                    let r = q.packageInfo(e.path);
                    if (!r) return t(), void 0;
                    o.series([t => {
                        let i = w.findWindow("tester.panel");
                        if (e.reloadTest) return i && i.send("tester:run-tests", r.name), t(), void 0;
                        if (e.reloadRenderer) {
                            for (let e in r) {
                                if (0 !== e.indexOf("panel")) continue;
                                let t = e.replace(/^panel/, r.name);
                                d.sendToWins("editor:panel-out-of-date", t)
                            }
                            return i && i.send("tester:run-tests", r.name), t(), void 0
                        }
                        if (e.reloadMain) return q.reload(r._path), t(), void 0;
                        t()
                    }], e => {
                        e && h.error("Failed to reload package %s: %s", r.name, e.message), t()
                    })
                }, e => {
                    t && t(e)
                })
            })(_), _ = [], $ = null
        }, 50)))
    }).on("error", e => {
        h.error("Package Watcher Error: %s", e.message)
    }).on("ready", () => {
        e && e()
    })
}, e.init = function (t) {
    t = t || {}, e.reset();
    let n = t["theme-search-path"];
    n && n.length && (e.themePaths = n.map(t => e.url(t))), t.theme && (e.theme = t.theme);
    let a = t.i18n;
    a && (k.clear(), k.extend(a));
    let o = t.profile;
    if (o)
        for (let e in o) r.ensureDirSync(i.join(o[e])), f.register(e, o[e]);
    let l = t["package-search-path"];
    l && l.length && q.addPath(l.map(t => e.url(t)));
    let s = t["main-menu"];
    s && (p.register("main-menu", s, !0), v.init());
    let u = t["panel-window"];
    u && (w.templateUrl = u);
    let d = t.layout || "editor-framework://static/layout.json";
    d && (m.defaultLayoutUrl = d);
    let c = t.selection;
    c && c.length && c.forEach(e => {
        y.register(e)
    });
    let h = t.undo;
    if (h)
        for (let e in h) b.register(e, h[e])
}, e.run = function (t, r) {
    if (!m._restoreWindowStates(r)) {
        let e = new m("main", r = r || {
            show: !1
        });
        m.main = e, e.show(), e.load(t), e.focus()
    }
    let i = m.main;
    i && e.argv.showDevtools && i.nativeWin.webContents.once("did-finish-load", function () {
        i.openDevTools()
    })
}, e.reset = function () {
    e.themePaths = [Editor.url("editor-framework://themes"), Editor.url("app://themes")], e.theme = "default", k.clear();
    let t = `../../static/i18n/${e.lang}`;
    r.existsSync(t + ".js") || (t = "../../static/i18n/en"), k.extend(require(t)), q.resetPath(), v._resetToBuiltin(), w.templateUrl = "editor-framework://static/window.html", m.defaultLayoutUrl = "app://static/layout.json", y.reset(), b.reset()
};