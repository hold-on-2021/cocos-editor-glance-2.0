"use strict";
const e = require("fs"),
    t = require("path"),
    {
        promisify: i
    } = require("util"),
    n = (require("fire-url"), require("../utils/cache")),
    o = require("../utils/event"),
    s = require("../utils/operation"),
    r = require("../utils/communication"),
    a = Editor.require("scene://utils/animation"),
    d = /(?:\.js|\.ts)+$/;
exports.template = e.readFileSync(t.join(__dirname, "../template/node.html"), "utf-8"), exports.props = ["start", "node"], exports.data = function () {
    return {
        style: {
            "padding-left": 15 * this.node.level + 10,
            transform: `translateY(${this.start*n.lineHeight}px)`
        },
        iconUrl: this.node.iconUrl,
        oldIconUrl: null,
        lockRename: !1
    }
}, exports.created = function () {
    this.genIcon()
}, exports.watch = {
    "node.rename": {
        handler: function (e, t) {
            e && !t && (this.oriName = this.node.name), !e && t && this.oriName !== this.node.name && this.nodeRename()
        }
    },
    "node.level": {
        handler: function (e, t) {
            this.style["padding-left"] = 15 * e + 10
        }
    },
    "node.iconUrl": {
        handler: function (e, t) {
            this.oldIconUrl = t, this.genIcon()
        }
    }
}, exports.methods = {
    t: e => Editor.T(`HIERARCHY.${e}`),
    onUpdateStyle(e) {
        return this.style.transform = `translateY(${e*n.lineHeight}px)`, this.style
    },
    genIcon() {
        if (this.node.iconUrl) return this.iconUrl = this.node.iconUrl, void 0;
        let e, t, i = this.node.assetType,
            n = this.node.id;
        if ("texture" === i) return t = 'url("' + (e = `thumbnail://${n}?32`) + '")', this.iconUrl = `background-image:${t}`, this.oldIconUrl === this.iconUrl && (t = 'url("' + (e += "&_ts=" + Date.now()) + '")', this.iconUrl = `background-image:${t}`), this.node.iconUrl = this.iconUrl, void 0;
        this.iconUrl = `background-image:${this._getDefaultIcon(i)}`, this.node.iconUrl = this.iconUrl
    },
    _getDefaultIcon(e) {
        let t, i = Editor.metas[e];
        return i && i["asset-icon"] ? 'url("' + (t = i["asset-icon"]) + '")' : 'url("' + (t = "packages://assets/static/icon/" + e + ".png") + '")'
    },
    _getDrawFrameIcon(e) {
        let t, i, n = `thumbnail://${e.rawTextureUuid}?32`,
            o = e.trimX,
            s = e.trimY,
            r = 0;
        e.rotated ? (t = e.height, i = e.width, r = 270) : (t = e.width, i = e.height);
        let a = `&x=${o}&y=${s}&w=${t}&h=${i}`;
        0 !== r && (a += `&rotate=${r}`);
        let d = 'url("' + (n += a) + '")';
        return this.iconUrl === d && (d = 'url("' + (n += "&_ts=" + Date.now()) + '")'), d
    },
    onClick() {
        this.node.selected && !this.node.rename && (this._renameTimer = setTimeout(() => {
            s.rename(this.node.id)
        }, 300))
    },
    onMouseDown(e) {
        if (e.stopPropagation(), Editor.Selection.setContext("asset", this.node.id), this._renameCancel(), 2 === e.button) return r.popup("context", {
            x: e.clientX,
            y: e.clientY,
            id: this.node.id,
            assetType: this.node.assetType,
            allowAssign: !1,
            copyEnable: !this.node.readonly && !this.node.isSubAsset,
            isSubAsset: this.node.isSubAsset,
            allowPaste: n.copyUuids && n.copyUuids.length > 0
        }), void 0
    },
    onMouseEnter() {
        Editor.Selection.hover("asset", this.node.id)
    },
    onMouseUp(e) {
        if (2 !== e.button && Editor.Selection.setContext("asset"), e.ctrlKey || e.metaKey) {
            let e = Editor.Selection.curSelection("asset"),
                t = e.indexOf(this.node.id);
            return -1 !== t ? e.splice(t, 1) : e.push(this.node.id), Editor.Selection.select("asset", e, !0, !0), void 0
        }
        if (e.shiftKey) {
            let e = Editor.Selection.curSelection("asset");
            if (!e || e.length <= 0) return e = this.node.id, Editor.Selection.select("asset", e, !0, !0), void 0;
            let t = n.queryShowNodes(),
                i = (n.queryNode(e[0]), t.findIndex(t => t.id === e[0])),
                o = t.findIndex(e => e.id === this.node.id);
            if (-1 === i || -1 === o) return console.log("can find uuid"), void 0;
            if (e[0] === this.node.id) return e = this.node.id, Editor.Selection.select("asset", e, !0, !0), void 0;
            e = [];
            let s = i > o ? -1 : 1;
            for (let n = i; n !== o + s; n += s) {
                let i = t[n];
                e.push(i.id)
            }
            return Editor.Selection.select("asset", e, !0, !0), void 0
        }
        let t = this.node.id;
        Editor.Selection.select("asset", t, !0, !0)
    },
    onMouseLeave() {
        Editor.Selection.hover("node", null)
    },
    onDBClick(e) {
        e.stopPropagation(), e.preventDefault(), clearTimeout(this._renameTimer), 1 !== e.which || this.node.rename || e.shiftKey || e.metaKey || e.ctrlKey || this.onOpenAsset(this.node.id)
    },
    onIClick(e) {
        e.stopPropagation(), e.preventDefault(), this._renameCancel();
        let t = !this.node.fold;
        e.altKey && s.recFoldNodes(this.node.id, t), s.fold(this.node.id, t)
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
        this._renameSubmit(e.target.value)
    },
    async nodeRename() {
        if (a.STATE.RECORD && "animation-clip" === this.node.assetType) {
            return await i(Editor.Ipc.sendToPanel)("timeline", "timeline:exists-clip", this.node.id) && (this.node.name = this.oriName, o.emit("nodes_focus", !0), Editor.warn("Cannot rename while currently animation edit.")), void 0
        }
        let e = "";
        if ("javascript" === this.node.assetType || "typescript" === this.node.assetType) {
            if (this.node.name = this.node.name.replace(d, ""), this.node.name === this.oriName) return;
            e = s.getRealUrl(this.node.id), e = await s.getUniqueUrl(e, ["typescript", "javascript"])
        } else e = s.getRealUrl(this.node.id);
        let t = s.getRealUrl(this.node.id, this.oriName);
        this.node.name ? Editor.assetdb.move(t, e, !0, (e, t) => {
            e && (this.node.name = this.oriName)
        }) : (Editor.Dialog.messageBox({
            type: "warning",
            buttons: [Editor.T("MESSAGE.ok")],
            title: Editor.T("MESSAGE.warning"),
            message: Editor.T("MESSAGE.assets.failed_to_move", {
                srcUrl: t,
                destUrl: e
            }),
            detail: "Can not use empty name",
            noLink: !0
        }), this.node.name = this.oriName), clearTimeout(this._renameTimer)
    },
    onInputKeydown(e) {
        switch (e.stopPropagation(), e.keyCode) {
            case 13:
                this.lockRename = !0, this._renameSubmit(e.target.value);
            case 27:
                this.lockRename = !0, this._renameCancel(!0)
        }
    },
    onInputMouseDown(e) {
        e.stopPropagation()
    },
    onInputClick(e) {
        e.stopPropagation(), e.preventDefault()
    },
    onOpenAsset(e) {
        Editor.assetdb.queryInfoByUuid(e, (t, i) => {
            switch (i.type) {
                case "effect":
                case "javascript":
                case "coffeescript":
                case "typescript":
                case "markdown":
                case "bitmap-font":
                case "text":
                case "json":
                    Editor.Ipc.sendToMain("assets:open-text-file", e);
                    break;
                case "scene":
                    Editor.Ipc.sendToMain("scene:open-by-uuid", e);
                    break;
                case "sprite-frame":
                    Editor.Panel.open("sprite-editor", {
                        uuid: e
                    });
                    break;
                case "texture":
                    Editor.Ipc.sendToMain("assets:open-texture-file", e);
                    break;
                case "prefab":
                    Editor.Ipc.sendToAll("scene:enter-prefab-edit-mode", e);
                    break;
                case "folder":
                    let t = n.queryNode(e);
                    s.fold(t.id, !t.fold)
            }
        })
    },
    _renameSubmit(e) {
        this.node.name = e, s.rename(), clearTimeout(this._renameTimer)
    },
    _renameCancel(e) {
        s.rename(), clearTimeout(this._renameTimer), e && o.emit("nodes_focus", !0)
    }
}, exports.directives = {
    init() {
        setTimeout(() => {
            if (!this.vm || !this.vm.$el) return;
            let e = this.vm.$el.getElementsByTagName("input")[0];
            e && (e.focus(), e.select())
        }, 100)
    }
};