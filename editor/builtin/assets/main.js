"use strict";
const e = require("electron").BrowserWindow,
    o = require("./core/menu");
require("./core/external-app"), module.exports = {
    load() {},
    unload() {},
    messages: {
        open() {
            Editor.Panel.open("assets")
        },
        "popup-create-menu"(t, n, r) {
            let p = o.getCreateTemplate(),
                s = new Editor.Menu(p, t.sender);
            n = Math.floor(n), r = Math.floor(r), s.nativeMenu.popup(e.fromWebContents(t.sender), n, r), s.dispose()
        },
        "popup-sort-menu"(t, n, r) {
            let p = o.getSortTemplate(),
                s = new Editor.Menu(p, t.sender);
            n = Math.floor(n), r = Math.floor(r), s.nativeMenu.popup(e.fromWebContents(t.sender), n, r), s.dispose()
        },
        "popup-search-menu"(t, n, r) {
            let p = o.getSearchTemplate(),
                s = new Editor.Menu(p, t.sender);
            n = Math.floor(n), r = Math.floor(r), s.nativeMenu.popup(e.fromWebContents(t.sender), n, r), s.dispose()
        },
        "popup-context-menu"(t, n, r, p) {
            let s = o.getContextTemplate(p),
                a = new Editor.Menu(s, t.sender);
            n = Math.floor(n), r = Math.floor(r), a.nativeMenu.popup(e.fromWebContents(t.sender), n, r), a.dispose()
        }
    }
};