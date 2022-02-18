"use strict";
const {
    ipcMain: e
} = require("electron");
var t, i, r, n, s, o = !1;

function c() {
    var e = Editor.require("app://asset-db/lib/meta").get(Editor.assetdb, Editor.currentSceneUuid),
        t = Editor.stashedScene.sceneJson;
    if (e) {
        var i = JSON.parse(t),
            r = Editor.serialize.findRootObject(i, "cc.SceneAsset");
        r ? r.asyncLoadAssets = e.asyncLoadAssets : Editor.warn("Can not find cc.SceneAsset in stashed scene");
        var n = Editor.serialize.findRootObject(i, "cc.Scene");
        return n ? n.autoReleaseAssets = e.autoReleaseAssets : Editor.warn("Can not find cc.Scene in stashed scene"), JSON.stringify(i)
    }
    return t
}
module.exports = {
    userMiddlewares: [],
    previewPort: 7456,
    start: function (e, o) {
        var a = require("fire-fs"),
            d = require("fire-path"),
            u = require("os"),
            l = require("del"),
            p = require("express"),
            f = require("http"),
            g = require("mobile-detect"),
            v = require("async");
        const h = require("compression");
        var E = this;
        this._validateStashedScene = e;
        var m = d.join(u.tmpdir(), "fireball-game-builds");
        l.sync(d.join(m, "**/*"), {
            force: !0
        }), (i = p()).use(h());
        let j = d.join(Editor.Project.path, "preview-templates");
        a.existsSync(j) || (j = Editor.url("unpack://static/preview-templates")), i.set("views", j), i.set("view engine", "jade");
        const S = require("ejs");
        i.engine("html", S.renderFile), i.engine("ejs", S.renderFile), i.locals.basedir = i.get("views"), i.use(function (e, t, i) {
                var r = E.userMiddlewares;
                Array.isArray(r) && r.length > 0 ? v.eachSeries(r, (i, r) => {
                    if (!i) return Editor.warn("Web Preview: Invalid element in userMiddlewares, please check your editor packages."), r(null);
                    i(e, t, r)
                }, i) : i()
            }), i.use("/build", function (e, t, i) {
                n ? n(e, t, i) : t.send("Please build your game project first!")
            }), i.use("/preview-android-instant", function (e, t, i) {
                s ? s(e, t, i) : t.send("Please build your android instant project first!")
            }), i.get("/", function (e, t) {
                var i = e.headers["user-agent"],
                    r = new g(i),
                    n = a.existsSync(d.join(Editor.Project.path, "library", "bundle.project.js")),
                    s = -1 !== i.indexOf("MicroMessenger");
                let o = Editor.require("app://editor/share/quick-compile/check-auto-build-engine")() ? ".cache/dev/__quick_compile__.js" : "cocos2d-js-for-preview.js",
                    c = {
                        title: "CocosCreator | " + Editor.Project.name,
                        cocos2d: o,
                        hasProjectScript: n,
                        tip_sceneIsEmpty: Editor.T("PREVIEW.scene_is_empty"),
                        enableDebugger: !!r.mobile() || s
                    };
                try {
                    Object.assign(c, a.readJsonSync(d.join(j, "configs/options.json")))
                } catch (e) {}
                t.render(a.existsSync(d.join(j, "index.html")) ? "index.html" : a.existsSync(d.join(j, "index.ejs")) ? "index.ejs" : "index", c)
            }), i.get("/compile", function (e, t) {
                Editor.Compiler.compileScripts(!1, (e, i) => {
                    i || (e ? (t.send("Compiling script successful!"), Editor.Compiler.reload()) : t.send("Compile failed!"))
                })
            }), i.get("/update-db", function (e, t) {
                Editor.assetdb.submitChanges(), t.send("Changes submitted")
            }), i.get(["/app/engine/*", "/engine/*"], function (e, t) {
                var i = d.join(Editor.url("unpack://engine"), e.params[0]);
                t.sendFile(i)
            }), i.get("/engine-dev/*", function (e, t) {
                var i = d.join(Editor.url("unpack://engine-dev"), e.params[0]);
                t.sendFile(i)
            }), i.get("/app/editor/static/*", function (e, t) {
                var i = Editor.url("unpack://static/" + e.params[0]);
                t.sendFile(i)
            }), i.get("/app/*", function (e, t) {
                var i = Editor.url("app://" + e.params[0]);
                t.sendFile(i)
            }), i.get("/project/*", function (e, t) {
                var i = d.join(Editor.Project.path, e.params[0]);
                t.sendFile(i)
            }), i.get("/preview-scripts/*", function (e, t) {
                let i = Editor.ProjectCompiler.DEST_PATH;
                var r = d.join(i, e.params[0]);
                t.sendFile(r)
            }), i.get("/res/raw-*", function (e, t) {
                var i = e.params[0];
                i = Editor.assetdb._fspath("db://" + i), t.sendFile(i)
            }), i.get("/res/import/*", function (e, t) {
                var i = e.params[0];
                if (Editor.stashedScene && Editor.currentSceneUuid && d.basenameNoExt(i) === Editor.currentSceneUuid) return t.send(c()), void 0;
                i = d.join(Editor.importPath, i), t.sendFile(i)
            }), i.get("/settings.js", function (e, t) {
                E.query("settings.js", function (e, i) {
                    if (e) return o(e);
                    t.send(i)
                })
            }), i.get("/preview-scene.json", function (e, t) {
                E.getPreviewScene(function (e) {
                    return o(e)
                }, function (e) {
                    t.send(e)
                }, function (e) {
                    t.sendFile(e)
                })
            }), i.get("/*", function (e, t, i) {
                return p.static(j)(e, t, i)
            }), i.use(function (e, t, i, r) {
                console.error(e.stack), r(e)
            }), i.use(function (e, t, i, r) {
                t.xhr ? i.status(e.status || 500).send({
                    error: e.message
                }) : r(e)
            }), i.use(function (e, t) {
                t.status(404).send({
                    error: "404 Error."
                })
            }),
            function e(t, i, r) {
                function n() {
                    t.removeListener("error", s), r(null, i)
                }

                function s(s) {
                    if (t.removeListener("listening", n), "EADDRINUSE" !== s.code && "EACCES" !== s.code) return r(s);
                    e(t, ++i, r)
                }
                t.once("error", s), t.once("listening", n), t.listen(i)
            }(r = f.createServer(i), this.previewPort, (e, t) => {
                if (e) return o && o(e), void 0;
                this.previewPort = t, Editor.success(`preview server running at http://localhost:${this.previewPort}`), o && o()
            }),
            function (e) {
                var i = 0;
                (t = require("socket.io")(e)).on("connection", function (e) {
                    e.emit("connected"), i += 1, Editor.Ipc.sendToMainWin("preview-server:connects-changed", i), e.on("disconnect", function () {
                        i -= 1, Editor.Ipc.sendToMainWin("preview-server:connects-changed", i)
                    })
                })
            }(r)
    },
    query: function (e, t, i) {
        if (this._validateStashedScene) switch (void 0 === i && (i = t, t = "web-desktop"), e) {
            case "settings.js":
                this._validateStashedScene(() => {
                    let e = Editor.Profile.load("project://project.json"),
                        r = {
                            designWidth: Editor.stashedScene.designWidth,
                            designHeight: Editor.stashedScene.designHeight,
                            groupList: e.get("group-list"),
                            collisionMatrix: e.get("collision-matrix"),
                            platform: t,
                            scripts: Editor.ProjectCompiler.scripts
                        };
                    require("../../core/gulp-build").buildSettings({
                        customSettings: r,
                        sceneList: Editor.sceneList,
                        debug: !0,
                        preview: !0
                    }, i)
                });
                break;
            case "stashed-scene.json":
                this._validateStashedScene(() => {
                    i && i(null, c())
                })
        }
    },
    getPreviewScene(e, t, i) {
        let r = Editor._projectProfile.get("start-scene");
        if ("current" !== r && r !== Editor.currentSceneUuid && Editor.assetdb.existsByUuid(r)) {
            i(Editor.assetdb._uuidToImportPathNoExt(r) + ".json")
        } else this.query("stashed-scene.json", (i, r) => {
            if (i) return e(i);
            t(r)
        })
    },
    stop: function () {
        r && r.close(function () {
            Editor.info("shutdown preview server"), r = null
        })
    },
    browserReload: function () {
        o || (o = setTimeout(function () {
            t.emit("browser:reload"), clearTimeout(o), o = !1
        }, 50))
    },
    setPreviewBuildPath: function (e) {
        var t = require("express");
        n = t.static(e)
    },
    setPreviewAndroidInstantPath: function (e) {
        var t = require("express");
        Editor.log("express path is ", e), s = t.static(e)
    },
    _validateStashedScene: null
}, Editor._buildCommand || Editor._compileCommand || module.exports.start(t => {
    Editor.stashedScene ? t() : (e.once("app:preview-server-scene-stashed", t), Editor.Ipc.sendToWins("scene:preview-server-scene-stashed"))
});