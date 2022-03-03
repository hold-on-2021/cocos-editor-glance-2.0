"use strict";
const e = require("./utils/cache"),
    i = require("./utils/operation");
let t = e.queryCache(),
    d = [],
    n = !0;
let o = function (o) {
        let r = {},
            l = [],
            c = [];

        function f(n, o, u) {
            if (r[n.id] = {
                    node: n,
                    parent: u
                }, t[n.id] && function (i, n, o) {
                    let r = t[i.id],
                        l = t[n];
                    if (n !== r.parent) return c = e.remove(i.id), void 0;
                    if (l && l.children[o] !== i.id) {
                        c = e.remove(i.id);
                        let t = d.indexOf(i.id);
                        return -1 !== t && d.splice(t, 1), void 0
                    }
                    if (null === n && d[o] !== i.id) {
                        c = e.remove(i.id);
                        let t = d.indexOf(i.id);
                        return -1 !== t && d.splice(t, 1), void 0
                    }
                    let f = e.queryNode(i.id);
                    f.name !== i.name && (f.name = i.name), f.isActive !== i.isActive && (f.isActive = i.isActive), f.prefabState !== i.prefabState && (f.prefabState = i.prefabState), f.locked !== i.locked && (f.locked = i.locked)
                }(n, u, o), !t[n.id]) {
                (function (e, i) {
                    for (let t = 0; t < e.length; ++t) {
                        let d = e[t];
                        d && d.id === i.id && (i.fold = d.oldNode.fold, e.splice(t, 1))
                    }
                })(c, n), e.add(n, u || null, o);
                let t = e.queryNode(u);
                t && i.fold(u, t.fold), null === u && d.splice(o, 0, n.id), l.push(n.id)
            }
            let a = 0;
            n.children && n.children.forEach(e => {
                e.hidden || f(e, a++, n.id)
            })
        }
        let u = 0;
        if (o.forEach(e => {
                e.hidden || f(e, u++, null)
            }), l.length > 0) {
            if (n) return n = !1, void 0;
            let t = e.queryNode(l[0]);
            t.parent && i.fold(t.parent, !1)
        }
        let a = [];
        Object.keys(t).forEach(i => {
            if (-1 === a.indexOf(i) && !r[i]) {
                (c = e.remove(i)).forEach(e => {
                    a.push(e.id)
                });
                let t = d.indexOf(i); - 1 !== t && d.splice(t, 1)
            }
        })
    },
    r = null,
    l = function () {
        Editor.Ipc.sendToPanel("scene", "scene:query-hierarchy", (e, i, t) => {
            e && Editor.warn(e), t && o(t), r = setTimeout(() => {
                l()
            }, 300)
        }, -1)
    };
exports.startup = function () {
    e.initNodeState(), n = !0, l()
}, exports.stop = function () {
    n = !0, e.initNodeState(), clearTimeout(r), o([])
}, exports.reset = function () {};