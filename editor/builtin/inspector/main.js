"use strict";
const e = require("electron").BrowserWindow;
module.exports = {
    load() {
        Editor.Menu.register("node-inspector", () => [{
            label: "Reset Node",
            message: "scene:reset-node",
            panel: "scene",
            params: []
        }, {
            label: "Reset All",
            message: "scene:reset-all",
            panel: "scene",
            params: []
        }, {
            label: "Paste Component",
            message: "scene:paste-component",
            panel: "scene",
            params: []
        }], !0), Editor.Menu.register("component-inspector", () => [{
            label: "Remove",
            message: "scene:remove-component",
            panel: "scene",
            params: []
        }, {
            type: "separator"
        }, {
            label: "Reset",
            message: "scene:reset-component",
            panel: "scene",
            params: []
        }, {
            label: "Move Up",
            message: "scene:move-up-component",
            panel: "scene",
            params: []
        }, {
            label: "Move Down",
            message: "scene:move-down-component",
            panel: "scene",
            params: []
        }, {
            type: "separator"
        }, {
            label: "Copy Component",
            message: "scene:copy-component",
            panel: "scene",
            params: []
        }, {
            label: "Paste Component",
            message: "scene:paste-component",
            panel: "scene",
            params: []
        }])
    },
    unload() {
        Editor.Menu.unregister("node-inspector"), Editor.Menu.unregister("component-inspector")
    },
    messages: {
        open() {
            Editor.Panel.open("inspector")
        },
        "popup-node-inspector-menu"(n, o) {
            let s = Editor.Menu.getMenu("node-inspector");
            Editor.Menu.walk(s, e => {
                e.params && e.params.unshift(o.uuids), "scene:paste-component" === e.message && (e.enabled = o.hasCopyComp)
            });
            let p = new Editor.Menu(s, n.sender),
                a = Math.floor(o.x),
                t = Math.floor(o.y);
            p.nativeMenu.popup(e.fromWebContents(n.sender), a, t), p.dispose()
        },
        "popup-component-inspector-menu"(n, o) {
            let s = Editor.Menu.getMenu("component-inspector");
            Editor.Menu.walk(s, e => {
                e.params && ("scene:paste-component" === e.message ? e.params.unshift(o.nodeUuids, o.compIndex + 1) : "scene:copy-component" === e.message ? e.params.unshift(o.compUuids) : e.params.unshift(o.nodeUuids, o.compUuids)), "scene:move-up-component" === e.message ? e.enabled = o.compIndex - 1 >= 0 : "scene:move-down-component" === e.message ? e.enabled = o.compIndex + 1 < o.compCount : "scene:paste-component" === e.message ? e.enabled = o.hasCopyComp : "scene:copy-component" === e.message && (e.enabled = !o.multi)
            });
            let p = new Editor.Menu(s, n.sender),
                a = Math.floor(o.x),
                t = Math.floor(o.y);
            p.nativeMenu.popup(e.fromWebContents(n.sender), a, t), p.dispose()
        },
        "popup-comp-menu"(n, o, s, p) {
            let a = Editor.Menu.getMenu("add-component");
            Editor.Menu.walk(a, e => {
                e.params && (e.params[0] = p)
            });
            let t = new Editor.Menu(a, n.sender);
            o = Math.floor(o), s = Math.floor(s), t.nativeMenu.popup(e.fromWebContents(n.sender), o, s), t.dispose()
        }
    }
};