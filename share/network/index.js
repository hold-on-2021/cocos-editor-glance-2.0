"use strict";
const e = require("os"),
    t = require("https");
exports.canConnectPassport = function (e) {
    let o = !1,
        r = t.request({
            method: "GET",
            host: "passport.cocos.com",
            port: 443,
            path: "/oauth/token?xxx",
            headers: {}
        }, t => {
            if (200 !== t.statusCode) {
                if (Editor.log("failed to connect login server... skipping login"), o) return;
                return o = !0, e(!1)
            }
            if (!o) return o = !0, Editor.log("connected!"), e(!0)
        }).on("error", t => {
            if (!o) return o = !0, Editor.log("failed to connect login server... skipping login"), e(!1)
        });
    r.write(""), r.end(), setTimeout(function () {
        if (!o) return Editor.log("failed to connect login server due to request timeout"), o = !0, e(!1)
    }, 3e3)
}, exports.queryIpList = function () {
    let t = e.networkInterfaces(),
        o = [];
    for (let e in t) t[e].forEach(e => {
        "IPv4" === e.family && !1 === e.internal && o.push(e.address)
    });
    return "win32" === process.platform && (o = o.filter(e => /^(?!169\.254)/.test(e))), o
};