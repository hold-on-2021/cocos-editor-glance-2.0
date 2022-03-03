"use strict";
const e = require("lodash"),
    t = require("async"),
    i = require("fire-path"),
    s = require("jsondiffpatch"),
    r = Editor.require("packages://inspector/utils/utils"),
    a = Editor.require("packages://inspector/panel/data"),
    {
        changeCurveState: o,
        changeCurveData: n
    } = Editor.require("packages://curve-editor/panel/manager"),
    l = Editor.require("packages://inspector/panel/metas");
let d = 1e3,
    h = s.create({
        objectHash(e, t) {
            if (!e) return -1;
            if (e.value) {
                let t = e.value;
                if (t.uuid && t.uuid.value) return t.uuid.value;
                if (t.name && t.name.value && t.attrs) return t.name.value
            }
            return `$$index:${t}`
        },
        arrays: {
            detectMove: !0
        }
    }),
    c = {
        numerically: (e, t) => e - t,
        numericallyBy: e => (t, i) => t[e] - i[e]
    };
Editor.Panel.extend({
    style: "\n    @import url('theme://globals/fontello.css');\n    @import url('app://node_modules/font-awesome/css/font-awesome.min.css');\n\n    :host {\n      display: flex;\n      flex-direction: column;\n    }\n\n    #view {\n      position: relative;\n      overflow: hidden;\n    }\n\n    .props {\n      overflow-x: hidden;\n      overflow-y: scroll;\n      margin-left: 4px;\n      margin-bottom: 10px;\n    }\n\n    .props::-webkit-scrollbar-track {\n      border: 5px solid transparent;\n      background: none !important;\n      background-clip: content-box;\n    }\n\n    .highlight {\n      border: 2px solid #0f0;\n      background-color: rgba( 0, 128, 0, 0.2 );\n      box-sizing: border-box;\n      pointer-events: none;\n    }\n  ",
    template: `\n    <div id="view" class="flex-1"></div>\n    <ui-loader id="loader" class="fit" hidden>${Editor.T("SHARED.loading")}</ui-loader>\n    <div id="highlightBorder" class="highlight fit" hidden></div>\n  `,
    $: {
        view: "#view",
        loader: "#loader",
        highlightBorder: "#highlightBorder"
    },
    behaviors: [Editor.UI.Droppable],
    listeners: {
        "panel-resize"() {
            this._vm && this._vm.resize && this._vm.resize()
        },
        "drop-area-move"(e) {
            e.preventDefault(), this._vm && "node" === this._selectType && (e.stopPropagation(), this.dropAccepted ? Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer, "copy") : Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer, "none"))
        },
        "drop-area-enter"(e) {
            if (e.stopPropagation(), !this._vm || "node" !== this._selectType) return;
            let t = e.detail.dragItems;
            this.highlightBorderFlag = !0, Editor.assetdb.queryInfoByUuid(t[0].id, (t, i) => {
                let s = i.type;
                "javascript" !== s && "coffeescript" !== s && "typescript" !== s || (this.dropAccepted = !0, this.highlightBorderFlag && (this.$highlightBorder.hidden = !1), Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer, "none"))
            })
        },
        "drop-area-leave"(e) {
            e.stopPropagation(), this._vm && "node" === this._selectType && (this.dropAccepted = !1, this.highlightBorderFlag = !1, this.$highlightBorder.hidden = !0)
        },
        "drop-area-accept"(e) {
            if (e.stopPropagation(), !this._vm || "node" !== this._selectType) return;
            this.dropAccepted = !1, this.$highlightBorder.hidden = !0, Editor.Selection.cancel();
            let t = e.detail.dragItems[0].id;
            Editor.Ipc.sendToPanel("scene", "scene:add-component", this._selectID, Editor.Utils.UuidUtils.compressUuid(t))
        },
        "meta-revert"(e) {
            e.stopPropagation(), this.refresh()
        },
        "meta-apply"(e) {
            e.stopPropagation();
            let i = e.detail.target.metas;
            t.map(i, (e, t) => {
                let i = e.uuid,
                    s = {};
                e.subMetas && e.subMetas.forEach(e => {
                    s[e.__name__] = e, delete e.__name__
                }), e.subMetas = s;
                let r = JSON.stringify(e),
                    a = [];
                for (let t in e.subMetas) {
                    let i = e.subMetas[t];
                    i.__name__ = t, a.push(i)
                }
                e.subMetas = a, Editor.assetdb.saveMeta(i, r, t)
            }, e => {
                e && Editor.error(e), this.refresh()
            }), this.showLoaderAfter(0)
        },
        "reset-prop"(e) {
            e.stopPropagation();
            let t = r.normalizePath(e.detail.path),
                i = r.compPath(e.detail.path),
                s = this._vm.$get(i),
                a = s ? s.value.uuid.value : this._selectID;
            Editor.Ipc.sendToPanel("scene", "scene:reset-property", {
                id: a,
                path: r.normalizePath(t),
                type: e.detail.type
            }), this._queryNode(this._selectID)
        },
        "new-prop"(e) {
            e.stopPropagation();
            let t = r.normalizePath(e.detail.path),
                i = r.compPath(e.detail.path),
                s = this._vm.$get(i),
                a = s ? s.value.uuid.value : this._selectID;
            Editor.Ipc.sendToPanel("scene", "scene:new-property", {
                id: a,
                path: r.normalizePath(t),
                type: e.detail.type
            }), this._queryNode(this._selectID)
        },
        "prefab-select-asset"(e) {
            e.stopPropagation();
            let t = this._vm.target.__prefab__.uuid;
            Editor.Ipc.sendToAll("assets:hint", t)
        },
        "prefab-select-root"(e) {
            e.stopPropagation();
            let t = this._vm.target.__prefab__.rootUuid;
            Editor.Ipc.sendToAll("hierarchy:hint", t)
        },
        "prefab-revert"(e) {
            e.stopPropagation(), Editor.Ipc.sendToPanel("scene", "scene:revert-prefab", this._vm.target.uuid)
        },
        "prefab-apply"(e) {
            e.stopPropagation(), Editor.Ipc.sendToPanel("scene", "scene:apply-prefab", this._vm.target.uuid)
        },
        "prefab-set-sync"(e) {
            e.stopPropagation(), Editor.Ipc.sendToPanel("scene", "scene:set-prefab-sync", this._vm.target.uuid)
        }
    },
    ready() {
        this.droppable = "asset", this.multi = !1, this._initDroppable(this), this._forceUpdate = !1, this.reset();
        let e = Editor.Selection.curGlobalActivate();
        e && this._inspect(e.type, e.id);
        var t = e => t => {
            var i = t.path[0];
            if ("node" !== this._inspectType) {
                let e = t.detail && t.detail.path || i.getAttribute("path") || i.expression;
                return e && Editor.UI.fire(this, "target-change", {
                    detail: {
                        path: e,
                        value: t.detail.value
                    }
                }), void 0
            }
            if (i.expression) {
                var s = i.expression.replace(/\.value(s)?(\.[^\.]+)?$/, ""),
                    a = r.findRootVue(i);
                if (a) {
                    var o = a.$get(s);
                    if (o) {
                        var n = {};
                        "UI-PROP" === i.tagName && (o.value = t.detail.value), n.type = "cc.Asset" === o.type ? o.attrs.assetType : o.type, n.path = o.path, n.attrs = o.attrs, n.value = o.value, Editor.UI.fire(this, e, {
                            detail: n
                        })
                    }
                }
            }
        };
        this._onChange = t("target-change"), this._onConfirm = t("target-confirm"), this._onCancel = t("target-cancel"), this.addEventListener("change", this._onChange), this.addEventListener("confirm", this._onConfirm), this.addEventListener("cancel", this._onCancel), a.onSendBegin = (() => {
            clearTimeout(this._queryNodeTimeoutID), this._queryNodeTimeoutID = null
        }), a.onSendEnd = (() => {
            this._queryNode(), Editor.Ipc.sendToPanel("scene", "scene:undo-commit")
        })
    },
    close() {
        this.removeEventListener("change", this._onChange), this.removeEventListener("confirm", this._onConfirm), this.removeEventListener("cancel", this._onCancel), this._clear()
    },
    reset() {
        this._hasActivated = !1, this._selectType = null, this._selectID = null, this._inspectType = null, this._clear(), this.hideLoader()
    },
    refresh() {
        this._inspect(this._selectType, this._selectID)
    },
    uninspect() {
        this.reset()
    },
    _clear() {
        clearTimeout(this._queryNodeTimeoutID), this._vm && (this._vm.$destroy(), this._vm = null), Editor.UI.clear(this.$view);
        let e = this.shadowRoot.getElementById("custom-style");
        e && e.remove()
    },
    _inspect(e, t) {
        if (!t) return this.uninspect(), void 0;
        clearTimeout(this._queryNodeTimeoutID), this._queryNodeID && (Editor.Ipc.cancelRequest(this._queryNodeID), this._queryNodeID = null), this.showLoaderAfter(200), this._selectType = e, this._selectID = Editor.Selection.curSelection(e);
        ++d;
        this._curSessionID = d, "asset" === e && this._selectID.length > 0 ? this._queryMeta(this._selectID) : "node" === e && this._queryNode(this._selectID)
    },
    _doInspect(t, i, s, r, a, o) {
        if (this._inspectType === i && this._vm && !this._forceUpdate) return this._forceUpdate = !1, this._vm.target = s, this._vm.multi = !!r, void 0;
        this._clear(), this._inspectType = i, this._loadInspector(i, (n, l, d) => {
            if (n) return Editor.error(`Failed to load inspector ${i}: ${n.stack}`), void 0;
            if (t === this._curSessionID) {
                if ((d = e.defaults(d, {
                        el: l,
                        data: {},
                        methods: {}
                    })).data.target = s, d.data.multi = !!r, d.methods.T = Editor.T, d.beforeDestroy = (() => {
                        o && o(this)
                    }), this._vm = new Vue(d), d.$)
                    for (let e in d.$) l[`$${e}`] ? Editor.warn(`failed to assign selector $${e}, already used`) : l[`$${e}`] = l.querySelector(d.$[e]);
                a && a(this), this.$view.appendChild(l), d.ready && d.ready.call(this._vm)
            }
        })
    },
    _loadInspector(e, t) {
        let i = Editor.remote.inspectors[e];
        if (!i) return t(new Error(`Can not find inspector for ${e}, please register it first.`)), void 0;
        Editor.import(i).then(e => {
            let i = document.createElement("div");
            i.classList.add("fit"), i.classList.add("layout"), i.classList.add("vertical");
            let s = {};
            Editor.JS.assignExcept(s, e, ["dependencies", "template", "style"]);
            let r = e.dependencies || [];
            Editor.import(r).then(() => {
                if (e.template) {
                    "string" === typeof e.template && (i.innerHTML = e.template)
                }
                if (e.style) {
                    let t = document.createElement("style");
                    t.type = "text/css", t.textContent = e.style, t.id = "custom-style", this.shadowRoot.insertBefore(t, this.shadowRoot.firstChild)
                }
                t(null, i, s)
            }).catch(e => {
                t(e)
            })
        }).catch(e => {
            t(e)
        })
    },
    showLoaderAfter(e) {
        !1 !== this.$loader.hidden && (this._loaderID || (this._loaderID = setTimeout(() => {
            this.$loader.hidden = !1, this._loaderID = null
        }, e)))
    },
    hideLoader() {
        clearTimeout(this._loaderID), this._loaderID = null, this.$loader.hidden = !0
    },
    _checkIfApply() {
        "asset" === this._selectType && this._vm && this._vm.target.__dirty__ && this._applyPopup(this._vm.target)
    },
    _applyPopup(e) {
        0 === Editor.Dialog.messageBox({
            type: "warning",
            buttons: [Editor.T("MESSAGE.apply"), Editor.T("MESSAGE.revert")],
            title: Editor.T("MESSAGE.warning"),
            message: Editor.T("MESSAGE.inspector.apply_import_setting_message"),
            detail: Editor.T("MESSAGE.inspector.apply_import_setting_detail", {
                url: e.__url__
            }),
            defaultId: 0,
            cancelId: 1,
            noLink: !0
        }) ? Editor.UI.fire(this, "meta-apply", {
            detail: {
                target: e
            }
        }) : Editor.UI.fire(this, "meta-revert")
    },
    _loadMeta(e, t) {
        if (0 === e.indexOf("mount-")) return t && t(null, "mount", {
            __name__: e.substring(6),
            __path__: "",
            __assetType__: "mount",
            uuid: e
        }), void 0;
        Editor.assetdb.queryMetaInfoByUuid(e, (s, r) => {
            if (!r) return t && t(new Error(`Failed to query meta info by ${e}`)), void 0;
            let a = JSON.parse(r.json);
            if (a.__assetType__ = r.assetType, a.__name__ = i.basenameNoExt(r.assetPath), a.__path__ = r.assetPath, a.__url__ = r.assetUrl, a.__mtime__ = r.assetMtime, a.__dirty__ = !1, a.subMetas) {
                let e = [];
                for (let t in a.subMetas) {
                    let i = a.subMetas[t];
                    i.__name__ = t, e.push(i)
                }
                a.subMetas = e
            }
            t && t(null, r.defaultType, a)
        })
    },
    messages: {
        "selection:activated"(e, t, i) {
            "node" !== t && "asset" !== t || (this._checkIfApply(), this._inspect(t, i), this._hasActivated = !0)
        },
        "selection:changed"(e, t) {
            if ("asset" !== t || this._hasActivated) return this._hasActivated = !1, void 0;
            this.refresh()
        },
        "selection:deactivated"(e, t, i) {
            "node" === t && "node" === this._selectType && (this._checkIfApply(), this._selectID = null)
        },
        "selection:unselected"(e, t, i) {
            "node" === t && (this._selectID = null)
        },
        "scene:reloading"() {
            "node" === this._selectType && this.uninspect()
        },
        "asset-db:assets-moved"(e, t) {
            if ("asset" === this._selectType && this._selectID && this._selectID.length > 0)
                for (let e = 0; e < t.length; ++e)
                    if (this._selectID.includes(t[e].uuid)) {
                        this._forceUpdate = !0, this.refresh();
                        break
                    }
        },
        "asset-db:asset-changed"(e, t) {
            if (!this._vm) return;
            if (this._selectID && this._selectID.includes(t.uuid)) return this._forceUpdate = !0, this.refresh(), void 0;
            let i = this._vm.target && this._vm.target.subMetas;
            "asset" === this._selectType && i && i.some(e => e.uuid === t.uuid) && (this._forceUpdate = !0, this.refresh())
        },
        "asset-db:asset-uuid-changed"(e, t) {
            this._curInspector && this._selectID === t.oldUuid && (this._selectID = t.uuid, this._forceUpdate = !0, this.refresh())
        },
        "curve:state"(e, t) {
            o("true" === t)
        },
        "curve:change"(e, t) {
            n(t)
        }
    },
    _queryMeta(e) {
        t.map(e, (e, t) => {
            this._loadMeta(e, (i, s, r) => {
                if (i) return Editor.error(`Failed to load meta ${e}: ${i.message}`), void 0;
                t(i, r)
            })
        }, (e, t) => {
            if (e) return Editor.warn(e);
            l.clear(), t.forEach(e => {
                l.add(e)
            });
            let i = {
                setProp: e => {
                    e.stopPropagation();
                    let t = r.normalizePath(e.detail.path),
                        i = e.detail.value;
                    if ("object" == typeof i) {
                        let e = {};
                        for (let t in i) e[t] = i[t];
                        i = e
                    }
                    l.change(t, i), this._vm.target.multi ? this._vm.target = l.get() : l.syncData(this._vm.target, t, i), this._vm.target.__dirty__ = !0
                }
            };
            try {
                let e = l.get();
                this._doInspect(this._curSessionID, e.__assetType__, e, e.multi, e => {
                    e.addEventListener("target-change", i.setProp)
                }, e => {
                    e.removeEventListener("target-change", i.setProp)
                }), this.hideLoader()
            } catch (e) {
                Editor.warn(e)
            }
        })
    },
    _queryNode(e) {
        this._queryNodeTimeoutID && (clearTimeout(this._queryNodeTimeoutID), this._queryNodeTimeoutID = null), this._queryNodeID && (Editor.Ipc.cancelRequest(this._queryNodeID), this._queryNodeID = null);
        var i = e || Editor.Selection.curSelection("node"),
            s = i.length > 1 ? 300 : 100;
        this._queryNodeTimeoutID = setTimeout(() => {
            var e;
            t.map(i, (t, i) => {
                e = Editor.Ipc.sendToPanel("scene", "scene:query-node", t, (e, t) => {
                    i(e, t)
                }), this._queryNodeID = e, this._curSessionID = this._queryNodeID
            }, (t, i) => {
                if (t) {
                    if (this._selectID = Editor.Selection.curSelection("node"), !this._selectID) return;
                    return this._queryNode(this._selectID), Editor.warn(t)
                }
                null != this._queryNodeTimeoutID && (a.clear(), i.forEach(e => {
                    a.add(e)
                }), this._handleQueryNode(a.get(), e))
            })
        }, s)
    },
    _handleQueryNode(e, t) {
        if (!e) return;
        let i = e.value;
        if (!i) return;
        let s = i.uuid,
            o = e.types;
        if ("node" === this._selectType)
            if (r.buildNode("target", i, o), this._vm && "node" === this._inspectType && this._vm.target.uuid === s) {
                let e = h.diff(this._vm.target, i);
                e && this._applyPatch(e), this.hideLoader(), this._queryNode(this._selectID)
            } else {
                let s = {
                    cancel: e => {
                        e.stopPropagation(), Editor.Ipc.sendToPanel("scene", "scene:undo-cancel")
                    },
                    setProp: e => {
                        e.stopPropagation();
                        let t = r.normalizePath(e.detail.path),
                            i = r.compPath(e.detail.path),
                            s = e.detail.value;
                        if ("object" == typeof s) {
                            let e = {};
                            for (let t in s) e[t] = s[t];
                            s = e
                        }
                        let o = e.detail.type;
                        "cc.Node" === o && (o = e.detail.attrs.typeid), a.change(t, i, e.detail.type, s)
                    }
                };
                this._doInspect(t, "node", i, e.multi, e => {
                    e.addEventListener("target-cancel", s.cancel), e.addEventListener("target-change", s.setProp), e.addEventListener("target-size-change", s.setProp)
                }, e => {
                    e.removeEventListener("target-cancel", s.cancel), e.removeEventListener("target-change", s.setProp), e.removeEventListener("target-size-change", s.setProp)
                }), this.hideLoader(), this._queryNode(this._selectID)
            }
    },
    _applyPatch(e) {
        for (let t in e) this._patchAt(`target.${t}`, e[t])
    },
    _cloneData(e) {
        return function e(t) {
            var i = null,
                s = typeof t;
            if (Array.isArray(t)) i = t.map(function (t) {
                return e(t)
            });
            else if ("object" === s) {
                i = {};
                for (let s in t) i[s] = e(t[s])
            } else i = t;
            return i
        }(this._vm.$get(e))
    },
    _patchAt(e, t) {
        if (Array.isArray(t)) {
            let s, r, a;
            if (r = e.replace(/(\.value)?(\.[^\.]+)?$/, function (e) {
                    return a = (a = e.split(".")).filter(function (e) {
                        return e
                    }), ""
                }), s = this._cloneData(r), "target" === r) r = e, 1 === t.length ? s = t[0] : 2 === t.length ? s = t[1] : 3 === t.length && (s = void 0);
            else {
                var i = s;
                a.forEach(function (e, s) {
                    s !== a.length - 1 ? i = i[e] : 1 === t.length ? i[e] = t[0] : 2 === t.length ? i[e] = t[1] : 3 === t.length && delete i[e]
                })
            }
            this._vm.$set(r, s)
        } else if ("a" === t._t) {
            let i = [],
                s = [],
                r = [];
            for (let e in t) {
                if ("_t" === e) continue;
                let a;
                a = t[e], "_" === e[0] ? 0 !== a[2] && 3 !== a[2] || i.push(parseInt(e.slice(1), 10)) : 1 === a.length ? s.push({
                    index: parseInt(e, 10),
                    value: a[0]
                }) : r.push({
                    index: parseInt(e, 10),
                    delta: a
                })
            }
            let a = this._vm.$get(e),
                o = new Array(a.length);
            for (let e = 0; e < a.length; ++e) o[e] = a[e];
            for (let e = (i = i.sort(c.numerically)).length - 1; e >= 0; e--) {
                let r = i[e],
                    a = t["_" + r],
                    n = o.splice(r, 1)[0];
                3 === a[2] && s.push({
                    index: a[1],
                    value: n
                })
            }
            s = s.sort(c.numericallyBy("index"));
            for (let e = 0; e < s.length; e++) {
                let t = s[e];
                o.splice(t.index, 0, t.value)
            }
            if ((i.length || s.length) && this._vm.$set(e, o), r.length > 0)
                for (let t = 0; t < r.length; t++) {
                    let i = r[t];
                    this._patchAt(`${e}[${i.index}]`, i.delta)
                }
        } else
            for (let i in t) this._patchAt(`${e}.${i}`, t[i])
    }
});