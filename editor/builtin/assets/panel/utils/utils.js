"use strict";
const {
    promisify: e
} = require("util"), t = require("fire-fs"), r = (require("fire-path"), require("node-uuid"), require("./event")), i = require("./operation"), a = require("./cache");
let n = async function (e) {
    return await new Promise(r => {
        t.exists(e, r)
    })
};
module.exports = {
    isSubDir: function (e, t) {
        return 0 === e.indexOf(t) && e !== t
    },
    copy: async function (r, i) {
        if (!await n(r)) return new Error(`File does not exist - ${r}`), void 0;
        for (; await n(i);) i = i.replace(/( - (\d+))?(\.[^\.]+)?$/, (e, t, r, i) => {
            let a = r ? parseInt(r) : 0,
                n = ++a + "";
            for (; n.length < 3;) n = "0" + n;
            return ` - ${n}${i||""}`
        });
        return await e(t.copy)(r, i), i
    },
    isDir: async function (r) {
        return await e(t.isDir)(r)
    },
    uuid2path: async function (t) {
        let r = await e(Editor.assetdb.queryUrlByUuid)(t);
        if (!r) return null;
        let i = Editor.url(r);
        return decodeURI(i)
    },
    exists: n,
    copyMeta: async function (r, i) {
        r += ".meta", i += ".meta";
        let a = await e(t.readFile)(r, "utf-8"),
            n = await e(t.readFile)(i, "utf-8");
        if (!a || !n) return;
        let s = JSON.parse(a),
            o = JSON.parse(n),
            u = function (e, t) {
                Object.keys(e).forEach(r => {
                    let i = e[r],
                        a = t[r];
                    "object" == typeof i ? (a || (a = Array.isArray(i) ? t[r] = [] : t[r] = {}), u(i, a)) : t[r] = i
                })
            };
        u(s, o)
    },
    isReadOnly: async function (t) {
        let r = await e(Editor.assetdb.queryInfoByUuid)(t);
        if (!r) return !0;
        let i = await e(Editor.assetdb.queryUrlByUuid)(t);
        if (!i) return !0;
        let a = await e(Editor.assetdb.queryAssets)(i, r.type);
        return !(!a || !a[0] || !a[0].readonly)
    },
    onDragStart: function (e) {
        e.stopPropagation();
        let t = Editor.Selection.contexts("asset");
        if (!t || t.length <= 0) return e.preventDefault(), void 0;
        i.staging(t);
        let r = [];
        t.forEach(e => {
            r.push(a.queryNode(e))
        }), Editor.UI.DragDrop.start(e.dataTransfer, {
            buildImage: !0,
            effect: "copyMove",
            type: "asset",
            items: r.map(e => ({
                id: e.id,
                name: e.name,
                assetType: e.assetType,
                isSubAsset: e.isSubAsset,
                subAssetTypes: e.children.map(e => e.assetType)
            }))
        })
    },
    onDragOver: function (e) {
        e.stopPropagation(), e.preventDefault()
    },
    onDragEnd: function (e) {
        e.stopPropagation(), i.restore(), Editor.UI.DragDrop.end()
    },
    emptyFilter: function () {
        r.emit("filter-changed", ""), r.emit("empty-filter")
    }
};