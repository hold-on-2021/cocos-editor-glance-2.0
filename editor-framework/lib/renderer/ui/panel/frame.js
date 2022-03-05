"use strict";
const t = require("fire-path"),
    e = require("mousetrap"),
    i = require("../utils/resource-mgr"),
    s = require("../utils/dom-utils"),
    r = require("../../i18n"),
    n = require("../../console"),
    o = require("../../../profile"),
    h = require("../../../share/js-utils"),
    l = require("../../../share/ipc-listener"),
    a = require("../../ipc");
module.exports = class extends window.HTMLElement {
    static get tagName() {
        return "UI-PANEL-FRAME"
    }
    get root() {
        return this.shadowRoot ? this.shadowRoot : this
    }
    get info() {
        return this._info
    }
    get name() {
        return this._info ? r.format(this._info.title) : this.id
    }
    get popable() {
        return !this._info || this._info.popable
    }
    get width() {
        if (!this._info) return "auto";
        let t = parseInt(this._info.width);
        return isNaN(t) ? "auto" : t
    }
    get minWidth() {
        if (!this._info) return 100;
        let t = parseInt(this._info["min-width"]);
        return isNaN(t) ? 100 : t
    }
    get maxWidth() {
        if (!this._info) return "auto";
        let t = parseInt(this._info["max-width"]);
        return isNaN(t) ? "auto" : t
    }
    get height() {
        if (!this._info) return "auto";
        let t = parseInt(this._info.height);
        return isNaN(t) ? "auto" : t
    }
    get minHeight() {
        if (!this._info) return 100;
        let t = parseInt(this._info["min-height"]);
        return isNaN(t) ? 100 : t
    }
    get maxHeight() {
        if (!this._info) return "auto";
        let t = parseInt(this._info["max-height"]);
        return isNaN(t) ? "auto" : t
    }
    createdCallback() {
        this.classList.add("fit"), this.tabIndex = -1, this._focusedElement = null, this._lastFocusedElement = null, this._info = null
    }
    queryID(t) {
        return this.root.getElementById(t)
    }
    query(t) {
        return this.root.querySelector(t)
    }
    queryAll(t) {
        return this.root.querySelectorAll(t)
    }
    reset() {}
    load(e) {
        let s = t.join(this._info.path, this._info.main);
        this._loadLabelWidth(), i.importScript(s).then(t => {
            if (!t) throw new Error(`Failed to load panel-frame ${this.id}: no panel prototype return.`);
            if (t.dependencies && t.dependencies.length) return i.importScripts(t.dependencies).then(() => {
                let i = this._loadProfiles();
                this._apply(t, i), e && e(null)
            }).catch(t => {
                e && e(t)
            }), void 0;
            let s = this._loadProfiles();
            this._apply(t, s), e && e(null)
        }).catch(t => {
            e && e(t)
        }), this._registerEvent()
    }
    _loadProfiles() {
        let t = {};
        return this._info.profileTypes.forEach(e => {
            let i = `${e}://${this.id}.json`;
            t[e] = o.load(i)
        }), t
    }
    _apply(t, i) {
        let r = this._info["shadow-dom"],
            o = t.template,
            a = t.style,
            d = t.listeners,
            u = t.behaviors,
            f = t.$;
        h.assignExcept(this, t, ["dependencies", "template", "style", "listeners", "behaviors", "$"]), u && u.forEach(t => {
            h.addon(this, t)
        }), r && this.createShadowRoot();
        let c = this.root;
        if (o && (c.innerHTML = o), a) {
            let t = document.createElement("style");
            t.type = "text/css", t.textContent = a, c.insertBefore(t, c.firstChild)
        }
        if (r && c.insertBefore(s.createStyleElement("theme://elements/panel-frame.css"), c.firstChild), f)
            for (let t in f) {
                if (this[`$${t}`]) {
                    n.warn(`failed to assign selector $${t}, already used.`);
                    continue
                }
                let e = c.querySelector(f[t]);
                e ? this[`$${t}`] = e : n.warn(`failed to query selector ${f[t]} to $${t}.`)
            }
        if (d)
            for (let t in d) this.addEventListener(t, d[t].bind(this));
        if (this.messages) {
            let t = new l;
            for (let e in this.messages) {
                let i = this.messages[e];
                i && "function" == typeof i ? t.on(e, (t, ...e) => {
                    i.apply(this, [t, ...e])
                }) : n.warn(`Failed to register ipc message ${e} in panel ${this.id}, function not provide.`)
            }
            this._ipcListener = t
        }
        if (i && (this.profiles = i), this._info.shortcuts) {
            let t = [],
                i = new e(this);
            t.push(i);
            for (let s in this._info.shortcuts) {
                if ("#" !== s[0]) {
                    let t = this._info.shortcuts[s],
                        e = this[t];
                    if (!e || "function" != typeof e) {
                        n.warn(`Failed to register shortcut, cannot find method ${t} in panel ${this.id}.`);
                        continue
                    }
                    i.bind(s, e.bind(this));
                    continue
                }
                let r = c.querySelector(s);
                if (!r) {
                    n.warn(`Failed to register shortcut for element ${s}, cannot find it.`);
                    continue
                }
                let o = this._info.shortcuts[s],
                    h = new e(r);
                t.push(h);
                for (let t in o) {
                    let e = o[t],
                        i = this[e];
                    i && "function" == typeof i ? h.bind(t, i.bind(this)) : n.warn(`Failed to register shortcut, cannot find method ${e} in panel ${this.id}.`)
                }
            }
            this._mousetrapList = t
        }
    }
    _loadLabelWidth() {
        a.sendToMain("editor:query-label-width", this.getAttribute("id"), (t, e) => {
            this.labelWidth = e
        })
    }
    _registerEvent() {
        this.addEventListener("ui-prop-connected", t => {
            let e = t.detail;
            e.hasAttribute("subset") || "auto" === this.labelWidth || (e.labelWidth = this.labelWidth), Editor.UI.acceptEvent(t)
        }), this.addEventListener("label-width-change", t => {
            let e = this.shadowRoot.querySelectorAll("ui-prop");
            for (let i of e) i.hasAttribute("subset") || (i.labelWidth = t.detail);
            this.labelWidth = t.detail, Editor.UI.acceptEvent(t)
        }), this.addEventListener("label-width-change-finish", t => {
            a.sendToMain("editor:update-label-width", this.getAttribute("id"), this.labelWidth), Editor.UI.acceptEvent(t)
        })
    }
};