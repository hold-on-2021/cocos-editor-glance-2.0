"use strict";
let e = {};
module.exports = e;
const t = require("electron"),
    n = require("./dom-utils"),
    l = require("./dock-utils");
let s = null,
    u = null,
    o = null,
    i = null,
    r = !1;
e._isNavigable = function (e) {
    return e.focusable && !e.disabled && !e.unnavigable
}, e._focusPrev = function () {
    let t, n, l;
    if (s ? (t = s.root, n = s._focusedElement, l = s._lastFocusedElement) : (t = document.body, n = o, l = i), !n) return l ? (e._setFocusElement(l), !0) : (t && (n = e._getFirstFocusableFrom(t, !0), e._setFocusElement(n)), void 0);
    let u, r = n;
    for (;
        (u = e._getPrevFocusable(r)) && u._getFirstFocusableElement() === r;) r = u;
    return !!u && (e._setFocusElement(u), !0)
}, e._focusNext = function () {
    let t, n, l;
    if (s ? (t = s.root, n = s._focusedElement, l = s._lastFocusedElement) : (t = document.body, n = o, l = i), !n) return l ? (e._setFocusElement(l), !0) : (t && (n = e._getFirstFocusableFrom(t, !0), e._setFocusElement(n)), void 0);
    let u = e._getNextFocusable(n);
    return !!u && (e._setFocusElement(u), !0)
}, e._focusParent = function (t) {
    let n = e._getFocusableParent(t);
    n && (l.isPanel(n) ? (e._setFocusElement(null), n.activeTab.frameEL.focus()) : e._setFocusElement(n))
}, e._setFocusPanelFrame = function (e) {
    let t, n;
    e && o && (i = o, o._setFocused(!1), o = null), s && (t = s.parentElement), e && (n = e.parentElement), t !== n && (t && t._setFocused(!1), n && n._setFocused(!0)), s !== e && (s && (s.blur(), s._focusedElement && s._focusedElement._setFocused(!1)), u = s, s = e, e && (e.focus(), e._focusedElement && e._focusedElement._setFocused(!0)))
}, e._refocus = function () {
    if (s) {
        let t = s.parentElement;
        if (!t) return e._setFocusPanelFrame(null), void 0;
        if (t._setFocused(!0), s._focusedElement) {
            return s._focusedElement._getFirstFocusableElement().focus(), void 0
        }
        s.focus()
    }
}, e._setFocusElement = function (t) {
    if (t && l.isPanel(t)) return t.focus(), void 0;
    let u = n.inPanel(t);
    if (t && !u && (e._setFocusPanelFrame(null), o !== t && (o && o._setFocused(!1), i = o, o = t, t && t._setFocused(!0))), u && l.isPanelFrame(u) && e._setFocusPanelFrame(u), t || s || o && (i = o, o._setFocused(!1), o = null), s) {
        o && (i = o, o._setFocused(!1), o = null);
        let e = s._focusedElement;
        e !== t && (e && e._setFocused(!1), s._lastFocusedElement = e, s._focusedElement = t, t ? t._setFocused(!0) : s.focus())
    }
}, e._getFirstFocusableFrom = function (t, l) {
    if (!l) {
        if (!n.isVisible(t)) return null;
        if (e._isNavigable(t)) return t
    }
    let s = t,
        u = t;
    if (!u.children.length) return null;
    for (u = u.children[0];;) {
        if (!u) {
            if (u = s, !s || u === t) return null;
            s = s.parentElement, u = u.nextElementSibling
        }
        if (u)
            if (n.isVisible(u)) {
                if (e._isNavigable(u)) return u;
                u.children.length ? (s = u, u = u.children[0]) : u = u.nextElementSibling
            } else u = u.nextElementSibling
    }
}, e._getLastFocusableFrom = function (t, l) {
    let s = null;
    if (!l) {
        if (!n.isVisible(t)) return null;
        e._isNavigable(t) && (s = t)
    }
    let u = t,
        o = t;
    if (!o.children.length) return s;
    for (o = o.children[0];;) {
        if (!o) {
            if ((o = u) === t) return s;
            u = u.parentElement, o = o.nextElementSibling
        }
        o && (n.isVisible(o) ? (e._isNavigable(o) && (s = o), o.children.length ? (u = o, o = o.children[0]) : o = o.nextElementSibling) : o = o.nextElementSibling)
    }
}, e._getFocusableParent = function (e) {
    let t = e.parentNode;
    for (t.host && (t = t.host); t;) {
        if (t.focusable && !t.disabled) return t;
        (t = t.parentNode) && t.host && (t = t.host)
    }
    return null
}, e._getNextFocusable = function (t) {
    let n = e._getFirstFocusableFrom(t, !0);
    if (n) return n;
    let l = t.parentElement,
        s = t.nextElementSibling;
    for (;;) {
        if (!s) {
            if (null === (s = l)) return null;
            l = l.parentElement, s = s.nextElementSibling
        }
        if (s) {
            if (n = e._getFirstFocusableFrom(s)) return n;
            s = s.nextElementSibling
        }
    }
}, e._getPrevFocusable = function (t) {
    let n, l = t.parentElement,
        s = t.previousElementSibling;
    for (;;) {
        if (!s) {
            if (null === (s = l)) return null;
            if (s.focusable && !s.disabled) return s;
            l = l.parentElement, s = s.previousElementSibling
        }
        if (s) {
            if (n = e._getLastFocusableFrom(s)) return n;
            s = s.previousElementSibling
        }
    }
}, Object.defineProperty(e, "lastFocusedPanelFrame", {
    enumerable: !0,
    get: () => u
}), Object.defineProperty(e, "focusedPanelFrame", {
    enumerable: !0,
    get: () => s
}), Object.defineProperty(e, "lastFocusedElement", {
    enumerable: !0,
    get: () => s ? s._lastFocusedElement : i
}), Object.defineProperty(e, "focusedElement", {
    enumerable: !0,
    get: () => s ? s._focusedElement : o
}), Object.defineProperty(e, "disabled", {
    enumerable: !0,
    get: () => r,
    set(e) {
        r = e
    }
}), window.addEventListener("mousedown", t => {
    r || 1 === t.which && (e._setFocusElement(null), e._setFocusPanelFrame(null))
}), window.addEventListener("focus", () => {
    r || (e._setFocusElement(i), e._setFocusPanelFrame(u))
}), window.addEventListener("blur", () => {
    r || (i = o, u = s, s || e._setFocusElement(null), e._setFocusPanelFrame(null))
}), window.addEventListener("keydown", u => {
    if (!r && 9 === u.keyCode) {
        if (u.ctrlKey || u.metaKey) return;
        if (s && !l.isPanelFrame(s)) return;
        let o;
        n.acceptEvent(u), o = u.shiftKey ? e._focusPrev() : e._focusNext(), e.focusedElement && e.focusedElement._navELs[0].focus(), o || t.shell.beep()
    }
}, !0), window.addEventListener("keydown", l => {
    if (!r)
        if (38 === l.keyCode) {
            n.acceptEvent(l), e._focusPrev() || t.shell.beep()
        } else if (40 === l.keyCode) {
        n.acceptEvent(l), e._focusNext() || t.shell.beep()
    }
});