"use strict";
const e = require("fire-fs"),
    t = require("path"),
    i = require("../libs/advice"),
    n = require("../libs/manager"),
    s = require("../libs/dump"),
    {
        promisify: r
    } = require("util");
exports.template = e.readFileSync(t.join(__dirname, "../template/home.html"), "utf-8");
const a = -1,
    h = 0,
    o = 1,
    c = 2,
    l = 3;
exports.watch = {
    state() {
        if (this.record) switch (this.state) {
            case o:
            case c:
                Editor.Ipc.sendToPanel("scene", "scene:change-animation-record", !1)
        }
    },
    width() {
        try {
            let e = this.$els.grid;
            e.resize(), e.repaint()
        } catch (e) {
            Editor.error(e)
        }
    },
    frame() {
        let e = this.$els.grid,
            t = this.frame * this.scale,
            n = e.clientWidth;
        try {
            let s = t + e.xAxisOffset;
            (s < 0 || s > n) && i.emit("drag-move", e.xAxisOffset + t - n / 2)
        } catch (e) {
            Editor.error(e)
        }
        s.update()
    },
    clip() {
        try {
            this.clip && this.clip.id;
            this.updateState(), this.updateMNodes(), i.emit("change-info"), i.emit("select-frame", 0)
        } catch (e) {
            Editor.error(e)
        }
    },
    hierarchy() {
        try {
            let e = Editor.Selection.curActivate("node");
            this.hierarchy.some(t => t.id === e && (i.emit("change-node", t), !0)), this.updateState(), this.updateClips()
        } catch (e) {
            Editor.error(e)
        }
    },
    sample() {
        try {
            this.initGrid()
        } catch (e) {
            Editor.error(e)
        }
    },
    record() {
        if (!(this.hierarchy && this.hierarchy.length && this.clip && this.clip.id)) return i.emit("change-frame", 0), void 0;
        for (; this.selected.length;) this.selected.pop();
        Editor.Ipc.sendToPanel("scene", "scene:query-animation-time", {
            rootId: this.hierarchy[0].id,
            clip: this.clip.id
        }, (e, t) => {
            if (e) return Editor.warn(e), void 0;
            let n = Math.round(t * this.sample);
            i.emit("change-frame", n)
        })
    }
}, exports.data = function () {
    return {
        state: -1,
        record: !1,
        paused: !0,
        event: -1,
        eline: null,
        scale: 20,
        offset: -10,
        width: 0,
        height: 0,
        duration: 0,
        speed: 1,
        sample: 60,
        mode: 0,
        ignore_pointer: !1,
        frame: 0,
        node: "",
        clip: null,
        hierarchy: [],
        mnodes: [],
        clips: [],
        props: [],
        selected: []
    }
}, exports.methods = {
    t: (e, ...t) => Editor.T(`timeline.home.${e}`, ...t),
    init() {
        let e = Editor.Selection.curActivate("node"),
            t = Editor.Selection.curSelection("node");
        this.hierarchy.every(e => -1 === t.indexOf(e.id)) && (this.hierarchy = []), e && Editor.Ipc.sendToPanel("timeline", "selection:activated", "node", e), t && t.length && Editor.Ipc.sendToPanel("timeline", "selection:selected", "node", t), Editor.Ipc.sendToPanel("scene", "scene:query-animation-record", (e, t) => {
            if (e) return Editor.warn(e), void 0;
            t.record && Editor.Ipc.sendToPanel("timeline", "selection:activated", "node", t.root), setTimeout(() => {
                t.clip && (this.clip = t.clip || {}), this.record = t.record
            }, 200)
        })
    },
    initEngine() {
        return this._initEngineFlag || window._Scene ? Promise.resolve() : new Promise((e, t) => {
            window._Scene = {}, cc.game.run({
                id: this.$els.game
            }, () => {
                this._initEngineFlag = !0, e()
            })
        })
    },
    initGrid() {
        let e = this.$els.grid;
        e.setScaleH([5, 2, 3, 2], 20, 100, "frame", this.sample), e.xAxisScaleAt(this.offset, this.scale), requestAnimationFrame(() => {
            e.resize(), e.repaint(), this.offset = e.xAxisOffset
        })
    },
    updateState() {
        this.state = a, clearTimeout(this._updateStateTimer), this._updateStateTimer = setTimeout(() => {
            this.hierarchy && this.hierarchy.length ? s.hasAnimaiton(this.hierarchy[0].id) ? this.clips && this.clips.length ? this.state = l : this.state = c : this.state = o : this.state = h
        }, 500)
    },
    async updateClips() {
        if (!this.hierarchy || !this.hierarchy.length || !this.hierarchy[0].id) return i.emit("change-clips", []), void 0;
        let e = this.hierarchy[0].id,
            t = await r(Editor.Ipc.sendToPanel)("scene", "scene:query-animation-list", e),
            n = [];
        for (let e = 0; e < t.length; e++) {
            let i = t[e],
                s = await r(Editor.Ipc.sendToPanel)("scene", "scene:query-animation-clip", i);
            if (s)(s = await r(cc.AssetLibrary.loadJson)(s))._uuid = i;
            else try {
                s = await r(cc.AssetLibrary.loadAsset)(i), n.push(s)
            } catch (e) {}
        }
        if (n.length === this.clips.length) {
            let e = !1;
            for (let t = 0; t < n.length; ++t) {
                n[t];
                let i = this.clips[t];
                if (n[t]._uuid !== i.id || n[t].name !== i.name) {
                    e = !0;
                    break
                }
            }
            if (!e) return
        }
        i.emit("change-clips", n)
    },
    updateMNodes() {
        let e = this.clip ? this.clip.id : "",
            t = this.hierarchy[0],
            i = n.Clip.queryPaths(e) || [];
        this.mnodes = i.map(e => ({
            state: 0,
            name: `/${t.name}/${e}`,
            path: e
        })).filter(e => !this.hierarchy.some(t => t.path === e.name))
    },
    scaleToChart(e, t) {
        let i = this.$els.grid,
            n = Editor.Utils.smoothScale(this.scale, e);
        n = Editor.Math.clamp(n, i.hticks.minValueScale, i.hticks.maxValueScale), this.scale = n, i.xAxisScaleAt(t, n), i.repaint(), this.offset = i.xAxisOffset
    },
    moveToChart(e) {
        let t = this.$els.grid;
        t.pan(-e, 0), t.repaint(), this.offset = t.xAxisOffset
    },
    queryPinterStyle: (e, t, i) => `transform: translateX(${e+t*i-1|0}px);`,
    _onClipChanged(e) {
        this.clips.some(t => t.name === e.target.value && (this.clip = t, Editor.Ipc.sendToPanel("scene", "scene:change-animation-current-clip", t.name), !0))
    },
    _onSampleChanged(e) {
        let t = this.clip ? this.clip.id : "";
        n.Clip.changeSample(t, e.target.value), i.emit("change-info")
    },
    _onSpeedChanged(e) {
        let t = this.clip ? this.clip.id : "";
        n.Clip.changeSpeed(t, e.target.value), i.emit("change-info")
    },
    _onModeChanged() {
        let e = this.clip ? this.clip.id : "";
        n.Clip.changeMode(e, event.target.value), i.emit("change-info")
    },
    _onPointerMouseDown(e) {
        let t = 0,
            n = this.frame;
        Editor.UI.startDrag("ew-resize", e, (e, s, r, a, h) => {
            t += isNaN(s) ? 0 : s;
            let o = Math.round(t / this.scale);
            i.emit("select-frame", Math.max(o + n, 0))
        }, (...e) => {
            let s = Math.round(t / this.scale);
            i.emit("select-frame", Math.max(s + n, 0))
        })
    },
    _onAddAnimationComponentClick() {
        this.hierarchy && this.hierarchy.length && Editor.Ipc.sendToPanel("scene", "scene:add-component", this.hierarchy[0].id, "cc.Animation")
    },
    _onCreateClipClick() {
        this.hierarchy && this.hierarchy.length && Editor.Ipc.sendToMain("timeline:create-clip-file", this.hierarchy[0].id, e => {
            setTimeout(() => {
                this.updateClips()
            }, 200)
        }, -1)
    }
}, exports.created = function () {
    let e = null;
    i.on("drag-zoom", (t, i) => {
        this.ignore_pointer = !0, this.scaleToChart(-t, i), clearTimeout(e), e = setTimeout(() => {
            this.ignore_pointer = !1
        }, 500)
    }), i.on("drag-move", t => {
        this.ignore_pointer = !0, this.moveToChart(t), clearTimeout(e), e = setTimeout(() => {
            this.ignore_pointer = !1
        }, 500)
    }), i.on("drag-key-end", e => {
        let t = this.selected.map(e => n.Clip.queryKey(e.id, e.path, e.component, e.property, e.frame)),
            s = this.selected.filter(i => {
                let s = n.Clip.queryKey(i.id, i.path, i.component, i.property, i.frame + e);
                return !(!s || -1 !== t.indexOf(s))
            });
        if (s && s.length) {
            let t = s.map(t => {
                n.Clip.queryInfo(t.id);
                return `${t.path.replace(/\/[^\/]+/,"")} - ${t.component?`${t.component}.${t.property}`:t.property} - ${t.frame+e|0}`
            });
            if (t.length > 5 && (t.length = 5, t.push("...")), 0 === Editor.Dialog.messageBox({
                    type: "question",
                    buttons: [Editor.T("timeline.manager.move_key_button_cancel"), Editor.T("timeline.manager.move_key_button_confirm")],
                    title: "",
                    message: Editor.T("timeline.manager.move_key_title"),
                    detail: `${t.join("\n")}\n${Editor.T("timeline.manager.move_key_title")}`,
                    defaultId: 0,
                    cancelId: 0,
                    noLink: !0
                })) return !1
        }
        s.forEach(t => {
            n.Clip.deleteKey(t.id, t.path, t.component, t.property, t.frame + e)
        });
        let r = this.selected.map(e => {
            return n.Clip.deleteKey(e.id, e.path, e.component, e.property, e.frame)
        });
        this.selected.forEach((t, i) => {
            let s = r[i];
            if (s) {
                let i = n.Clip.addKey(t.id, t.path, t.component, t.property, t.frame + e, s.value);
                s.curve && (i.curve = s.curve)
            }
        }), this.selected.forEach(t => {
            t.frame += e
        }), i.emit("change-info")
    }), i.on("ignore-pointer", e => {
        this.ignore_pointer = e
    }), i.on("clip-data-update", () => {
        this.updateMNodes(), i.emit("change-info")
    }), i.on("change-hierarchy", e => {
        this.hierarchy = e
    }), i.on("change-node", e => {
        this.node = e
    }), i.on("change-clips", e => {
        if (this.clips.length = 0, n.clear(), e.forEach(e => {
                n.register(e), this.clips.push({
                    id: e._uuid,
                    name: e.name
                })
            }), 0 === this.clips.length) this.clip = null;
        else if (this.clip) {
            this.clips.every(e => e.id !== this.clip.id || e.name !== this.clip.name) && (this.clip = this.clips[0])
        } else this.clip = this.clips[0];
        s.update(() => {
            this.updateState()
        })
    });
    i.on("change-frame", e => {
        this.frame = e
    }), i.on("change-record", e => {
        this.record = e
    });
    i.on("change-paused", async e => {
        Editor.Ipc.sendToPanel("scene", "scene:change-animation-state", {
            nodeId: this.node.id,
            clip: this.clip.name,
            state: e ? "pause" : "play"
        })
    }), i.on("change-info", () => {
        if (!this.clip) return;
        let e = this.clip ? this.clip.id : "",
            t = n.Clip.queryInfo(e);
        this.duration = t.duration, this.speed = t.speed, this.sample = t.sample, this.mode = t.wrapMode
    }), i.on("change-event", e => {
        this.event = e
    }), i.on("change-eline", e => {
        this.eline = e
    }), i.on("select-frame", e => {
        this.clip && (Editor.Ipc.sendToPanel("scene", "scene:animation-time-changed", {
            nodeId: this.node.id,
            clip: this.clip.name,
            time: e / this.sample
        }), i.emit("change-frame", e))
    }), require("../message/selection").activated(null, "node", Editor.Selection.curActivate("node")), i.on("create-new-clip", () => {
        this._onCreateClipClick()
    })
}, exports.compiled = function () {
    this.initEngine(), this.initGrid(), Editor.Ipc.sendToPanel("scene", "scene:is-ready", (e, t) => {
        t && this.init()
    }, -1)
};