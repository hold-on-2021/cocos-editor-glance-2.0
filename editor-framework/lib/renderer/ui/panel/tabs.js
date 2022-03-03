"use strict";
const e = require("../../../share/js-utils"),
    t = require("../behaviors/droppable"),
    i = require("../utils/dock-utils"),
    s = require("../utils/dom-utils"),
    a = require("../utils/focus-mgr");
class n extends window.HTMLElement {
    static get tagName() {
        return "UI-DOCK-TABS"
    }
    createdCallback() {
        let e = this.createShadowRoot();
        e.innerHTML = '\n      <div class="border">\n        <div class="tabs">\n          <content select="ui-dock-tab"></content>\n        </div>\n\n        <div id="popup" class="icon">\n          <i class="icon-popup"></i>\n        </div>\n        <div id="menu" class="icon">\n          <i class="icon-menu"></i>\n        </div>\n        <div id="insertLine" class="insert"></div>\n      </div>\n    ', e.insertBefore(s.createStyleElement("theme://elements/tabs.css"), e.firstChild), this.activeTab = null, this._focused = !1, this.$ = {
            popup: this.shadowRoot.querySelector("#popup"),
            menu: this.shadowRoot.querySelector("#menu"),
            insertLine: this.shadowRoot.querySelector("#insertLine")
        }, this.addEventListener("drop-area-enter", this._onDropAreaEnter.bind(this)), this.addEventListener("drop-area-leave", this._onDropAreaLeave.bind(this)), this.addEventListener("drop-area-accept", this._onDropAreaAccept.bind(this)), this.addEventListener("drop-area-move", this._onDropAreaMove.bind(this)), this.addEventListener("mousedown", e => {
            e.preventDefault()
        }), this.addEventListener("click", this._onClick.bind(this)), this.addEventListener("tab-click", this._onTabClick.bind(this)), this.$.popup.addEventListener("click", this._onPopup.bind(this)), this.$.menu.addEventListener("click", this._onMenuPopup.bind(this)), this.droppable = "tab", this.multi = !1, this._initDroppable(this), this.children.length > 0 && this.select(this.children[0])
    }
    _setFocused(e) {
        this._focused = e;
        for (let t = 0; t < this.children.length; ++t) {
            this.children[t].focused = e
        }
    }
    findTab(e) {
        for (let t = 0; t < this.children.length; ++t) {
            let i = this.children[t];
            if (i.frameEL === e) return i
        }
        return null
    }
    insertTab(e, t) {
        return e === t ? e : (t ? this.insertBefore(e, t) : this.appendChild(e), e.focused = this._focused, e)
    }
    addTab(e) {
        let t = document.createElement("ui-dock-tab");
        return t.name = e, this.appendChild(t), t.focused = this._focused, t
    }
    removeTab(e) {
        let t = null;
        if ("number" == typeof e ? e < this.children.length && (t = this.children[e]) : i.isTab(e) && (t = e), null !== t) {
            if (this.activeTab === t) {
                this.activeTab = null;
                let e = t.nextElementSibling;
                e || (e = t.previousElementSibling), e && this.select(e)
            }
            t.focused = !1, this.removeChild(t)
        }
    }
    select(e) {
        let t = null;
        if ("number" == typeof e ? e < this.children.length && (t = this.children[e]) : i.isTab(e) && (t = e), null !== t) {
            if (t !== this.activeTab) {
                let e = this.activeTab;
                null !== this.activeTab && this.activeTab.classList.remove("active"), this.activeTab = t, this.activeTab.classList.add("active"), this.$.popup.classList.toggle("hide", !t.frameEL.popable), s.fire(this, "tab-changed", {
                    bubbles: !0,
                    detail: {
                        oldTab: e,
                        newTab: t
                    }
                })
            }
            a._setFocusPanelFrame(t.frameEL)
        }
    }
    outOfDate(e) {
        let t = null;
        "number" == typeof e ? e < this.children.length && (t = this.children[e]) : i.isTab(e) && (t = e), null !== t && (t.outOfDate = !0)
    }
    _onClick(e) {
        e.stopPropagation(), a._setFocusPanelFrame(this.activeTab.frameEL)
    }
    _onTabClick(e) {
        e.stopPropagation(), this.select(e.target)
    }
    _onDropAreaEnter(e) {
        e.stopPropagation()
    }
    _onDropAreaLeave(e) {
        e.stopPropagation(), i.dragleaveTab(this), this.$.insertLine.style.display = ""
    }
    _onDropAreaAccept(e) {
        e.stopPropagation(), this.$.insertLine.style.display = "", i.dropTab(this, this._curInsertTab)
    }
    _onDropAreaMove(e) {
        e.stopPropagation(), i.dragoverTab(this);
        let t = e.detail.dataTransfer,
            s = e.detail.target;
        t.dropEffect = "move", this._curInsertTab = null;
        let a = this.$.insertLine.style;
        if (a.display = "block", i.isTab(s)) a.left = s.offsetLeft + "px", this._curInsertTab = s;
        else {
            let e = this.lastElementChild;
            a.left = e.offsetLeft + e.offsetWidth + "px"
        }
    }
    _onPopup(e) {
        if (e.stopPropagation(), this.activeTab) {
            let e = this.activeTab.frameEL.id;
            Editor.Panel.popup(e)
        }
    }
    _onMenuPopup(e) {
        e.stopPropagation();
        let t = this.$.menu.getBoundingClientRect(),
            i = "",
            s = !0;
        this.activeTab && (i = this.activeTab.frameEL.id, s = this.activeTab.frameEL.popable), Editor.Menu.popup([{
            label: Editor.T("PANEL_MENU.maximize"),
            dev: !0,
            message: "editor:panel-maximize",
            params: [i]
        }, {
            label: Editor.T("PANEL_MENU.pop_out"),
            command: "Editor.Panel.popup",
            params: [i],
            enabled: s
        }, {
            label: Editor.T("PANEL_MENU.close"),
            command: "Editor.Panel.close",
            params: [i],
            enabled: s
        }, {
            label: Editor.T("PANEL_MENU.add_tab"),
            dev: !0,
            submenu: []
        }], t.left + 5, t.bottom + 5)
    }
}
e.addon(n.prototype, t), module.exports = n;