const e = require("fire-fs"),
    t = require("fire-path"),
    s = require("fire-url"),
    i = require("globby"),
    a = Editor.require("packages://assets/panel/utils/event"),
    r = Editor.require("packages://assets/panel/utils/cache"),
    o = Editor.require("packages://assets/panel/utils/operation"),
    n = Editor.require("packages://assets/panel/utils/utils");
let l = t.join(Editor.Project.path, "/settings/project.json"),
    d = function (e) {
        return e.length <= 1 ? e[0] : e[e.length - 1]
    },
    u = function (e, t) {
        let s = Editor.Selection.curSelection("asset"),
            i = d(s),
            a = t[t.findIndex(e => e.id === i) + ("down" === e ? 1 : -1)];
        a && Editor.Selection.select("asset", [a.id], !0, !0)
    },
    c = function (e) {
        let t = r.queryShowNodes(),
            s = Editor.Selection.curSelection("asset"),
            i = d(s),
            a = s.indexOf(i),
            o = t.findIndex(e => e.id === i),
            n = t[o],
            l = t[o + ("down" === e ? 1 : -1)];
        l && (l.selected ? (n.selected = !n.selected, s.splice(a, 1)) : (l.selected = !l.selected, l.selected ? s.push(l.id) : s.forEach((e, t) => {
            e === l.id && s.splice(t, 1)
        })), Editor.Selection.select("asset", s, !0, !0))
    };
Editor.Panel.extend({
    listeners: {
        "panel-resize"() {
            this._vm.length = (this.clientHeight - 56) / r.lineHeight + 3
        }
    },
    style: e.readFileSync(Editor.url("packages://assets/panel/style/index.css")),
    template: e.readFileSync(Editor.url("packages://assets/panel/template/index.html")),
    ready() {
        this._vm = function (e, t) {
            return new Vue({
                el: e,
                data: {
                    length: 0,
                    filter: "",
                    currentPath: "db://",
                    loading: !0
                },
                watch: {},
                methods: {},
                components: {
                    tools: Editor.require("packages://assets/panel/component/tools"),
                    nodes: Editor.require("packages://assets/panel/component/nodes"),
                    search: Editor.require("packages://assets/panel/component/search")
                },
                created() {
                    o.loadAssets(), a.on("filter-changed", e => {
                        this.filter = e
                    }), a.on("start-loading", () => {
                        this.loading = !0
                    }), a.on("finish-loading", () => {
                        this.loading = !1;
                        let e = Editor.Selection.curSelection("asset");
                        e.forEach(e => {
                            o.select(e, !0)
                        }), e.length > 0 && this.$refs.nodes.scrollToItem(e[0])
                    }), a.on("empty-filter", () => {
                        let e = Editor.Selection.curSelection("asset");
                        e.length > 0 && this.$refs.nodes.scrollToItem(e[0])
                    })
                }
            })
        }(this.shadowRoot), this._vm.length = (this.clientHeight - 56) / r.lineHeight + 3
    },
    close() {
        a.removeAllListeners(), this._vm && this._vm.$destroy()
    },
    messages: {
        "assets:copy"(e, t) {
            let s = Editor.Selection.curSelection("asset"); - 1 === s.indexOf(t) ? r.copyUuids = [t] : r.copyUuids = s
        },
        async "assets:paste"(e, s) {
            let i = await n.uuid2path(s);
            if (!await n.isDir(i) && (i = t.dirname(i), !await n.isDir(i))) return Editor.warn("The selected location is not a folder.");
            if (r.copyUuids && await n.exists(i))
                for (let e = 0; e < r.copyUuids.length; e++) {
                    let s = r.copyUuids[e];
                    if (await n.isReadOnly(s)) return;
                    let a = await n.uuid2path(s);
                    if (!a) return Editor.warn(`File is missing - ${s}`);
                    let o = t.basename(a),
                        l = t.join(i, o);
                    if (await n.isDir(a)) {
                        let e = t.dirname(l);
                        if (e === a || n.isSubDir(e, a)) return Editor.Dialog.messageBox({
                            type: "warning",
                            title: " ",
                            buttons: [Editor.T("MESSAGE.sure")],
                            message: Editor.T("MESSAGE.assets.paste_folder_warn"),
                            noLink: !0,
                            defaultId: 0
                        }), void 0
                    }
                    if (!(l = await n.copy(a, l))) return;
                    let d = t.relative(Editor.url("db://assets"), l);
                    Editor.assetdb.refresh(`db://assets/${d}`)
                }
        },
        "assets:end-refresh"(e) {
            this.hideLoader()
        },
        "assets:start-refresh"(e) {
            this.showLoaderAfter(100)
        },
        "assets:sort"(e) {
            o.autoSort(), this._vm.filter && a.emit("search:sort")
        },
        "selection:selected"(e, t, s) {
            if ("asset" !== t || !s) return;
            let i = d(s);
            this._vm.currentPath = o.getRealUrl(i), s.forEach(e => {
                o.select(e, !0)
            }), this._vm.filter ? this._vm.$refs.search.scrollIfNeeded(i) : this._vm.$refs.nodes.scrollIfNeeded(i)
        },
        "change-filter"(e, t) {
            this._vm.filter = t
        },
        "selection:unselected"(e, t, s) {
            "asset" === t && s.forEach(e => {
                o.select(e, !1)
            })
        },
        "asset-db:assets-created"(e, s) {
            let i = [];
            if (s.forEach(e => {
                    if (e.hidden) return;
                    let a = t.basenameNoExt(e.path),
                        r = t.extname(e.path);
                    "folder" === e.type ? (a = t.basename(e.path), r = "") : "mount" === e.type && (a = e.name, r = ""), o.add({
                        name: a,
                        extname: r,
                        type: e.type,
                        isSubAsset: e.isSubAsset,
                        readonly: e.readonly,
                        hidden: !1,
                        parentUuid: e.parentUuid,
                        uuid: e.uuid
                    }), this._activeWhenCreated === e.url && (this._activeWhenCreated = null, Editor.Selection.select("asset", e.uuid)), s.some(t => t.uuid === e.parentUuid) || i.push(e)
                }), i.forEach(e => {
                    window.requestAnimationFrame(() => {
                        o.hint(e.uuid);
                        let t = r.queryNode(e.uuid);
                        t && t.parent && o.fold(t.parent, !1)
                    })
                }), i.length) {
                let e = i[0];
                this._vm.$refs.nodes.scrollToItem(e.uuid)
            }
        },
        "asset-db:assets-moved"(e, s) {
            let i = Editor.Utils.arrayCmpFilter(s, (e, s) => t.contains(e.srcPath, s.srcPath) ? 1 : t.contains(s.srcPath, e.srcPath) ? -1 : 0);
            i.forEach(e => {
                Editor.assetdb.queryInfoByUuid(e.uuid, (s, i) => {
                    let a = "";
                    a = "folder" === i.type ? t.basename(e.destPath) : t.basenameNoExt(e.destPath), o.move(e.uuid, e.parentUuid, a)
                })
            }), i.forEach(e => {
                window.requestAnimationFrame(() => {
                    o.hint(e.uuid)
                })
            })
        },
        "asset-db:assets-deleted"(e, t) {
            t.forEach(e => {
                o.remove(e.uuid)
            });
            let s = t.map(e => e.uuid);
            Editor.Selection.unselect("asset", s, !0)
        },
        "asset-db:asset-changed"(e, t) {
            o.hint(t.uuid), "texture" !== t.type && "sprite-frame" !== t.type || o.updateIcon(t.uuid)
        },
        "asset-db:asset-uuid-changed"(e, t) {
            o.updateUuid(t.oldUuid, t.uuid)
        },
        "assets:hint"(e, t) {
            this._vm.$refs.nodes.scrollToItem(t)
        },
        "assets:search"(e, t) {
            this._vm.filter = t
        },
        "assets:clearSearch"(e) {
            this._vm.filter = ""
        },
        async "assets:new-asset"(a, n, d) {
            let u, c, h;
            if (d) {
                let e = Editor.Selection.contexts("asset");
                if (e.length > 0) {
                    let s = e[0];
                    "folder" === (c = r.queryNode(s)).assetType || "mount" === c.assetType ? h = o.getRealUrl(c.id) : (u = o.getRealUrl(c.id), h = t.dirname(u))
                } else h = "db://assets"
            } else {
                let e = Editor.Selection.curActivate("asset");
                if (e) {
                    c = r.queryNode(e), u = o.getRealUrl(e), h = "folder" === c.assetType || "mount" === c.assetType || c === r.queryRoot() ? u : t.dirname(u)
                } else h = "db://assets"
            }
            let p = n.data;
            n.url && (p = e.readFileSync(Editor.url(n.url), {
                encoding: "utf8"
            }));
            let f = s.join(h, n.name);
            switch (s.extname(f)) {
                case ".fire":
                    let a = e.readFileSync(l, "utf-8");
                    a = JSON.parse(a), (p = JSON.parse(p)).forEach(e => {
                        "cc.Canvas" === e.__type__ && (e._designResolution = {
                            __type__: "cc.Size",
                            width: a["design-resolution-width"],
                            height: a["design-resolution-height"]
                        }, e._fitWidth = a["fit-width"], e._fitHeight = a["fit-height"])
                    }), p = JSON.stringify(p);
                    break;
                case ".pac":
                    if (i.sync(t.join(Editor.remote.assetdb.urlToFspath(h), "*.pac")).length > 0) return Editor.Dialog.messageBox({
                        type: "warning",
                        title: " ",
                        buttons: [Editor.T("MESSAGE.sure")],
                        message: Editor.T("MESSAGE.assets.auto_atlas"),
                        noLink: !0,
                        defaultId: 0
                    }), void 0;
                    break;
                case ".js":
                case ".ts":
                    f = await o.getUniqueUrl(f, ["typescript", "javascript"])
            }(() => {
                this._activeWhenCreated = f, Editor.assetdb.create(f, p, function (e, t) {
                    setTimeout(function () {
                        if (!t) return;
                        let e = t[0].uuid;
                        Editor.Selection.select("asset", e, !0, !0), r.queryNode(e) && o.rename(e)
                    }, 50)
                })
            })()
        },
        "assets:find-usages"(e, t) {
            this._vm.filter = "used:" + t
        },
        "assets:rename"(e, t) {
            o.rename(t)
        },
        "assets:delete"(e, t) {
            this._delete(t)
        }
    },
    selectAll(e) {
        e && (e.stopPropagation(), e.preventDefault());
        let t = r.queryShowNodes().map(e => e.id);
        Editor.Selection.select("asset", t, !0, !0)
    },
    showLoaderAfter(e) {
        this._vm.loading || this._loaderID || (this._loaderID = setTimeout(() => {
            this._vm.loading = !0, this._loaderID = null
        }, e))
    },
    hideLoader() {
        this._vm.loading = !1, clearTimeout(this._loaderID)
    },
    find(e) {},
    delete(e) {
        e && (e.stopPropagation(), e.preventDefault());
        let t = Editor.Selection.curSelection("asset");
        this._delete(t)
    },
    f2(e) {
        e && (e.stopPropagation(), e.preventDefault());
        let t = Editor.Selection.curSelection("asset");
        if (0 === t.length) return;
        let s = d(t);
        o.rename(s)
    },
    left(e) {
        e && (e.stopPropagation(), e.preventDefault());
        let t = Editor.Selection.curSelection("asset"),
            s = d(t);
        o.fold(s, !0)
    },
    right(e) {
        e && (e.stopPropagation(), e.preventDefault());
        let t = Editor.Selection.curSelection("asset"),
            s = d(t);
        o.fold(s, !1)
    },
    async copyFile(e) {
        e && (e.stopPropagation(), e.preventDefault()), r.copyUuids = null;
        let t = [],
            s = Editor.Selection.curSelection("asset");
        for (let e = 0; e < s.length; e++) await n.isReadOnly(s[e]) || t.push(s[e]);
        r.copyUuids = t.length > 0 ? t : null
    },
    async pasteFile(e) {
        e && (e.stopPropagation(), e.preventDefault());
        let s = Editor.Selection.curActivate("asset"),
            i = "";
        if ("mount-assets" === s ? i = Editor.url("db://assets") : Editor.Utils.UuidUtils.isUuid(s) && (i = await n.uuid2path(s)), !await n.isDir(i) && (i = t.dirname(i), !await n.isDir(i))) return Editor.warn("The selected location is not a folder.");
        if (r.copyUuids && await n.exists(i))
            for (let e = 0; e < r.copyUuids.length; e++) {
                let s = r.copyUuids[e];
                if (await n.isReadOnly(s)) return;
                let a = await n.uuid2path(s);
                if (!a) return Editor.warn(`File is missing - ${s}`);
                let o = t.basename(a),
                    l = t.join(i, o);
                if (await n.isDir(a)) {
                    let e = t.dirname(l);
                    if (e === a || n.isSubDir(e, a)) return Editor.Dialog.messageBox({
                        type: "warning",
                        title: " ",
                        buttons: [Editor.T("MESSAGE.sure")],
                        message: Editor.T("MESSAGE.assets.paste_folder_warn", {
                            filename: o
                        }),
                        noLink: !0,
                        defaultId: 0
                    }), void 0
                }
                if (!(l = await n.copy(a, l))) return;
                let d = t.relative(Editor.url("db://assets"), l);
                Editor.assetdb.refresh(`db://assets/${d}`)
            }
    },
    shiftUp(e) {
        e && (e.stopPropagation(), e.preventDefault()), c("up")
    },
    shiftDown(e) {
        e && (e.stopPropagation(), e.preventDefault()), c("down")
    },
    up(e) {
        e && (e.stopPropagation(), e.preventDefault()), u("up", this._vm.filter ? this._vm.$refs.search.showList : r.queryShowNodes())
    },
    down(e) {
        e && (e.stopPropagation(), e.preventDefault()), u("down", this._vm.filter ? this._vm.$refs.search.showList : r.queryShowNodes())
    },
    _delete(e) {
        let t = e.map(e => o.getRealUrl(e)),
            s = t;
        s.length > 3 && (s = s.slice(0, 3)).push("..."), s = s.join("\n"), 0 === Editor.Dialog.messageBox({
            type: "warning",
            buttons: [Editor.T("MESSAGE.delete"), Editor.T("MESSAGE.cancel")],
            title: Editor.T("MESSAGE.assets.delete_title"),
            message: Editor.T("MESSAGE.assets.delete_message") + "\n" + s,
            detail: Editor.T("MESSAGE.assets.delete_detail"),
            defaultId: 0,
            cancelId: 1,
            noLink: !0
        }) && Editor.assetdb.delete(t)
    }
});