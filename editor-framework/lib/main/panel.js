"use strict";
let e = {};
module.exports = e;
const n = require("electron"),
    i = require("./window"),
    t = require("./console"),
    o = require("./package"),
    l = require("fire-path");
e.templateUrl = "editor-framework://static/window.html", e.open = function (n, r) {
    "string" == typeof n && (n = [n]);
    let a = [];
    for (let e = 0; e < n.length; ++e) {
        let i = n[e],
            r = o.panelInfo(i);
        if (r) {
            let e = l.extname(r.main);
            if ("simple" === r.type && ".html" !== e) {
                t.error(`Failed to open panel ${i}, ${r.main} file type needs to be html`);
                continue
            }
            a.push(i)
        } else t.error(`Failed to open panel ${i}, panel info not found.`)
    }
    if (0 === a.length) return;
    let d = a[0],
        p = o.panelInfo(d),
        s = e.findWindow(d);
    if (s) return s.show(), s.focus(), s.send("editor:panel-run", d, r), void 0;
    let h = `window-${(new Date).getTime()}`,
        f = !0;
    "simple" === p.type && (f = p.devTools);
    let u = {
            useContentSize: !0,
            width: parseInt(p.width),
            height: parseInt(p.height),
            minWidth: parseInt(p["min-width"]),
            minHeight: parseInt(p["min-height"]),
            maxWidth: parseInt(p["max-width"]),
            maxHeight: parseInt(p["max-height"]),
            frame: p.frame,
            resizable: p.resizable,
            save: void 0 === p.save || p.save,
            webPreferences: {
                devTools: f
            }
        },
        w = !0,
        c = i.getPanelWindowState(d);
    c && (c.x && (u.x = parseInt(c.x)), c.y && (u.y = parseInt(c.y)), c.width && (w = !1, u.width = parseInt(c.width)), c.height && (w = !1, u.height = parseInt(c.height))), u.windowType = p.type || "dockable", u.resizable || (w = !0, u.width = parseInt(p.width), u.height = parseInt(p.height)), isNaN(u.width) && (u.width = 400), isNaN(u.height) && (u.height = 400), isNaN(u.minWidth) && (u.minWidth = 200), isNaN(u.minHeight) && (u.minHeight = 200), (s = new i(h, u)).nativeWin.setMenuBarVisibility(!1), w ? s.nativeWin.setContentSize(u.width, u.height) : s.nativeWin.setSize(u.width, u.height);
    let m = [];
    for (let n = 0; n < a.length; ++n) {
        let i = a[n];
        e.findWindow(i) || (s._addPanel(i), m.push(i))
    }
    if ("simple" === p.type) {
        let e = d.split(".");
        s.load(`packages://${e[0]}/${p.main}`, r)
    } else s._layout = {
        type: "dock-v",
        children: [{
            type: "panel",
            active: 0,
            children: m
        }]
    }, s.load(e.templateUrl, {
        panelID: d,
        panelArgv: r,
        engineSupport: p.engineSupport
    });
    s.focus()
}, e.close = function (n, i) {
    let l = e.findWindow(n);
    if (!l) return i && i(new Error(`Can not find panel ${n} in main process.`)), void 0;
    let r = o.panelInfo(n);
    return r ? "simple" === r.type ? (l.close(), i && i(null, !0), void 0) : (l.send("editor:panel-unload", n, (e, t) => e ? (i && i(e), void 0) : t ? (l.isMainWindow || 1 !== l.panels.length || l.close(), l._removePanel(n), i && i(null, !0), void 0) : (i && i(null, !1), void 0), -1), void 0) : (t.error(`Failed to close panel ${n}, panel info not found.`), void 0)
}, e.popup = function (n) {
    let i = e.findWindow(n);
    i && (i.panels.length <= 1 || e.close(n, (i, o) => {
        if (i) return t.error(`Failed to close panel ${n}: ${i.stack}`), void 0;
        o && e.open(n)
    }))
}, e.findWindow = function (e) {
    for (let n = 0; n < i.windows.length; ++n) {
        let t = i.windows[n];
        if (-1 !== t.panels.indexOf(e)) return t
    }
    return null
};
const r = n.ipcMain;
r.on("editor:panel-query-info", (e, n) => {
    if (!n) return t.error("A `editor:panel-query-info` message failed because the panelID is null or undefined."), e.reply(new Error("Invalid panelID")), void 0;
    let i = o.panelInfo(n);
    if (!i) return e.reply(new Error(`Panel info not found for panel ${n}`)), void 0;
    e.reply(null, i)
}), r.on("editor:panel-open", (n, i, t) => {
    e.open(i, t)
}), r.on("editor:panel-dock", (e, t) => {
    let o = n.BrowserWindow.fromWebContents(e.sender);
    i.find(o)._addPanel(t)
}), r.on("editor:panel-close", (n, i) => {
    e.close(i, (e, i) => {
        n.reply && n.reply(e, i)
    })
}), r.on("editor:panel-popup", (n, i) => {
    e.popup(i)
});