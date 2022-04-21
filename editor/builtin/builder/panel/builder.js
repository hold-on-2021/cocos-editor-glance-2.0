"use strict";
const e = require("fire-fs"),
    t = require("fire-path"),
    r = require("electron"),
    i = require("node-uuid"),
    o = Editor.require("app://editor/share/build-platforms"),
    a = require(Editor.url("packages://builder/utils/event")),
    s = require(Editor.url("packages://builder/utils/module-events")),
    l = require(Editor.url("app://editor/share/build-utils")),
    n = require(Editor.url("packages://builder/panel/platform/android")),
    d = require(Editor.url("packages://builder/panel/platform/web-desktop")),
    u = require(Editor.url("packages://builder/panel/platform/web-mobile")),
    c = require(Editor.url("packages://builder/panel/platform/fb-instant-games")),
    p = require(Editor.url("packages://builder/panel/platform/android-instant")),
    h = require(Editor.url("packages://builder/panel/platform/windows")),
    m = require(Editor.url("packages://builder/panel/platform/ios")),
    f = require(Editor.url("packages://builder/panel/platform/mac")),
    b = require("electron").remote.dialog,
    {
        promisify: g
    } = require("util"),
    E = Editor.remote.Profile.load("global://settings.json"),
    v = Editor.remote.Profile.load("global://features.json"),
    k = {
        local: null,
        project: null,
        anysdk: null
    };
let P = v.get("xiaomi-runtime") || !1,
    _ = v.get("alipay-minigame") || !1,
    x = v.get("qtt-runtime") || !1,
    B = ["web-mobile", "web-desktop", "fb-instant-games", "android", "android-instant", "ios", _ ? "alipay" : "HIDDEN", x ? "qtt-game" : "HIDDEN", "jkw-game", "huawei", "quickgame", "qgame", P ? "xiaomi" : "HIDDEN", "baidugame", "baidugame-subcontext", "wechatgame", "wechatgame-subcontext", "cocos-runtime", "qqplay", "mac", "win32"];
Editor.Panel.extend({
    style: e.readFileSync(Editor.url("packages://builder/panel/builder.css")),
    template: e.readFileSync(Editor.url("packages://builder/panel/builder.html")),
    messages: {
        "builder:state-changed": function (e, t, r) {
            if (this._vm) {
                if (this._vm.setSystemBarProgress("error" === t || "finish" === t ? -1 : r), r *= 100, "error" === t) return this._vm.buildProgress = r, this._vm.buildState = "failed", this._vm.task = "", void 0;
                if ("finish" === t) return this._vm.buildProgress = 100, this._vm.buildState = "completed", this._vm.task = "", void 0;
                this._vm.buildProgress = r, this._vm.buildState = t
            }
        },
        "builder:events": function (e, t, ...r) {
            a.emit(t, ...r)
        },
        "keystore:created": function (e, t) {
            this._vm.local.keystorePath = t.path, this._vm.local.keystorePassword = t.password, this._vm.local.keystoreAlias = t.alias, this._vm.local.keystoreAliasPassword = t.aliasPassword
        },
        "asset-db:assets-deleted": function (e, t) {
            this._vm.scenes = this._vm.scenes.filter(e => t.find(t => t.uuid !== e.value))
        },
        "asset-db:assets-moved": function (e, t) {
            t.forEach(e => {
                let t = this._vm.scenes.find(t => t.value === e.uuid);
                t && (t.text = e.url, t.checked = !t.checked, setTimeout(() => {
                    t.checked = !t.checked
                }, 0))
            })
        },
        "asset-db:assets-created": function (e, t) {
            t.forEach(e => {
                "scene" === e.type && this._vm.scenes.push({
                    value: e.uuid,
                    text: e.url,
                    checked: !0
                })
            })
        }
    },
    ready() {
        let a = this.profiles.local,
            g = this.profiles.project;
        a.get("actualPlatform") || a.set("actualPlatform", a.get("platform")),
            function (e) {
                let t = e.get("platform"),
                    r = Object.keys(o),
                    i = r.includes(t);
                if (i) return;
                let a = Editor.remote.Builder.simpleBuildTargets[t];
                t = a && a.extends || t, (i = r.includes(t)) || (t = "web-mobile", e.set("actualPlatform", "web-mobile")), e.set("platform", t)
            }(a),
            function (e) {
                let t = e.get("packageName");
                if (!t) return;
                const r = ["android", "android-instant", "ios", "mac"];
                for (let i of r) {
                    let r = e.get(i);
                    r && !r.packageName && (r.packageName = t, e.set(i, r))
                }
            }(g);
        let v = {},
            P = [u, n, p, d, c, h, m, f],
            _ = Editor.remote.Builder.simpleBuildTargets;
        for (let e in _) {
            let t = _[e];
            if (t.settings) {
                let e = require(t.settings);
                !e.name && (e.name = t.platform), P.push(e)
            } else Editor.warn("Can not load package", t.name)
        }
        P.forEach(e => {
            e.props || (e.props = {});
            for (let t in k) !e.props[t] && (e.props[t] = k[t]);
            v[e.name] = e
        });
        let x = {
            platforms: function (e) {
                let t = [];
                t.push({
                    value: "web-mobile",
                    text: Editor.T("BUILDER.platforms.web-mobile")
                }), t.push({
                    value: "web-desktop",
                    text: Editor.T("BUILDER.platforms.web-desktop")
                }), t.push({
                    value: "fb-instant-games",
                    text: Editor.T("BUILDER.platforms.fb-instant-games")
                }), t.push({
                    value: "android",
                    text: Editor.T("BUILDER.platforms.android")
                }), t.push({
                    value: "android-instant",
                    text: Editor.T("BUILDER.platforms.android-instant")
                }), "darwin" === process.platform && (t.push({
                    value: "ios",
                    text: Editor.T("BUILDER.platforms.ios")
                }), t.push({
                    value: "mac",
                    text: Editor.T("BUILDER.platforms.mac")
                })), "win32" === process.platform && t.push({
                    value: "win32",
                    text: Editor.T("BUILDER.platforms.win32")
                });
                let r = Editor.remote.Builder.simpleBuildTargets,
                    i = [];
                for (let e in r) {
                    let t = r[e];
                    t.settings && i.push({
                        value: t.platform,
                        text: t.name
                    })
                }
                return t = t.concat(i), B.map(e => {
                    if ("string" == typeof e) return t.find(t => t.value === e); {
                        let r = e[Editor.lang];
                        return t.find(e => e.text.replace(/\s/g, "").toLowerCase() === r.replace(/\s/g, "").toLowerCase())
                    }
                }).filter(Boolean)
            }(),
            scenes: [],
            all: !1,
            task: "",
            record: "",
            buildState: "idle",
            buildProgress: 0,
            anysdk: "zh" === Editor.lang,
            local: a.getSelfData(),
            project: g.getSelfData()
        };
        var w = this._vm = new window.Vue({
            el: this.shadowRoot,
            data: x,
            computed: {
                actualPlatform: {
                    get() {
                        return this.local.actualPlatform
                    },
                    set(e) {
                        this.local.platform = this._actualPlatform2Platform(e), this.local.actualPlatform = e
                    }
                },
                isNative() {
                    return o[this.local.platform].isNative
                },
                needPlayBtn() {
                    var e = Editor.remote.Builder,
                        t = e.simpleBuildTargets[this.local.actualPlatform];
                    return !(!t || "object" != typeof t.buttons[1]) || (!t || !t.buttons || t.buttons.includes(e.DefaultButtons.Play))
                },
                needCompile() {
                    var e = Editor.remote.Builder,
                        t = e.simpleBuildTargets[this.local.actualPlatform];
                    return t && t.buttons ? t.buttons.includes(e.DefaultButtons.Compile) : o[this.local.platform].isNative
                }
            },
            watch: {
                local: {
                    handler(e) {
                        this.saveLocalData()
                    },
                    deep: !0
                },
                project: {
                    handler(e) {
                        this.saveProjectData()
                    },
                    deep: !0
                },
                scenes: {
                    handler(e) {
                        var t = this.project.startScene,
                            r = !1;
                        for (let o = 0; o < e.length; o++) {
                            let a = e[o];
                            if (a.text.startsWith("db://assets/resources/") || t === a.value) r = !0;
                            else {
                                var i = this.project.excludeScenes.indexOf(a.value);
                                a.checked || -1 !== i ? a.checked && -1 !== i && this.project.excludeScenes.splice(i, 1) : this.project.excludeScenes.push(a.value)
                            }
                        }
                        e.length > 0 && !r && (this.project.startScene = e[0].value), this.all = this.scenes.every(function (e) {
                            return e.checked
                        })
                    },
                    deep: !0
                }
            },
            components: v,
            methods: {
                setSystemBarProgress(e) {
                    Editor.Ipc.sendToMain("builder:update-system-progress", e)
                },
                saveLocalData() {
                    Object.keys(this.local).forEach(e => {
                        a.set(e, this.local[e])
                    }), a.save()
                },
                saveProjectData() {
                    Object.keys(this.project).forEach(e => {
                        g.set(e, this.project[e])
                    }), g.save()
                },
                t: e => Editor.T(e),
                _actualPlatform2Platform(e) {
                    let t = Editor.remote.Builder.simpleBuildTargets[e];
                    return t && t.extends || e
                },
                _onOpenCompileLogFile(e) {
                    e.stopPropagation(), Editor.Ipc.sendToMain("app:open-cocos-console-log")
                },
                _onChooseDistPathClick(e) {
                    e.stopPropagation();
                    let r = Editor.Dialog.openFile({
                        defaultPath: l.getAbsoluteBuildPath(this.local.buildPath),
                        properties: ["openDirectory"]
                    });
                    r && r[0] && (t.contains(Editor.Project.path, r[0]) ? (this.local.buildPath = t.relative(Editor.Project.path, r[0]).replace(/\\/g, "/"), "" === this.local.buildPath && (this.local.buildPath = "./")) : this.local.buildPath = r[0])
                },
                _onShowInFinderClick(t) {
                    t.stopPropagation();
                    let i = l.getAbsoluteBuildPath(this.local.buildPath);
                    if (!e.existsSync(i)) return Editor.warn("%s not exists!", i), void 0;
                    r.shell.showItemInFolder(i), r.shell.beep()
                },
                _onSelectAllCheckedChanged(e) {
                    if (!this.scenes) return;
                    let t = this.project.startScene;
                    for (let i = 0; i < this.scenes.length; i++) {
                        let o = this.scenes[i];
                        if (!o.text.startsWith("db://assets/resources/") && t !== o.value) {
                            o.checked = e.detail.value;
                            var r = this.project.excludeScenes.indexOf(o.value);
                            o.checked || -1 !== r ? o.checked && -1 !== r && this.project.excludeScenes.splice(r, 1) : this.project.excludeScenes.push(o.value)
                        }
                    }
                },
                startTask(e, t) {
                    this.task = e;
                    let r = Editor.Profile.load("project://project.json");
                    t.excludedModules = r.get("excluded-modules"), Editor.Ipc.sendToMain("builder:start-task", e, t)
                },
                _onBuildClick(e) {
                    e.stopPropagation(), Editor.Ipc.sendToPanel("scene", "scene:query-dirty-state", (e, t) => {
                        if (t.dirty) return Editor.error(t.name + " " + Editor.T("BUILDER.error.dirty_info")), void 0;
                        this._build()
                    })
                },
                async _build() {
                    this.saveLocalData();
                    var r = l.getAbsoluteBuildPath(this.local.buildPath),
                        i = t.win32.dirname(r),
                        n = this.local.platform;
                    let d = o[n].isNative;
                    if (!e.existsSync(i)) return b.showErrorBox(Editor.T("BUILDER.error.build_error"), Editor.T("BUILDER.error.build_dir_not_exists", {
                        buildDir: i
                    })), void 0;
                    if (-1 !== r.indexOf(" ")) return b.showErrorBox(Editor.T("BUILDER.error.build_error"), Editor.T("BUILDER.error.build_path_contains_space")), void 0;
                    if (/.*[\u4e00-\u9fa5]+.*$/.test(r)) return b.showErrorBox(Editor.T("BUILDER.error.build_error"), Editor.T("BUILDER.error.build_path_contains_chinese")), void 0;
                    if (!/^[a-zA-Z0-9_-]*$/.test(this.project.title)) return b.showErrorBox(Editor.T("BUILDER.error.build_error"), Editor.T("BUILDER.error.project_name_not_legal")), void 0;
                    let u = l.getOptions(g, a),
                        c = this.$children[0];
                    if (!c || !c.checkParams || await c.checkParams(u)) {
                        Editor.Ipc.sendToAll("builder:state-changed", "ready", 0);
                        var p = this.scenes.filter(function (e) {
                            return e.checked
                        }).map(function (e) {
                            return e.value
                        });
                        if (p.length > 0) {
                            u.actualPlatform = this.local.actualPlatform, u.scenes = p;
                            let e = u.platform;
                            e && (d && "android-instant" !== e && (u.inlineSpriteFrames = u.inlineSpriteFrames_native), u.embedWebDebugger = ("web-mobile" === e || "fb-instant-games" === e) && u.embedWebDebugger), this.startTask("build", u), Editor.Ipc.sendToMain("metrics:track-event", {
                                category: "Project",
                                action: "Build",
                                label: u.actualPlatform || e
                            }), s.trackModuleEvent()
                        } else b.showErrorBox(Editor.T("BUILDER.error.build_error"), Editor.T("BUILDER.error.select_scenes_to_build"))
                    }
                },
                _onCompileClick(e) {
                    e.stopPropagation(), this.startTask("compile", l.getOptions(g, a))
                },
                _onStopCompileClick: function (e) {
                    e.stopPropagation(), Editor.Ipc.sendToMain("app:stop-compile")
                },
                _onPreviewClick(r) {
                    if (r.stopPropagation(), "android-instant" === this.local.platform && !e.existsSync(t.join(E.get("android-sdk-root"), "extras/google/instantapps/ia"))) return b.showErrorBox(Editor.T("BUILDER.error.build_error"), Editor.T("BUILDER.error.instant_utils_not_found")), void 0;
                    var i = l.getOptions(g, a),
                        o = Editor.remote.Builder,
                        s = o.simpleBuildTargets[this.local.actualPlatform];
                    if (s && s.buttons) {
                        let e = "object" == typeof s.buttons[1];
                        if (e || s.buttons.includes(o.DefaultButtons.Play))
                            if (e) {
                                let e = s.buttons[1].message;
                                Editor.Ipc.sendToMain(`${s.package}:${e}`, i)
                            } else Editor.Ipc.sendToMain(`${s.package}:play`, i)
                    } else Editor.Ipc.sendToMain("app:run-project", i)
                },
                _openExternal(e, t) {
                    e.stopPropagation(), r.shell.openExternal(t)
                },
                _onRecordClick(e) {
                    let r = function (e) {
                            return ["FullYear", "Month", "Date", "Hours", "Minutes", "Seconds"].map(t => {
                                let r = e[`get${t}`]();
                                return "Month" === t && r++, r < 10 && (r = "0" + r), r
                            }).join("")
                        }(new Date),
                        i = t.join(Editor.Project.path, `/temp/android-instant-games/profiles/${r}`);
                    Editor.Ipc.sendToMain("app:play-on-device", {
                        platform: "simulator",
                        recordPath: i
                    })
                },
                _onRefactorClick(e) {
                    Editor.Panel.open("google-instant-games")
                }
            }
        });
        w.project.title || (w.project.title = Editor.Project.name), w.project.xxteaKey || (w.project.xxteaKey = i.v4().substr(0, 16)), w.local.buildPath || (w.local.buildPath = "./build"), Editor.Ipc.sendToMain("builder:query-current-state", (e, t) => {
            if (e) return Editor.warn(e);
            w.task = t.task, Editor.Ipc.sendToAll("builder:state-changed", t.state, t.progress)
        }), Editor.assetdb.queryAssets(null, "scene", function (e, t) {
            var r = !1;
            r = r || function (e, t) {
                    for (var r = !1, i = 0; i < e.length; i++) {
                        let o = e[i];
                        t.some(e => e.uuid === o) || (r = !0, e.splice(i--, 1))
                    }
                    return r
                }(w.project.excludeScenes, t),
                function (e, t, r) {
                    if (1 === t.length) {
                        let r = t[0];
                        e.push({
                            value: r.uuid,
                            text: r.url,
                            checked: !0
                        })
                    } else t.forEach(t => {
                        e.push({
                            value: t.uuid,
                            text: t.url,
                            checked: -1 === r.indexOf(t.uuid)
                        })
                    })
                }(w.scenes, t, w.project.excludeScenes),
                function (e, t) {
                    var r = e.startScene;
                    let i = !!t.find(function (e) {
                        return e.value === r
                    });
                    r && i || (t.length > 0 ? e.startScene = t[0].value : e.startScene = "")
                }(w.project, w.scenes), r && w.project.save()
        })
    }
});
