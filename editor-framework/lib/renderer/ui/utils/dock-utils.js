"use strict";
let e = {};
module.exports = e;
const t = require("electron"),
    r = require("async"),
    i = require("../../editor"),
    o = require("../../console"),
    n = require("../../ipc"),
    l = require("../../panel"),
    a = require("../../window"),
    d = require("./dom-utils"),
    c = require("./drag-drop");
let u = null,
    s = [],
    f = null,
    p = 0,
    h = !1;

function g(e) {
    let t = [];
    for (let r = 0; r < e.children.length; ++r) {
        let i = e.children[r].id;
        t.push(i)
    }
    return t
}

function m(e, t, r, i, o) {
    f || ((f = document.createElement("div")).classList.add("dock-mask"), f.oncontextmenu = function () {
        return !1
    }), "dock" === e ? (f.classList.remove("tab"), f.classList.add("dock")) : "tab" === e && (f.classList.remove("dock"), f.classList.add("tab")), f.style.left = `${t}px`, f.style.top = `${r}px`, f.style.width = `${i}px`, f.style.height = `${o}px`, f.parentElement || document.body.appendChild(f)
}

function w() {
    f && f.remove(), u = null, p = 0
}
e.root = null, Object.defineProperty(e, "resizerSpace", {
    enumerable: !0,
    get: () => 3
}), Object.defineProperty(e, "tabbarSpace", {
    enumerable: !0,
    get: () => 22
}), Object.defineProperty(e, "panelSpace", {
    enumerable: !0,
    get: () => 4
}), e.dragstart = function (e, t) {
    let r = t.frameEL,
        i = r.id,
        o = r.parentNode,
        n = o.getBoundingClientRect(),
        l = {
            panelID: i,
            panelRectWidth: n.width,
            panelRectHeight: n.height,
            panelPreferredWidth: o._preferredWidth,
            panelPreferredHeight: o._preferredHeight
        };
    c.start(e.dataTransfer, {
        effect: "move",
        type: "tab",
        items: l
    })
}, e.dragend = function () {
    w(), c.end()
}, e.dragoverTab = function (e) {
    a.focus(), s = [], u = null, f && f.remove();
    let t = e.getBoundingClientRect();
    m("tab", t.left, t.top, t.width, t.height + 2)
}, e.dragleaveTab = function () {
    f && f.remove()
}, e.dropTab = function (t, r) {
    let i = c.items()[0].panelID,
        n = l.find(i);
    if (n) {
        let i = n.parentNode,
            o = t.panelEL,
            a = i !== o,
            d = i.$tabs.findTab(n);
        a && i.closeNoCollapse(d);
        let c = o.insert(d, n, r);
        o.select(c), a && i._collapse(), w(), e.finalize(), e.saveLayout(), n.focus(), l.isDirty(n.id) && o.outOfDate(n)
    } else l.close(i, (n, a) => {
        if (n) return o.error(`Failed to close panel ${i}: ${n.stack}`), void 0;
        a && l.newFrame(i, (i, n) => {
            if (i) return o.error(i.stack), void 0;
            window.updateEngineSupport && window.updateEngineSupport(n._info.engineSupport), window.requestAnimationFrame(() => {
                let i = t.panelEL,
                    a = document.createElement("ui-dock-tab");
                a.name = n.name;
                let d = i.insert(a, n, r);
                i.select(d), l.dock(n), w(), e.finalize(), e.saveLayout(), n.focus(), l.isDirty(n.id) && i.outOfDate(n), n.load(e => {
                    if (e) return o.error(e.stack), void 0;
                    n.ready && n.ready()
                })
            })
        })
    })
}, e.dragoverDock = function (e) {
    "tab" === c.type() && s.push(e)
}, e.dragenterMainDock = function () {
    ++p
}, e.dragleaveMainDock = function () {
    0 === --p && f && f.remove()
}, e.dragoverMainDock = function (e, t) {
    a.focus();
    let r = null;
    u = null;
    for (let i = 0; i < s.length; ++i) {
        let o = s[i],
            n = o.getBoundingClientRect(),
            l = n.left + n.width / 2,
            a = n.top + n.height / 2,
            d = null,
            c = Math.abs(e - n.left),
            f = Math.abs(e - n.right),
            p = Math.abs(t - n.top),
            h = Math.abs(t - n.bottom),
            g = 100,
            m = -1;
        c < g && (g = c, m = Math.abs(t - a), d = "left"), f < g && (g = f, m = Math.abs(t - a), d = "right"), p < g && (g = p, m = Math.abs(e - l), d = "top"), h < g && (g = h, m = Math.abs(e - l), d = "bottom"), null !== d && (null === r || m < r) && (r = m, u = {
            target: o,
            position: d
        })
    }
    if (u) {
        let e = c.items()[0],
            t = u.target.getBoundingClientRect(),
            r = null,
            i = e.panelPreferredWidth,
            o = e.panelPreferredHeight,
            n = i;
        n >= Math.floor(t.width) && (n = Math.floor(.5 * t.width));
        let l = o;
        l >= Math.floor(t.height) && (l = Math.floor(.5 * t.height)), "top" === u.position ? r = {
            left: t.left,
            top: t.top,
            width: t.width,
            height: l
        } : "bottom" === u.position ? r = {
            left: t.left,
            top: t.bottom - l,
            width: t.width,
            height: l
        } : "left" === u.position ? r = {
            left: t.left,
            top: t.top,
            width: n,
            height: t.height
        } : "right" === u.position && (r = {
            left: t.right - n,
            top: t.top,
            width: n,
            height: t.height
        }), m("dock", r.left, r.top, r.width, r.height)
    } else f && f.remove();
    s = []
}, e.dropMainDock = function (t) {
    if (null === u) return;
    let r = t.panelID,
        i = t.panelRectWidth,
        n = t.panelRectHeight,
        a = t.panelPreferredWidth,
        d = t.panelPreferredHeight,
        c = u.target,
        s = u.position,
        f = l.find(r);
    if (!f) return l.close(r, (t, i) => {
        if (t) return o.error(`Failed to close panel ${r}: ${t.stack}`), void 0;
        i && l.newFrame(r, (t, r) => {
            if (t) return o.error(t.stack), void 0;
            window.requestAnimationFrame(() => {
                let t = document.createElement("ui-dock-panel");
                t.add(r), t.select(0), t._preferredWidth = a, t._preferredHeight = d, c.addDock(s, t), l.dock(r), w(), e.finalize(), e.saveLayout(), r.focus(), l.isDirty(r.id) && t.outOfDate(r), r.load(e => {
                    if (e) return o.error(e.stack), void 0;
                    r.ready && r.ready()
                })
            })
        })
    }), void 0;
    let p = f.parentNode;
    if (c === p && 1 === c.tabCount) return;
    let h = p.parentNode,
        g = h === c.parentNode,
        m = p.$tabs.findTab(f);
    p.closeNoCollapse(m);
    let v = document.createElement("ui-dock-panel");
    v.add(f), v.select(0), v._preferredWidth = a, v._preferredHeight = d, c.addDock(s, v, g);
    let y = 0 === p.children.length;
    if (p._collapse(), y) {
        let e = !1;
        if (v.parentNode !== h) {
            let t = v,
                r = v.parentNode;
            for (; r && r._dockable;) {
                if (r === h) {
                    e = !0;
                    break
                }
                t = r, r = r.parentNode
            }
            if (e) {
                let e = 0;
                h.row ? (e = t.offsetWidth + 3 + i, t._preferredWidth = e) : (e = t.offsetHeight + 3 + n, t._preferredHeight = e), t.style.flex = `0 0 ${e}px`
            }
        }
    }
    w(), e.finalize(), e.saveLayout(), f.focus(), l.isDirty(f.id) && v.outOfDate(f)
}, e.collapse = function () {
    e.root && e.root._collapseRecursively()
}, e.finalize = function () {
    e.root && (e.root._finalizeMinMaxRecursively(), e.root._finalizePreferredSizeRecursively(), e.root._finalizeStyleRecursively(), e.root._reflowRecursively(), e.root._updatePreferredSizeRecursively(), e.root._notifyResize(), function () {
        let r = e.root;
        if (!r) return;
        let i = t.remote.getCurrentWindow(),
            o = i.getSize(),
            n = o[0],
            l = o[1],
            a = window.innerWidth - r.clientWidth,
            d = window.innerHeight - r.clientHeight,
            c = r._computedMinWidth + a,
            u = r._computedMinHeight + d;
        a = n - window.innerWidth, d = l - window.innerHeight, c += a, u += d, i.setMinimumSize(c, u), n < c && (n = c);
        l < u && (l = u);
        i.setSize(n, l)
    }())
}, e.resize = function () {
    e.root && (e.root._reflowRecursively(), e.root._notifyResize(), window.requestAnimationFrame(() => {
        e.root._updatePreferredSizeRecursively()
    }))
}, e.reset = function (t, n, a) {
    h = !0, r.waterfall([e => {
        l._unloadAll(e)
    }, e => {
        if (d.clear(t), !n || !n.type || 0 !== n.type.indexOf("dock")) return e(null, []), void 0;
        "dock-v" === n.type ? t.row = !1 : "dock-h" === n.type && (t.row = !0);
        let r = [];
        (function e(t, r, i) {
            if (!r) return;
            for (let o = 0; o < r.length; ++o) {
                let n, l = r[o];
                if ("dock-v" === l.type ? (n = document.createElement("ui-dock")).row = !1 : "dock-h" === l.type ? (n = document.createElement("ui-dock")).row = !0 : "panel" === l.type && (n = document.createElement("ui-dock-panel")), n) {
                    if (void 0 !== l.width && (n._preferredWidth = l.width), void 0 !== l.height && (n._preferredHeight = l.height), "panel" === l.type)
                        for (let e = 0; e < l.children.length; ++e) i.push({
                            dockEL: n,
                            panelID: l.children[e],
                            active: e === l.active
                        });
                    else e(n, l.children, i);
                    t.appendChild(n)
                } else Editor.warn(`Failed to create layout from ${l}`)
            }
            t._initResizers()
        })(t, n.children, r), e(null, r)
    }, (t, i) => {
        let n = [],
            a = Editor.remote.Window.windows;
        r.each(t, (e, t) => {
            a.some(t => -1 !== t._panels.indexOf(e.panelID)) && l.close(e.panelID), l.newFrame(e.panelID, (r, i) => {
                if (r) return o.error(r.stack), t(), void 0;
                let a = e.dockEL;
                a.add(i), e.active && a.select(i), l.dock(i), n.push(i), t()
            })
        }, t => {
            h = !1, e.collapse(), e.finalize(), e.saveLayout(), i(t, n)
        })
    }, (e, t) => {
        let r = i.argv && i.argv.panelID && i.argv.panelArgv;
        e.forEach(e => {
            e.load(t => {
                if (t) return o.error(t.stack), void 0;
                e.ready && e.ready(), r && i.argv.panelID === e.id && e.run && e.run(i.argv.panelArgv)
            })
        }), t()
    }], e => {
        a && a(e)
    })
}, e.saveLayout = function () {
    h || window.requestAnimationFrame(() => {
        n.sendToMain("editor:window-save-layout", e.dumpLayout())
    })
}, e.dumpLayout = function () {
    let t = e.root;
    if (!t) return null;
    if (t._dockable) {
        return {
            type: t.row ? "dock-h" : "dock-v",
            children: function t(r) {
                let i = [];
                for (let o = 0; o < r.children.length; ++o) {
                    let n = r.children[o];
                    if (!n._dockable) continue;
                    let l = n.getBoundingClientRect(),
                        a = {
                            width: l.width,
                            height: l.height
                        };
                    if (e.isPanel(n)) a.type = "panel", a.active = n.activeIndex, a.children = g(n);
                    else {
                        let e = n.row ? "dock-h" : "dock-v";
                        a.type = e, a.children = t(n)
                    }
                    i.push(a)
                }
                return i
            }(t)
        }
    } {
        let e = t.getAttribute("id"),
            r = t.getBoundingClientRect();
        return {
            type: "standalone",
            panel: e,
            width: r.width,
            height: r.height
        }
    }
}, e.isPanel = function (e) {
    return "UI-DOCK-PANEL" === e.tagName
}, e.isPanelFrame = function (e) {
    return "UI-PANEL-FRAME" === e.tagName
}, e.isResizer = function (e) {
    return "UI-DOCK-RESIZER" === e.tagName
}, e.isTab = function (e) {
    return "UI-DOCK-TAB" === e.tagName
}, e.isTabBar = function (e) {
    return "UI-DOCK-TABS" === e.tagName
}, t.ipcRenderer.on("editor:reset-layout", (t, r, i) => {
    if (i) return n.sendToMain("editor:window-save-layout", r, () => {
        t.reply && t.reply()
    }), void 0;
    n._closeAllSessions(), e.reset(e.root, r, e => {
        e && o.error(`Failed to reset layout: ${e.stack}`)
    })
}), window.addEventListener("resize", () => {
    e.resize()
});