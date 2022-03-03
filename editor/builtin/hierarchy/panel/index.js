"use strict";
const e = require("fire-fs"),
    t = (require("fire-path"), Editor.require("packages://hierarchy/panel/utils/event")),
    r = Editor.require("packages://hierarchy/panel/utils/cache"),
    o = Editor.require("packages://hierarchy/panel/utils/operation"),
    n = Editor.require("packages://hierarchy/panel/manager");
Editor.require("packages://hierarchy/panel/utils/communication");

function i(e) {
    let t = Editor.Selection.curSelection("node");
    Editor.Ipc.sendToWins("scene:center-nodes", t), l(t, e)
}

function l(e, t) {
    let n = e[e.length - 1];
    if (!n) return;
    let i = r.queryNode(n);
    i && (i.isSearch || o.foldAllParentNodeState(i, !1), requestAnimationFrame(() => {
        let e = 20 * i.showIndex,
            r = t.clientHeight,
            o = t.scrollTop;
        e > o + r - 20 ? t.scrollTop = e - r + 20 : e < o && (t.scrollTop = e)
    }))
}
let s = function (e) {
    let t = r.queryNodes(),
        o = Editor.Selection.curSelection("node"),
        n = o[o.length - 1],
        i = o.indexOf(n),
        l = t.findIndex(e => e.id === n),
        s = t[l + ("down" === e ? 1 : -1)];
    if (!s) return;
    let c = t[l];
    s.selected ? (c.selected = !c.selected, o.splice(i, 1)) : (s.selected = !s.selected, s.selected ? o.push(s.id) : o.forEach((e, t) => {
        e === s.id && o.splice(t, 1)
    })), Editor.Selection.select("node", o, !0, !0)
};
Editor.Panel.extend({
    listeners: {
        "panel-resize"() {
            this._vm.length = (this.clientHeight - 56) / 20 + 3
        }
    },
    style: e.readFileSync(Editor.url("packages://hierarchy/panel/style/index.css")),
    template: e.readFileSync(Editor.url("packages://hierarchy/panel/template/index.html")),
    messages: {
        "scene:ready"() {
            n.startup()
        },
        "scene:reloading"() {
            n.stop()
        },
        "selection:selected"(e, t, r) {
            "node" === t && (r.forEach(e => {
                o.select(e, !0)
            }), l(r, this._vm.$els.nodes))
        },
        "selection:unselected"(e, t, r) {
            "node" === t && r.forEach(e => {
                o.select(e, !1)
            })
        },
        "scene:animation-record-changed"(e, t, n) {
            r.recording = !!t, o.ignore(n, t)
        },
        "scene:prefab-mode-changed"(e, t) {
            r.editPrefab = !!t
        },
        "change-filter"(e, t) {
            this._vm.filter = t
        },
        delete(e, t) {
            Editor.Selection.unselect("node", t, !0), Editor.Ipc.sendToPanel("scene", "scene:delete-nodes", t)
        },
        rename(e, t) {
            o.rename(t)
        },
        copy(e) {
            if (r.recording) return;
            let t = Editor.Selection.curSelection("node");
            r.copyNodes = t, Editor.Ipc.sendToPanel("scene", "scene:copy-nodes", t)
        },
        "show-path"(e, t) {
            o.print(t)
        },
        duplicate(e, t) {
            Editor.Ipc.sendToPanel("scene", "scene:duplicate-nodes", t)
        },
        filter(e, t) {
            this._vm.filter = t
        },
        hint(e, t) {
            o.hint(t)
        },
        "hierarchy:hint"(e, t) {
            this._vm.$refs.nodes.scrollToItem(t)
        }
    },
    ready() {
        this._vm = function (e, r) {
            return new Vue({
                el: e,
                data: {
                    length: 0,
                    filter: ""
                },
                watch: {},
                methods: {},
                components: {
                    tools: Editor.require("packages://hierarchy/panel/component/tools"),
                    nodes: Editor.require("packages://hierarchy/panel/component/nodes"),
                    search: Editor.require("packages://hierarchy/panel/component/search")
                },
                created() {
                    Editor.Ipc.sendToPanel("scene", "scene:is-ready", (e, t) => {
                        t && n.startup()
                    }, -1), t.on("filter-changed", e => {
                        this.filter = e, "" === e && i(this.$els.nodes)
                    }), t.on("empty-filter", () => {
                        i(this.$els.nodes)
                    })
                }
            })
        }(this.shadowRoot), this._vm.length = (this.clientHeight - 56) / 20 + 3, r.initNodeState(), r.initNodeStateProfile()
    },
    close() {
        r.saveNodeTreeStateProfile()
    },
    selectAll(e) {
        e && (e.stopPropagation(), e.preventDefault());
        let t = [];
        r.queryNodes().forEach(e => {
            t.push(e.id), e.children.length > 0 && o.fold(e.id, !1)
        }), Editor.Selection.select("node", t, !0, !1)
    },
    delete(e) {
        if (e && (e.stopPropagation(), e.preventDefault()), r.recording || r.editPrefab) return;
        let t = [];
        r.queryNodes().forEach(e => {
            e.selected && t.push(e.id)
        }), Editor.Selection.unselect("node", t, !0), Editor.Ipc.sendToPanel("scene", "scene:delete-nodes", t)
    },
    up(e) {
        e && (e.stopPropagation(), e.preventDefault());
        let t = r.queryNodes();
        for (let e = 0; e < t.length; e++) {
            let r = t[e],
                o = r.showIndex;
            if (r && r.selected) {
                for (e; e >= 0; e--) {
                    let r = t[e];
                    if ((!this._vm.filter || r.isSearch) && (r.showIndex >= 0 && r.showIndex < o)) {
                        Editor.Selection.select("node", r.id, !0, !0);
                        break
                    }
                }
                break
            }
        }
    },
    down(e) {
        e && (e.stopPropagation(), e.preventDefault());
        let t = r.queryNodes();
        for (let e = t.length - 1; e >= 0; e--) {
            let r = t[e],
                o = r.showIndex;
            if (r && r.selected) {
                for (e; e < t.length; e++) {
                    let r = t[e];
                    if ((!this._vm.filter || r.isSearch) && r.showIndex > o) {
                        Editor.Selection.select("node", r.id, !0, !0);
                        break
                    }
                }
                break
            }
        }
    },
    left(e) {
        e && (e.stopPropagation(), e.preventDefault()), r.queryNodes().forEach(e => {
            e.selected && o.fold(e.id, !0)
        })
    },
    right(e) {
        e && (e.stopPropagation(), e.preventDefault()), r.queryNodes().forEach(e => {
            e.selected && o.fold(e.id, !1)
        })
    },
    shiftUp(e) {
        e && (e.stopPropagation(), e.preventDefault()), s("up")
    },
    shiftDown(e) {
        e && (e.stopPropagation(), e.preventDefault()), s("down")
    },
    f2(e) {
        e && (e.stopPropagation(), e.preventDefault());
        let t = r.queryNodes();
        for (let e = 0; e < t.length; e++) {
            let r = t[e];
            if (r && r.selected) {
                o.rename(r.id, !0);
                break
            }
        }
    },
    find(e) {
        let t = Editor.Selection.curSelection("node");
        t.some(e => {
            let t = r.queryNode(e);
            return t && t.rename
        }) || (e && (e.stopPropagation(), e.preventDefault()), Editor.Ipc.sendToWins("scene:center-nodes", t))
    },
    copy() {
        Editor.Ipc.sendToPanel("hierarchy", "copy")
    },
    paste() {
        if (r.recording) return;
        let e = Editor.Selection.curActivate("node"),
            t = r.queryNode(e);
        t && t.parent && (e = t.parent), Editor.Ipc.sendToPanel("scene", "scene:paste-nodes", e)
    },
    duplicate() {
        if (r.recording) return;
        let e = Editor.Selection.curSelection("node");
        e.length > 0 && Editor.Ipc.sendToPanel("hierarchy", "duplicate", e)
    }
});