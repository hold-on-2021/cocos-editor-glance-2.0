"use strict";
const e = require("../../console"),
    t = require("../utils/dock-utils");
let i = {
    _dockable: !0,
    get noCollapse() {
        return null !== this.getAttribute("no-collapse")
    },
    set noCollapse(e) {
        e ? this.setAttribute("no-collapse", "") : this.removeAttribute("no-collapse")
    },
    _initDockable() {
        this._preferredWidth = "auto", this._preferredHeight = "auto", this._computedMinWidth = 0, this._computedMinHeight = 0, this.style.minWidth = "auto", this.style.minHeight = "auto", this.style.maxWidth = "auto", this.style.maxHeight = "auto", this.addEventListener("dragover", e => {
            e.preventDefault(), t.dragoverDock(this)
        })
    },
    _notifyResize() {
        for (let e = 0; e < this.children.length; ++e) {
            let t = this.children[e];
            t._dockable && t._notifyResize()
        }
    },
    _collapse() {
        let e = this.parentNode;
        if (this.noCollapse || !e) return !1;
        if (0 === this.children.length) return e._dockable ? e.removeDock(this) : e.removeChild(this), !0;
        if (1 === this.children.length) {
            let t = this.children[0];
            return t.style.flex = this.style.flex, t._preferredWidth = this._preferredWidth, t._preferredHeight = this._preferredHeight, e.insertBefore(t, this), e.removeChild(this), t._dockable && t._collapse(), !0
        }
        if (e._dockable && e.row === this.row) {
            for (; this.children.length > 0;) e.insertBefore(this.children[0], this);
            return e.removeChild(this), !0
        }
        return !1
    },
    _makeRoomForNewComer(e, i) {
        if ("left" === e || "right" === e) {
            let e = this._preferredWidth - i._preferredWidth - t.resizerSpace;
            e > 0 ? this._preferredWidth = e : (e = Math.floor(.5 * (this._preferredWidth - t.resizerSpace)), this._preferredWidth = e, i._preferredWidth = e)
        } else {
            let e = this._preferredHeight - i._preferredHeight - t.resizerSpace;
            e > 0 ? this._preferredHeight = e : (e = Math.floor(.5 * (this._preferredHeight - t.resizerSpace)), this._preferredHeight = e, i._preferredHeight = e)
        }
    },
    addDock(t, i, r) {
        if (!1 === i._dockable) return e.warn(`Dock element at position ${t} must be dockable`), void 0;
        let h, s, l, o = !1,
            d = this.parentNode;
        if (d._dockable) "left" === t || "right" === t ? d.row || (o = !0) : d.row && (o = !0), o ? ((h = document.createElement("ui-dock")).row = "left" === t || "right" === t, d.insertBefore(h, this), "left" === t || "top" === t ? (h.appendChild(i), h.appendChild(this)) : (h.appendChild(this), h.appendChild(i)), h._initResizers(), h._finalizePreferredSize(), h.style.flex = this.style.flex, h._preferredWidth = this._preferredWidth, h._preferredHeight = this._preferredHeight, this._makeRoomForNewComer(t, i)) : (s = null, (s = document.createElement("ui-dock-resizer")).vertical = d.row, "left" === t || "top" === t ? (d.insertBefore(i, this), d.insertBefore(s, this)) : null === (l = this.nextElementSibling) ? (d.appendChild(s), d.appendChild(i)) : (d.insertBefore(s, l), d.insertBefore(i, l)), r || this._makeRoomForNewComer(t, i));
        else if ("left" === t || "right" === t ? this.row || (o = !0) : this.row && (o = !0), o) {
            for ((h = document.createElement("ui-dock")).row = this.row, this.row = "left" === t || "right" === t; this.children.length > 0;) {
                let e = this.children[0];
                h.appendChild(e)
            }
            "left" === t || "top" === t ? (this.appendChild(i), this.appendChild(h)) : (this.appendChild(h), this.appendChild(i)), this._initResizers(), h._finalizePreferredSize(), h.style.flex = this.style.flex, h._preferredWidth = this._preferredWidth, h._preferredHeight = this._preferredHeight, this._makeRoomForNewComer(t, i)
        } else s = null, (s = document.createElement("ui-dock-resizer")).vertical = this.row, "left" === t || "top" === t ? (this.insertBefore(i, this.firstElementChild), this.insertBefore(s, this.firstElementChild)) : null === (l = this.nextElementSibling) ? (this.appendChild(s), this.appendChild(i)) : (this.insertBefore(s, l), this.insertBefore(i, l)), r || this._makeRoomForNewComer(t, i)
    },
    removeDock(e) {
        let i = !1;
        for (let t = 0; t < this.children.length; ++t)
            if (this.children[t] === e) {
                i = !0;
                break
            } return !!i && (this.children[0] === e ? e.nextElementSibling && t.isResizer(e.nextElementSibling) && this.removeChild(e.nextElementSibling) : e.previousElementSibling && t.isResizer(e.previousElementSibling) && this.removeChild(e.previousElementSibling), this.removeChild(e), this._collapse())
    }
};
module.exports = i;