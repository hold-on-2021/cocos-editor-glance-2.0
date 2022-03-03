"use strict";
const e = require("fs"),
    t = require("path"),
    o = require("../utils/cache"),
    n = require("../utils/operation"),
    i = require("../utils/communication"),
    r = require("../utils/event");
let s = "",
    d = function (e, t) {
        if (o.recording) return n.rename(), r.emit("nodes_focus", !0), void 0;
        Editor.Ipc.sendToPanel("scene", "scene:set-property", {
            id: e.id,
            path: "name",
            type: "String",
            value: t,
            isSubProp: !1
        }), Editor.Ipc.sendToPanel("scene", "scene:undo-commit"), e.name = t, n.rename(), r.emit("nodes_focus", !0)
    };
exports.template = e.readFileSync(t.join(__dirname, "../template/node.html"), "utf-8"), exports.props = ["start", "node"], exports.data = function () {
    return {
        style: {
            "padding-left": 15 * this.node.level + 20,
            "padding-right": 10,
            transform: `translateY(${20*this.start}px)`
        },
        lastClickTime: 0,
        lockRename: !1
    }
}, exports.methods = {
    t: e => Editor.T(`HIERARCHY.${e}`),
    onUpdateStyle(e) {
        return this.style.transform = `translateY(${20*e}px)`, this.style
    },
    onMouseDown() {
        this.node.ignore || (clearTimeout(this._renameTimer), clearTimeout(this._inputBlurTimer), event.stopPropagation(), Editor.Selection.setContext("node", this.node.id), 2 === event.button && i.popup("node", {
            x: event.clientX,
            y: event.clientY
        }), s = this.node.id)
    },
    onMouseEnter() {
        Editor.Selection.hover("node", this.node.id)
    },
    onMouseUp(e) {
        if (this.node.ignore) return;
        if (s !== this.node.id) return;
        if (s = "", 2 !== e.button && Editor.Selection.setContext("node"), e.ctrlKey || e.metaKey) {
            let e = Editor.Selection.curSelection("node"),
                t = e.indexOf(this.node.id);
            return -1 !== t ? e.splice(t, 1) : e.push(this.node.id), Editor.Selection.select("node", e, !0, !0), void 0
        }
        if (e.shiftKey) {
            let e = Editor.Selection.curSelection("node");
            if (!e || e.length <= 0) return e = this.node.id, Editor.Selection.select("node", e, !0, !0), void 0;
            let t = o.queryNodes(),
                n = o.queryNode(e[0]);
            if (n.index === this.node.index) return e = this.node.id, Editor.Selection.select("node", e, !0, !0), void 0;
            e = [];
            let i = n.index > this.node.index ? -1 : 1;
            for (let o = n.index; o !== this.node.index + i; o += i) {
                let n = t[o];
                n.show && e.push(n.id)
            }
            return Editor.Selection.select("node", e, !0, !0), void 0
        }
        let t = this.node.id;
        Editor.Selection.select("node", t, !0, !0)
    },
    onMouseLeave() {
        Editor.Selection.hover("node", null), s = ""
    },
    onClick() {
        if (this.node.ignore) return;
        let e = (new Date).getTime();
        return e - this.lastClickTime >= 2e3 ? (this.lastClickTime = e, void 0) : this.node.locked || !this.node.selected || this.node.rename ? (n.rename(), void 0) : (this._renameTimer = setTimeout(() => {
            n.rename(this.node.id)
        }, 300), void 0)
    },
    onDBClick() {
        this.node.ignore || (clearTimeout(this._renameTimer), this.node.rename || Editor.Ipc.sendToPanel("scene", "scene:center-nodes", [this.node.id]))
    },
    onIClick(e) {
        if (this.node.ignore) return;
        e.stopPropagation(), e.preventDefault();
        let t = !this.node.fold;
        e.altKey && n.recFoldNodes(this.node.id, t), n.fold(this.node.id, t)
    },
    onIDBClick(e) {
        e.stopPropagation(), e.preventDefault()
    },
    onIMouseDown(e) {
        e.stopPropagation(), e.preventDefault()
    },
    onIMouseUp(e) {
        e.stopPropagation(), e.preventDefault()
    },
    onInputBlur(e) {
        if (e.stopPropagation(), this.lockRename) return this.lockRename = !1, void 0;
        let t = e.target;
        this._inputBlurTimer = setTimeout(() => {
            d(this.node, t.value)
        }, 300)
    },
    onInputKeydown(e) {
        switch (e.stopPropagation(), e.keyCode) {
            case 13:
                this.lockRename = !0, d(this.node, e.target.value);
                break;
            case 27:
                this.lockRename = !0, n.rename()
        }
    },
    onInputMouseDown(e) {
        e.stopPropagation()
    },
    onInputClick(e) {
        e.stopPropagation(), e.preventDefault()
    },
    onLockClick(e) {
        e.stopPropagation(), e.preventDefault(), Editor.Ipc.sendToPanel("scene", "scene:change-node-lock", this.node.id)
    }
}, exports.directives = {
    init() {
        requestAnimationFrame(() => {
            let e = this.vm.$el.getElementsByTagName("input")[0];
            e && (e.focus(), e.select())
        })
    }
};