"use strict";
let e = {};
module.exports = e;
const n = require("electron"),
    o = require("fire-path"),
    t = require("./ui"),
    i = require("./console"),
    r = require("./ipc"),
    l = require("../share/ipc");
let a = {},
    s = [],
    u = l.ErrorNoPanel,
    d = l.ErrorNoMsg;

function c(e) {
    let n = a[e];
    n && (n._ipcListener && n._ipcListener.clear(), n._mousetrapList && n._mousetrapList.forEach(e => {
        e.reset()
    }), delete a[e])
}
e.open = function (e, n) {
    r.sendToMain("editor:panel-open", e, n)
}, e.popup = function (e) {
    r.sendToMain("editor:panel-popup", e)
}, e.close = function (e, n) {
    n ? r.sendToMain("editor:panel-close", e, n, -1) : r.sendToMain("editor:panel-close", e)
}, e.dock = function (e) {
    let n = e.id;
    r.sendToMain("editor:panel-dock", n), a[n] = e
}, e.newFrame = function (e, n) {
    r.sendToMain("editor:panel-query-info", e, (t, i) => {
        if (t) return n(t), void 0;
        let r = document.createElement("ui-panel-frame");
        r._info = i, r.setAttribute("id", e), i.icon && (r.icon = new Image, r.icon.src = o.join(i.path, i.icon)), n(null, r)
    })
}, e.find = function (e) {
    let n = a[e];
    return n || null
}, e.focus = function (n) {
    let o = e.find(n);
    if (o) {
        let e = o.parentNode;
        t.DockUtils.isPanel(e) && e.select(o)
    }
}, e.getFocusedPanel = function () {
    for (let e in a) {
        let n = a[e].parentNode;
        if (n.focused) return n.activeTab.frameEL
    }
    return null
}, e.isDirty = function (e) {
    return -1 !== s.indexOf(e)
}, e.extend = function (e) {
    return e
}, Object.defineProperty(e, "panels", {
    enumerable: !0,
    get() {
        let e = [];
        for (let n in a) {
            let o = a[n];
            e.push(o)
        }
        return e
    }
}), e._dispatch = function (e, n, o, ...t) {
    let r = a[e];
    if (!r) return i.warn(`Failed to send ipc message ${n} to panel ${e}, panel not found`), o.reply && o.reply(new u(e, n)), void 0;
    if (!r.messages) return;
    let l = r.messages[n];
    if (!l || "function" != typeof l) return i.warn(`Failed to send ipc message ${n} to panel ${e}, message not found`), o.reply && o.reply(new d(e, n)), void 0;
    l.apply(r, [o, ...t])
}, e._unloadAll = function (e) {
    let n = [];
    for (let e in a) {
        let o = a[e];
        o && o.close && !1 === o.close() && n.push(e)
    }
    if (0 !== n.length) return e && e(new Error(`Failed to close panel ${n.join(",")}`)), void 0;
    t.clear(t.DockUtils.root);
    for (let e in a) c(e);
    r.sendToMain("editor:window-remove-all-panels", () => {
        e && e()
    }, -1)
};
const p = n.ipcRenderer;
p.on("editor:panel-run", (n, o, t) => {
    e.focus(o);
    let i = e.find(o);
    i && i.run && i.run(t)
}), p.on("editor:panel-unload", (n, o) => {
    let i = e.find(o);
    if (!i) return c(o), n.reply(new Error(`Can not find panel ${o} in renderer process.`)), void 0;
    if (i.close && !1 === i.close()) return n.reply(null, !1), void 0;
    let r = i.parentNode;
    if (t.DockUtils.isPanel(r)) {
        let e = r.$tabs.findTab(i);
        r.close(e)
    } else r.removeChild(i);
    t.DockUtils.finalize(), t.DockUtils.saveLayout(), c(o), window.requestAnimationFrame(() => {
        n.reply(null, !0)
    })
}), p.on("editor:panel-out-of-date", (n, o) => {
    let i = e.find(o);
    if (i) {
        let e = i.parentNode;
        t.DockUtils.isPanel(e) && e.outOfDate(i)
    } - 1 === s.indexOf(o) && s.push(o)
});