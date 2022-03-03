"use strict";
let e = {};
module.exports = e;
const t = require("lodash"),
    n = require("../../console"),
    o = require("./resource-mgr"),
    r = require("./dock-utils");
let u = null,
    i = null,
    l = null,
    s = null,
    c = null,
    a = null,
    d = ["mousedown", "mousemove", "mouseup", "click"],
    f = [0, 1, 4, 2],
    m = function () {
        try {
            return 1 === new MouseEvent("test", {
                buttons: 1
            }).buttons
        } catch (e) {
            return !1
        }
    }();

function p(e) {
    var t = e.type;
    if (-1 === d.indexOf(t)) return !1;
    if ("mousemove" === t) {
        var n = void 0 === e.buttons ? 1 : e.buttons;
        return e instanceof window.MouseEvent && !m && (n = f[e.which] || 0), Boolean(1 & n)
    }
    return 0 === (void 0 === e.button ? 0 : e.button)
}
e.createStyleElement = function (e) {
    let t = o.getResource(e) || "";
    if (!t) return n.error(`${e} not preloaded`), null;
    let r = document.createElement("style");
    return r.type = "text/css", r.textContent = t, r
}, e.clear = function (e) {
    for (; e.firstChild;) e.removeChild(e.firstChild)
}, e.index = function (e) {
    let t = e.parentNode;
    for (let n = 0, o = t.children.length; n < o; ++n)
        if (t.children[n] === e) return n;
    return -1
}, e.parentElement = function (e) {
    let t = e.parentElement;
    if (!t && (t = e.parentNode) && t.host) return t.host
}, e.offsetTo = function (e, t) {
    let o = 0,
        r = 0;
    for (; e && e !== t;) o += e.offsetLeft - e.scrollLeft, r += e.offsetTop - e.scrollTop, e = e.offsetParent;
    return t && e !== t ? (n.warn("The parentEL is not the element's offsetParent"), {
        x: 0,
        y: 0
    }) : {
        x: o,
        y: r
    }
}, e.walk = function (e, t, n) {
    let o = t;
    if ("function" == typeof t && (n = t, o = {}), !o.excludeSelf) {
        if (n(e)) return
    }
    if (!e.children.length) return;
    let r = e,
        u = e.children[0];
    for (;;) {
        if (!u) {
            if ((u = r) === e) return;
            r = r.parentElement, u = u.nextElementSibling
        }
        if (u) {
            if (n(u)) {
                u = u.nextElementSibling;
                continue
            }
            u.children.length ? (r = u, u = u.children[0]) : u = u.nextElementSibling
        }
    }
}, e.fire = function (e, t, n) {
    n = n || {}, e.dispatchEvent(new window.CustomEvent(t, n))
}, e.acceptEvent = function (e) {
    e.preventDefault(), e.stopImmediatePropagation()
}, e.installDownUpEvent = function (t) {
    function n(e, t) {
        document.removeEventListener("mousemove", e), document.removeEventListener("mouseup", t)
    }
    t.addEventListener("mousedown", function (o) {
        if (e.acceptEvent(o), !p(o)) return;
        let r = function o(r) {
                p(r) || (e.fire(t, "up", {
                    sourceEvent: r,
                    bubbles: !0
                }), n(o, u))
            },
            u = function o(u) {
                p(u) && (e.fire(t, "up", {
                    sourceEvent: u,
                    bubbles: !0
                }), n(r, o))
            };
        (function (e, t) {
            document.addEventListener("mousemove", e), document.addEventListener("mouseup", t, !0)
        })(r, u), e.fire(t, "down", {
            sourceEvent: o,
            bubbles: !0
        })
    })
}, e.inDocument = function (e) {
    for (;;) {
        if (!e) return !1;
        if (e === document) return !0;
        (e = e.parentNode) && e.host && (e = e.host)
    }
}, e.inPanel = function (e) {
    for (;;) {
        if (!e) return null;
        if (r.isPanelFrame(e)) return e;
        (e = e.parentNode) && e.host && (e = e.host)
    }
}, e.isVisible = function (e) {
    let t = window.getComputedStyle(e);
    return "none" !== t.display && "hidden" !== t.visibility && 0 !== t.opacity
}, e.isVisibleInHierarchy = function (t) {
    if (!1 === e.inDocument(t)) return !1;
    for (;;) {
        if (t === document) return !0;
        if (!1 === e.isVisible(t)) return !1;
        (t = t.parentNode) && t.host && (t = t.host)
    }
}, e.startDrag = function (t, n, o, r, i) {
    e.addDragGhost(t), n.stopPropagation();
    let l = n.button,
        s = n.clientX,
        c = n.clientX,
        a = n.clientY,
        d = n.clientY,
        f = 0,
        m = 0,
        p = 0,
        v = 0,
        h = function (e) {
            e.stopPropagation(), f = e.clientX - c, p = e.clientY - d, m = e.clientX - s, v = e.clientY - a, c = e.clientX, d = e.clientY, o && o(e, f, p, m, v)
        },
        b = function (t) {
            t.stopPropagation(), t.button === l && (document.removeEventListener("mousemove", h), document.removeEventListener("mouseup", b), document.removeEventListener("mousewheel", E), e.removeDragGhost(), f = t.clientX - c, p = t.clientY - d, m = t.clientX - s, v = t.clientY - a, u = null, r && r(t, f, p, m, v))
        },
        E = function (e) {
            i && i(e)
        };
    u = function () {
        document.removeEventListener("mousemove", h), document.removeEventListener("mouseup", b), document.removeEventListener("mousewheel", E), e.removeDragGhost()
    }, document.addEventListener("mousemove", h), document.addEventListener("mouseup", b), document.addEventListener("mousewheel", E)
}, e.cancelDrag = function () {
    u && u()
}, e.addDragGhost = function (e) {
    return null === i && ((i = document.createElement("div")).classList.add("drag-ghost"), i.style.position = "absolute", i.style.zIndex = "999", i.style.top = "0", i.style.right = "0", i.style.bottom = "0", i.style.left = "0", i.oncontextmenu = function () {
        return !1
    }), i.style.cursor = e, document.body.appendChild(i), i
}, e.removeDragGhost = function () {
    null !== i && (i.style.cursor = "auto", null !== i.parentElement && i.parentElement.removeChild(i))
}, e.addHitGhost = function (e, t, n) {
    return null === l && ((l = document.createElement("div")).classList.add("hit-ghost"), l.style.position = "absolute", l.style.zIndex = t, l.style.top = "0", l.style.right = "0", l.style.bottom = "0", l.style.left = "0", l.oncontextmenu = function () {
        return !1
    }), l.style.cursor = e, s = function (e) {
        e.preventDefault(), e.stopPropagation(), n && n()
    }, l.addEventListener("mousedown", s), document.body.appendChild(l), l
}, e.removeHitGhost = function () {
    null !== l && (l.style.cursor = "auto", null !== l.parentElement && (l.parentElement.removeChild(l), l.removeEventListener("mousedown", s), s = null))
}, e.addLoadingMask = function (e, t) {
    null === c && ((c = document.createElement("div")).classList.add("loading-mask"), c.style.position = "absolute", c.style.top = "0", c.style.right = "0", c.style.bottom = "0", c.style.left = "0", c.oncontextmenu = function () {
        return !1
    }), e && "string" == typeof e.zindex ? c.style.zIndex = e.zindex : c.style.zIndex = "1999", e && "string" == typeof e.background ? c.style.backgroundColor = e.background : c.style.backgroundColor = "rgba(0,0,0,0.2)", e && "string" == typeof e.cursor ? c.style.cursor = e.cursor : c.style.cursor = "default";
    return c.addEventListener("mousedown", function (e) {
        e.preventDefault(), e.stopPropagation(), t && t()
    }), document.body.appendChild(c), c
}, e.removeLoadingMask = function () {
    null !== c && (c.style.cursor = "auto", null !== c.parentElement && (c.parentElement.removeChild(c), c.removeEventListener("mousedown", a), a = null))
}, e.toHumanText = function (e) {
    let t = e.replace(/[-_]([a-z])/g, function (e) {
        return e[1].toUpperCase()
    });
    return " " === (t = t.replace(/([a-z][A-Z])/g, function (e) {
        return e[0] + " " + e[1]
    })).charAt(0) && t.slice(1), t.charAt(0).toUpperCase() + t.slice(1)
}, e.camelCase = function (e) {
    return t.camelCase(e)
}, e.kebabCase = function (e) {
    return t.kebabCase(e)
}, e._focusParent = function (e) {
    let t = e.parentElement;
    for (; t;) {
        if (null !== t.tabIndex && void 0 !== t.tabIndex && -1 !== t.tabIndex) return t.focus(), void 0;
        t = t.parentElement
    }
}, e._getFirstFocusableChild = function (t) {
    if (null !== t.tabIndex && void 0 !== t.tabIndex && -1 !== t.tabIndex) return t;
    for (let n = 0; n < t.children.length; ++n) {
        let o = e._getFirstFocusableChild(t.children[n]);
        if (null !== o) return o
    }
    return null
};