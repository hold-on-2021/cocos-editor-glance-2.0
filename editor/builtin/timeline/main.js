"use strict";
const {
    BrowserWindow: e,
    dialog: t
} = require("electron"), r = require("fs"), i = require("path"), {
    promisify: n
} = require("util");
let l = "timeline",
    o = function (t, r, i) {
        let n = new Editor.Menu(t, r);
        i.x = Math.round(i.x), i.y = Math.round(i.y), n.nativeMenu.popup(e.fromWebContents(r), i.x, i.y), n.dispose()
    };
module.exports = {
    load() {},
    unload() {},
    messages: {
        open() {
            Editor.Panel.open(l)
        },
        async "menu-add-property"(e, t) {
            let r = await new Promise((e, r) => {
                Editor.Ipc.sendToPanel("scene", "scene:query-animation-properties", t.nodeId, (t, r) => {
                    t && (Editor.warn(t), r = []), e(r)
                })
            });
            (r = r.map(e => ({
                label: e.name,
                click() {
                    Editor.Ipc.sendToPanel(l, "timeline:property-add", e)
                }
            }))) && r.length || (r = [{
                label: "null",
                enabled: !1
            }]), o(r, e.sender, t)
        },
        "menu-keyframe-operation"(e, t) {
            let r = [{
                label: t.component ? t.component + "." + t.property : t.property,
                enabled: !1
            }, {
                type: "separator"
            }, {
                label: Editor.T("timeline.property.insert_frame"),
                enabled: !t.hasKeyframe,
                click() {
                    Editor.Ipc.sendToPanel(l, "timeline:property-add-key", t)
                }
            }, {
                label: Editor.T("timeline.property.delete_selected_frame"),
                enabled: t.hasKeyframe,
                click() {
                    Editor.Ipc.sendToPanel(l, "timeline:property-delete-selected-key", t)
                }
            }];
            o(r, e.sender, t)
        },
        "menu-property-operation"(e, t) {
            let r = [{
                label: t.component ? t.component + "." + t.property : t.property,
                enabled: !1
            }, {
                type: "separator"
            }, {
                label: Editor.T("timeline.property.insert_frame"),
                click() {
                    Editor.Ipc.sendToPanel(l, "timeline:property-add-key", t)
                }
            }, {
                label: Editor.T("timeline.property.delete_selected_frame"),
                enabled: t.selected,
                click() {
                    Editor.Ipc.sendToPanel(l, "timeline:property-delete-selected-key", t)
                }
            }, {
                label: Editor.T("timeline.property.clear_frame"),
                click() {
                    Editor.Ipc.sendToPanel(l, "timeline:property-clear", t)
                }
            }, {
                type: "separator"
            }, {
                label: Editor.T("timeline.property.delete_property"),
                click() {
                    Editor.Ipc.sendToPanel(l, "timeline:property-remove", t)
                }
            }];
            o(r, e.sender, t)
        },
        "menu-event-operation"(e, t) {
            let r = [{
                label: Editor.T("timeline.event.edit"),
                click() {
                    Editor.Ipc.sendToPanel(l, "timeline:edit-event", t)
                }
            }, {
                label: Editor.T("timeline.event.delete"),
                click() {
                    Editor.Ipc.sendToPanel(l, "timeline:delete-event", t)
                }
            }];
            o(r, e.sender, t)
        },
        "menu-node-operation"(e, t) {
            let r = [{
                label: Editor.T("timeline.nodes.clear_data"),
                click() {
                    Editor.Ipc.sendToPanel(l, "timeline:clear-node", t)
                }
            }, {
                label: Editor.T("timeline.nodes.move_data"),
                click() {
                    Editor.Ipc.sendToPanel(l, "timeline:rename-node", t)
                }
            }];
            o(r, e.sender, t)
        },
        async "create-clip-file"(e, l) {
            let o = Editor.url("db://assets/"),
                a = t.showSaveDialog(Editor.Window.main.nativeWin, {
                    title: "New Clip",
                    defaultPath: o,
                    filters: [{
                        name: "Animation Clip",
                        extensions: ["anim"]
                    }]
                });
            if (!a) return e.reply && e.reply(), void 0;
            let d = Editor.url("unpack://static/template/new-animation-clip.anim"),
                p = await n(r.readFile)(d, {
                    encoding: "utf-8"
                });
            if (r.existsSync(a)) return a = "db://assets/" + i.relative(o, a), Editor.assetdb.saveExists(a, p, (t, r) => {
                if (t) return Editor.error(t), e.reply && e.reply(t), void 0;
                Editor.Ipc.sendToPanel("scene", "scene:mount-clip", l, r.meta.uuid), e.reply && e.reply(null)
            }), void 0;
            a = "db://assets/" + i.relative(o, a), Editor.assetdb.create(a, p, (t, r) => {
                if (t) return Editor.error(t), e.reply && e.reply(t), void 0;
                r.filter(e => "animation-clip" === e.type).forEach(e => {
                    Editor.Ipc.sendToPanel("scene", "scene:mount-clip", l, e.uuid)
                }), e.reply && e.reply(null)
            })
        }
    }
};
