"use strict";
const o = require("electron");
let e = null;
e = Editor.isMainProcess ? o.ipcMain : o.ipcRenderer;
const t = require("lodash"),
    n = require("http"),
    r = require("semver");

function i(o, e, t, r, i, a) {
    let d = e ? "localhost" : "fbupdater.avosapps.com",
        s = e ? 3e3 : 80,
        l = {
            "X-LC-Id": "qaE6P62XSAGBMtxtbVJJUT5m-gzGzoHsz",
            "X-LC-Key": "OwAmchirvy0Mo6eCEphYJdVg",
            "Content-Type": "application/json; charset=utf-8"
        };
    e && (l.testing = !0), o && (l.version = o);
    let c = "";
    n.request({
        method: "POST",
        host: d,
        port: s,
        path: t,
        headers: l
    }, o => {
        if (o.setEncoding("utf8"), 200 !== o.statusCode) return i(), void 0;
        o.on("data", o => {
            c += o
        }).on("end", () => {
            var o;
            try {
                return (o = JSON.parse(c)) ? (r(o), void 0) : (i(), void 0)
            } catch (o) {
                return a(o), void 0
            }
        })
    }).on("error", o => {
        a(o)
    }).end()
}

function a(o) {
    Editor.log("Query Hot Updates...");
    i(Editor.versions.CocosCreator, o, "/hotupdates/latest", function (o) {
        let e = function (o) {
            let e = Editor.Profile.load("global://updates.json"),
                n = Editor.isDarwin ? "mac" : "win",
                r = [];
            for (let i = 0; i < o.length; ++i) {
                let a, d, s = o[i];
                t.includes(e.get("installed-hotupdates"), s.objectId) || (a = s.package_info[n + "_link"], d = s.package_info.changelog, r.push({
                    url: a,
                    changelog: d,
                    contentType: s.contentType,
                    versionId: s.objectId
                }))
            }
            return r
        }(o);
        e.length > 0 ? (Editor.log("Hot update content found. Launch Auto Update."), Editor.Ipc.sendToMain("downloader:open", {
            downloads: e
        })) : Editor.log("No hot updates available.")
    }, function () {
        Editor.log("No hot updates available.")
    }, function (o) {
        Editor.warn("Connecting to Auto Update service failed or Data parsing error occurs."), Editor.warn(o)
    })
}
e.on("app:query-fb-update", () => {
    Editor.log("Query updating...");
    i(null, !1, "/versions/latest", function (o) {
        if (function (o) {
                let e = Editor.Profile.load("global://updates.json"),
                    n = !t.includes(e.get("received-ids"), o.objectId),
                    i = Editor.versions.CocosCreator;
                i = r.clean(i);
                let a = r.lt(i, o.version, {
                    includePrerelease: !0
                });
                if (n && a) return !0;
                return !1
            }(o)) {
            let e = Editor.isDarwin ? "mac" : "win";
            return Editor.log(`New Version ${o.version} found. Launch Auto Update.`), Editor.Ipc.sendToMain("downloader:open", {
                downloads: [{
                    url: o.package_info[e + "_link"],
                    version: o.version,
                    changelog: o.package_info.changelog,
                    versionId: o.objectId
                }]
            }), void 0
        }
        return Editor.log("No version update available."), a(!1), void 0
    }, function () {
        Editor.log("No version update available."), a(!1)
    }, function (o) {
        Editor.warn("Connecting to Auto Update service failed or Data parsing error occurs."), Editor.warn(o)
    })
});