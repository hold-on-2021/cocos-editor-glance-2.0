"use strict";
let e = {};
module.exports = e;
const t = require("lodash"),
    n = require("fire-path"),
    r = require("electron"),
    o = require("../../console"),
    i = require("../../ipc");
let l = !1,
    f = "",
    a = [],
    c = {};
e.start = function (e, t) {
    let n = t.items || [],
        r = t.type || "",
        s = t.effect || "",
        d = !!t.buildImage,
        u = t.options || {};
    if (Array.isArray(n) || (n = [n]), l && o.warn("DragDrop.end() has not been invoked."), l = !0, f = r, a = n, c = u, e.effectAllowed = s, e.dropEffect = "none", d) {
        let t = this.getDragIcon(n);
        e.setDragImage(t, -10, 10)
    }
    i.sendToWins("editor:dragstart", {
        type: r,
        items: n,
        options: u
    })
}, e.end = function () {
    l = !1, f = "", a = [], c = {}, i.sendToWins("editor:dragend")
}, e.updateDropEffect = function (e, t) {
    if (-1 === ["copy", "move", "link", "none"].indexOf(t)) return o.warn("dropEffect must be one of 'copy', 'move', 'link' or 'none'"), e.dropEffect = "none", void 0;
    e.dropEffect = t
}, e.type = function (e) {
    return e && -1 !== e.types.indexOf("Files") ? "file" : l ? f : ""
}, e.filterFiles = function (e) {
    let t = [];
    for (let r = 0; r < e.length; ++r) {
        let o = !1;
        for (let i = 0; i < t.length; ++i)
            if (n.contains(t[i].path, e[r].path)) {
                o = !0;
                break
            } o || t.push(e[r])
    }
    return t
}, e.items = function (e) {
    if (e && e.files.length > 0) {
        let t = new Array(e.files.length);
        for (let n = 0; n < e.files.length; ++n) t[n] = e.files[n];
        return t
    }
    return l ? a.slice() : []
}, e.getDragIcon = function (e) {
    let t = new Image,
        n = document.createElement("canvas"),
        r = n.getContext("2d");
    r.font = "normal 12px Arial", r.fillStyle = "white";
    let o = 0;
    for (let t = 0; t < e.length; ++t) {
        let n = e[t];
        if (!(t <= 4)) {
            r.fillStyle = "gray", r.fillText("[more...]", 20, o + 15);
            break
        }
        n.icon && void 0 !== n.icon.naturalWidth && 0 !== n.icon.naturalWidth && r.drawImage(n.icon, 0, o, 16, 16), r.fillText(n.name, 20, o + 15), o += 15
    }
    return t.src = n.toDataURL(), t
}, e.options = function () {
    return t.cloneDeep(c)
}, e.getLength = function () {
    return a.length
}, Object.defineProperty(e, "dragging", {
    enumerable: !0,
    get: () => l
});
const s = r.ipcRenderer;
s.on("editor:dragstart", (e, t) => {
    l = !0, f = t.type, a = t.items, c = t.options
}), s.on("editor:dragend", () => {
    l = !1, f = "", a = [], c = {}
});