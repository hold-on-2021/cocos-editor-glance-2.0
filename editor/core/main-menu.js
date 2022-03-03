"use strict";
const e = require("fs-extra"),
    r = require("electron"),
    l = r.BrowserWindow,
    o = r.ipcMain,
    t = Editor.require("app://editor/core/vscode-workflow");

function a(e, r) {
    let l = Editor.Selection.contexts("node")[0] || Editor.Selection.curActivate("node");
    Editor.Ipc.sendToPanel("scene", "scene:create-node-by-prefab", e, Editor.assetdb.urlToUuid(r), l)
}

function i() {
    const r = [{
        label: Editor.T("MAIN_MENU.node.create_empty"),
        message: "scene:create-node-by-classid",
        panel: "scene",
        params: ["New Node", ""]
    }, {
        label: Editor.T("MAIN_MENU.node.renderers"),
        submenu: [{
            label: Editor.T("MAIN_MENU.node.sprite"),
            click() {
                a("New Sprite", "db://internal/prefab/sprite.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.sprite_splash"),
            click() {
                a("New Sprite(Splash)", "db://internal/prefab/sprite_splash.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.label"),
            click() {
                a("New Label", "db://internal/prefab/label.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.richtext"),
            click() {
                a("New RichText", "db://internal/prefab/richtext.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.particle"),
            click() {
                a("New Particle", "db://internal/prefab/particlesystem.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.tiledmap"),
            click() {
                a("New TiledMap", "db://internal/prefab/tiledmap.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.tiledtile"),
            click() {
                a("New TiledTile", "db://internal/prefab/tiledtile.prefab")
            }
        }]
    }, {
        label: Editor.T("MAIN_MENU.node.ui"),
        submenu: [{
            label: Editor.T("MAIN_MENU.node.layout"),
            click() {
                a("New Layout", "db://internal/prefab/layout.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.button"),
            click() {
                a("New Button", "db://internal/prefab/button.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.canvas"),
            click() {
                a("New Canvas", "db://internal/prefab/canvas.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.scrollview"),
            click() {
                a("New ScrollView", "db://internal/prefab/scrollview.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.slider"),
            click() {
                a("New Slider", "db://internal/prefab/slider.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.pageview"),
            click() {
                a("New PageView", "db://internal/prefab/pageview.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.progressbar"),
            click() {
                a("New ProgressBar", "db://internal/prefab/progressBar.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.toggle"),
            click() {
                a("New Toggle", "db://internal/prefab/toggle.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.toggleContainer"),
            click() {
                a("New ToggleContainer", "db://internal/prefab/toggleContainer.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.toggleGroup"),
            click() {
                a("New ToggleGroup", "db://internal/prefab/toggleGroup.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.editbox"),
            click() {
                a("New EditBox", "db://internal/prefab/editbox.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.videoplayer"),
            click() {
                a("New VideoPlayer", "db://internal/prefab/videoplayer.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.webview"),
            click() {
                a("New WebView", "db://internal/prefab/webview.prefab")
            }
        }]
    }, {
        label: Editor.T("MAIN_MENU.node.create_3d"),
        submenu: [{
            label: "3D Stage",
            click() {
                a("New 3D Stage", "db://internal/prefab/3d-stage.prefab")
            }
        }, {
            label: "3D Particle",
            click() {
                a("New 3D Particle", "db://internal/prefab/3d-particle.prefab")
            }
        }, {
            type: "separator"
        }, {
            label: Editor.T("MAIN_MENU.node.box"),
            click() {
                a("New Box", "db://internal/model/prefab/box.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.capsule"),
            click() {
                a("New Capsule", "db://internal/model/prefab/capsule.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.cone"),
            click() {
                a("New Cone", "db://internal/model/prefab/cone.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.cylinder"),
            click() {
                a("New Cylinder", "db://internal/model/prefab/cylinder.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.plane"),
            click() {
                a("New Plane", "db://internal/model/prefab/plane.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.quad"),
            click() {
                a("New Quad", "db://internal/model/prefab/quad.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.sphere"),
            click() {
                a("New Sphere", "db://internal/model/prefab/sphere.prefab")
            }
        }, {
            label: Editor.T("MAIN_MENU.node.torus"),
            click() {
                a("New Torus", "db://internal/model/prefab/torus.prefab")
            }
        }]
    }, {
        label: Editor.T("MAIN_MENU.node.create_camera"),
        submenu: [{
            label: "2D " + Editor.T("MAIN_MENU.node.camera"),
            click() {
                a("New 2D Camera", "db://internal/prefab/2d-camera.prefab")
            }
        }, {
            label: "3D " + Editor.T("MAIN_MENU.node.camera"),
            click() {
                a("New 3D Camera", "db://internal/prefab/3d-camera.prefab")
            }
        }]
    }, {
        label: Editor.T("MAIN_MENU.node.create_light"),
        submenu: [{
            label: "Directional",
            click() {
                a("New Directional Light", "db://internal/prefab/light/directional.prefab")
            }
        }, {
            label: "Spot",
            click() {
                a("New Spot Light", "db://internal/prefab/light/spot.prefab")
            }
        }, {
            label: "Point",
            click() {
                a("New Point Light", "db://internal/prefab/light/point.prefab")
            }
        }, {
            label: "Ambient",
            click() {
                a("New Ambient Light", "db://internal/prefab/light/ambient.prefab")
            }
        }]
    }];
    if (Editor.Profile.load("global://features.json").get("cloud-function")) try {
        const l = Editor.url("packages://node-library/panel/utils/prefab.js");
        if (l && e.existsSync(l)) {
            const e = require(l).query(1);
            if (e && e.length > 0) {
                const l = {
                    label: Editor.T("MAIN_MENU.node.cloud_component"),
                    submenu: [],
                    visible: !0
                };
                e.forEach(e => {
                    e.prefab && e.prefab.forEach(e => {
                        l.submenu.push({
                            label: e.name,
                            click() {
                                Editor.Ipc.sendToMain("node-library:import-cloud-component", e.component, (r, l) => {
                                    let o = Editor.Selection.contexts("node")[0] || Editor.Selection.curActivate("node");
                                    Editor.Ipc.sendToPanel("scene", "scene:create-node-by-prefab", e.name, l, o)
                                })
                            }
                        })
                    })
                }), r.push(l)
            }
        }
    } catch (e) {
        Editor.warn(e)
    }
    return r
}

function d() {
    return [{
        label: Editor.T("MAIN_MENU.node.align_with_view"),
        accelerator: "CmdOrCtrl+Shift+F",
        panel: "scene",
        message: "scene:copy-editor-camera-data-to-nodes"
    }, {
        label: Editor.T("MAIN_MENU.node.break_prefab_instance"),
        panel: "scene",
        message: "scene:break-prefab-instance"
    }, {
        label: Editor.T("MAIN_MENU.node.link_prefab"),
        panel: "scene",
        message: "scene:link-prefab"
    }, {
        type: "separator"
    }].concat(i())
}

function n() {
    Editor.Window.main.nativeWin.webContents.send("reload-page")
}

function c(e) {
    function n() {
        Editor.Window.main.nativeWin.webContents.send("reload-page")
    }
    let electron = require("electron"),
    l = electron.BrowserWindow;
    Editor.stashedScene = null;
    let r = Editor.Window.main.nativeWin,
        o = l.getFocusedWindow(),
        t = o === r;
    (t || e) && (r.webContents.off("did-finish-load", n), r.webContents.once("did-finish-load", n)), !t && e ? r.reload() : o && o.reload()
}
Editor.Menu.register("create-node", i), Editor.Menu.register("node-menu", d), module.exports = function () {
    let e = [{
            label: Editor.T("MAIN_MENU.edit.title"),
            submenu: [{
                label: Editor.T("MAIN_MENU.edit.undo"),
                accelerator: "CmdOrCtrl+Z",
                click() {
                    Editor.Ipc.sendToPanel("scene", "scene:undo")
                }
            }, {
                label: Editor.T("MAIN_MENU.edit.redo"),
                accelerator: "Shift+CmdOrCtrl+Z",
                click() {
                    Editor.Ipc.sendToPanel("scene", "scene:redo")
                }
            }, {
                type: "separator"
            }, {
                label: Editor.T("MAIN_MENU.edit.copy"),
                accelerator: "CmdOrCtrl+C",
                role: "copy"
            }, {
                label: Editor.T("MAIN_MENU.edit.paste"),
                accelerator: "CmdOrCtrl+V",
                role: "paste"
            }, {
                label: Editor.T("MAIN_MENU.edit.selectall"),
                accelerator: "CmdOrCtrl+A",
                role: "selectall"
            }]
        }, {
            label: Editor.T("MAIN_MENU.node.title"),
            id: "node",
            submenu: d()
        }, {
            label: Editor.T("MAIN_MENU.component.title"),
            id: "component",
            submenu: []
        }, {
            label: Editor.T("MAIN_MENU.project.title"),
            id: "project",
            submenu: [{
                label: Editor.T("MAIN_MENU.project.play"),
                accelerator: "CmdOrCtrl+P",
                click() {
                    Editor.Ipc.sendToWins("scene:play-on-device")
                }
            }, {
                label: Editor.T("MAIN_MENU.project.reload"),
                accelerator: "CmdOrCtrl+Shift+P",
                click() {
                    Editor.Ipc.sendToWins("scene:reload-on-device")
                }
            }]
        }, {
            label: Editor.T("MAIN_MENU.panel.title"),
            id: "panel",
            submenu: []
        }, {
            label: Editor.T("MAIN_MENU.layout.title"),
            id: "layout",
            submenu: [{
                label: Editor.T("MAIN_MENU.layout.default"),
                click() {
                    Editor.Window.main.resetLayout(Editor.Window.defaultLayoutUrl, () => {
                        c(!0)
                    })
                }
            }, {
                label: Editor.T("MAIN_MENU.layout.portrait"),
                click() {
                    Editor.Window.main.resetLayout("unpack://static/layout/portrait.json", () => {
                        c(!0)
                    })
                }
            }, {
                label: Editor.T("MAIN_MENU.layout.classical"),
                click() {
                    Editor.Window.main.resetLayout("unpack://static/layout/classical.json", () => {
                        c(!0)
                    })
                }
            }]
        }, {
            label: Editor.T("MAIN_MENU.package.title"),
            id: "package",
            submenu: [{
                label: Editor.T("MAIN_MENU.package.create.title"),
                submenu: [{
                    label: Editor.T("MAIN_MENU.package.create.global"),
                    click() {
                        Editor.Ipc.sendToMain("editor:create-package", "global")
                    }
                }, {
                    label: Editor.T("MAIN_MENU.package.create.project"),
                    click() {
                        Editor.Ipc.sendToMain("editor:create-package", "project")
                    }
                }]
            }]
        }, {
            label: Editor.T("MAIN_MENU.developer.title"),
            id: "developer",
            submenu: [{
                label: Editor.T("MAIN_MENU.developer.vscode.title"),
                submenu: [{
                    label: Editor.T("MAIN_MENU.developer.vscode.get_tsd"),
                    click() {
                        t.updateAPIData()
                    }
                }, {
                    label: Editor.T("MAIN_MENU.developer.vscode.copy_extension"),
                    click() {
                        t.updateDebugger()
                    }
                }, {
                    label: Editor.T("MAIN_MENU.developer.vscode.copy_tsconfig"),
                    click() {
                        t.updateTypeScriptConf()
                    }
                }, {
                    label: Editor.T("MAIN_MENU.developer.vscode.copy_debug_setting"),
                    click() {
                        t.updateDebugSetting()
                    }
                }, {
                    label: Editor.T("MAIN_MENU.developer.vscode.copy_compile_task"),
                    click() {
                        t.updateCompileTask()
                    }
                }]
            }, {
                label: Editor.T("MAIN_MENU.developer.command_palette"),
                enabled: !1,
                accelerator: "CmdOrCtrl+:",
                click() {
                    Editor.Window.main.focus(), Editor.Ipc.sendToMainWin("cmdp:show")
                }
            }, {
                type: "separator"
            }, {
                label: Editor.T("MAIN_MENU.developer.reload"),
                accelerator: "CmdOrCtrl+R",
                click() {
                    c()
                }
            }, {
                label: Editor.T("MAIN_MENU.developer.compile"),
                accelerator: "F7",
                click() {
                    Editor.ProjectCompiler.compileAndReload()
                }
            }, {
                label: Editor.T("MAIN_MENU.developer.compile_engine"),
                accelerator: "CmdOrCtrl+F7",
                click() {
                    Editor.Ipc.sendToMain("app:rebuild-editor-engine", e => {
                        e ? Editor.error("rebuild engine failed: " + e) : Editor.log("Compile engine finished")
                    }, -1)
                }
            }, {
                type: "separator",
                dev: !0
            }, {
                label: Editor.T("MAIN_MENU.developer.inspect"),
                accelerator: "CmdOrCtrl+Shift+C",
                click() {
                    let e = l.getFocusedWindow(),
                        r = Editor.Window.find(e);
                    r && r.send("editor:window-inspect")
                }
            }, {
                label: Editor.T("MAIN_MENU.developer.devtools"),
                accelerator: "CmdOrCtrl+Alt+I",
                click() {
                    let e = l.getFocusedWindow(),
                        r = Editor.Window.find(e);
                    if (r) return r.openDevTools(), void 0;
                    e.openDevTools(), e.devToolsWebContents && e.devToolsWebContents.focus()
                }
            }, {
                label: Editor.T("MAIN_MENU.developer.toggle_node_inspector"),
                type: "checkbox",
                checked: !1,
                dev: !0,
                click() {
                    Editor.Debugger.toggleNodeInspector()
                }
            }, {
                type: "separator",
                dev: !0
            }, {
                label: "Generate UUID",
                dev: !0,
                click() {
                    let e = require("node-uuid");
                    Editor.log(e.v4())
                }
            }, {
                label: "Remove All Meta Files",
                dev: !0,
                async click() {
                    await Editor.assetdb._rmMetas(), Editor.success("Meta files removed")
                }
            }, {
                type: "separator",
                dev: !0
            }, {
                label: "Human Tests",
                dev: !0,
                submenu: [{
                    label: "Reload Scene",
                    accelerator: "Alt+F7",
                    click() {
                        var e = require("./compiler");
                        Editor.Ipc.sendToWins("scene:soft-reload", "failed" !== e.state)
                    }
                }, {
                    label: "Throw an Uncaught Exception",
                    click() {
                        throw new Error("editor-framework Unknown Error")
                    }
                }, {
                    label: "send2panel 'foo:bar' foobar.panel",
                    click() {
                        Editor.Ipc.sendToPanel("foobar.panel", "foo:bar")
                    }
                }, {
                    label: "Enable Build Worker Devtools",
                    click() {
                        Editor.Builder.debugWorker = !Editor.Builder.debugWorker
                    }
                }, {
                    label: "Enable Compile Worker Devtools",
                    click() {
                        Editor.Compiler.debugWorker = !Editor.Compiler.debugWorker
                    }
                }]
            }, {
                type: "separator",
                dev: !0
            }]
        }],
        o = function () {
            let e = new Editor.Window("about", {
                    title: Editor.T("MAIN_MENU.about", {
                        product: Editor.T("SHARED.product_name")
                    }),
                    width: 500,
                    height: 215,
                    alwaysOnTop: !0,
                    show: !1,
                    resizable: !1
                }),
                r = Editor.Window.main,
                l = r.nativeWin.getPosition(),
                o = r.nativeWin.getSize(),
                t = l[0] + o[0] / 2 - 200,
                a = l[1] + o[1] / 2 - 90;
            e.load("app://editor/page/app-about.html"), e.nativeWin.setPosition(Math.floor(t), Math.floor(a)), e.nativeWin.setMenuBarVisibility(!1), e.nativeWin.setTitle(Editor.T("MAIN_MENU.about", {
                product: Editor.T("SHARED.product_name")
            })), e.show()
        },
        a = {
            label: Editor.T("SHARED.product_name"),
            position: "before=help",
            submenu: [{
                label: Editor.T("MAIN_MENU.about", {
                    product: Editor.T("SHARED.product_name")
                }),
                id: 0,
                click: o
            }, {
                type: "separator"
            }, {
                label: Editor.T("MAIN_MENU.panel.preferences"),
                click() {
                    Editor.Ipc.sendToMain("preferences:open")
                }
            }, {
                type: "separator"
            }, {
                label: Editor.T("MAIN_MENU.window.hide", {
                    product: Editor.T("SHARED.product_name")
                }),
                id: 2,
                accelerator: "CmdOrCtrl+H",
                visible: Editor.isDarwin,
                role: "hide"
            }, {
                label: Editor.T("MAIN_MENU.window.hide_others"),
                accelerator: "CmdOrCtrl+Shift+H",
                visible: Editor.isDarwin,
                role: "hideothers"
            }, {
                label: Editor.T("MAIN_MENU.window.show_all"),
                role: "unhide",
                visible: Editor.isDarwin
            }, {
                label: Editor.T("MAIN_MENU.window.minimize"),
                accelerator: "CmdOrCtrl+M",
                role: "minimize"
            }, {
                label: Editor.T("MAIN_MENU.window.bring_all_front"),
                visible: Editor.isDarwin,
                role: "front"
            }, {
                type: "separator"
            }, {
                label: Editor.T("MAIN_MENU.window.close"),
                accelerator: "CmdOrCtrl+W",
                role: "close"
            }, {
                label: Editor.T("MAIN_MENU.window.quit"),
                accelerator: "CmdOrCtrl+Q",
                role: "close"
            }]
        },
        i = {
            label: Editor.T("MAIN_MENU.file.title"),
            submenu: [{
                label: Editor.T("MAIN_MENU.file.open_project"),
                click() {
                    Editor.App.runDashboard()
                }
            }, {
                label: Editor.T("MAIN_MENU.file.open_dashboard"),
                click() {
                    process.send && process.send({
                        channel: "show-dashboard"
                    })
                }
            }, {
                type: "separator"
            }, {
                label: Editor.T("MAIN_MENU.file.open_recent_items"),
                submenu: []
            }, {
                type: "separator"
            }, {
                label: Editor.T("MAIN_MENU.file.new_scene"),
                accelerator: "CmdOrCtrl+N",
                click() {
                    Editor.Ipc.sendToPanel("scene", "scene:new-scene")
                }
            }, {
                label: Editor.T("MAIN_MENU.file.save_scene"),
                accelerator: "CmdOrCtrl+S",
                click() {
                    Editor.Ipc.sendToPanel("scene", "scene:stash-and-save")
                }
            }, {
                type: "separator"
            }, {
                label: Editor.T("MAIN_MENU.file.import_asset"),
                click() {
                    Editor.Ipc.sendToMain("package-asset:import")
                }
            }, {
                label: Editor.T("MAIN_MENU.file.export_asset"),
                click() {
                    Editor.Ipc.sendToMain("package-asset:export")
                }
            }]
        },
        n = {
            label: Editor.T("SHARED.help"),
            id: "help",
            role: "help",
            submenu: [{
                label: Editor.T("MAIN_MENU.help.docs"),
                click() {
                    require("../../share/manual").openManual("home")
                }
            }, {
                label: Editor.T("MAIN_MENU.help.api"),
                click() {
                    require("../../share/manual").openAPI("home")
                }
            }, {
                label: Editor.T("MAIN_MENU.help.forum"),
                click() {
                    let e = "zh" === Editor.lang ? "https://forum.cocos.org/c/Creator" : "https://discuss.cocos2d-x.org/c/creator";
                    r.shell.openExternal(e), r.shell.beep()
                }
            }, {
                type: "separator"
            }, {
                label: Editor.T("MAIN_MENU.help.release_notes"),
                click() {
                    let e = "zh" === Editor.lang ? "https://www.cocos.com/creator" : "https://discuss.cocos2d-x.org/c/announcements";
                    r.shell.openExternal(e), r.shell.beep()
                }
            }, {
                label: Editor.T("MAIN_MENU.help.engine_repo"),
                click() {
                    r.shell.openExternal("https://github.com/cocos-creator/engine"), r.shell.beep()
                }
            }, {
                type: "separator"
            }, {
                label: Editor.T("MAIN_MENU.account.none"),
                enabled: !1
            }]
        };
    if (e.unshift(i), e.push(n), Editor.isDarwin) e.unshift(a);
    else {
        let e = [{
            type: "separator"
        }, {
            label: Editor.T("MAIN_MENU.panel.preferences"),
            click() {
                Editor.Ipc.sendToMain("preferences:open")
            }
        }, {
            type: "separator"
        }, {
            label: Editor.T("MAIN_MENU.window.quit"),
            accelerator: "CmdOrCtrl+Q",
            role: "close"
        }];
        i.submenu = i.submenu.concat(e);
        let r = [{
            label: Editor.T("MAIN_MENU.about", {
                product: Editor.T("SHARED.product_name")
            }),
            id: 0,
            click: o
        }, {
            type: "separator"
        }];
        n.submenu.splice(7, 0, ...r)
    }
    return e
}, o.on("scene:animation-record-changed", (e, r, l) => {
    let o = d();
    Editor.Menu.walk(o, e => {
        e.enabled = !r
    }), Editor.MainMenu.update(Editor.T("MAIN_MENU.node.title"), o)
}), o.on("node-library:update-menu", (e, r) => {
    Editor.Menu.unregister("create-node"), Editor.Menu.register("create-node", i);
    let l = d();
    Editor.Menu.walk(l, e => {
        e.label === Editor.T("MAIN_MENU.node.cloud_component") && (e.visible = r)
    }), Editor.MainMenu.update(Editor.T("MAIN_MENU.node.title"), l)
});