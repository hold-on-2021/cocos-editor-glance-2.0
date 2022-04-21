var e = "manifest.json",
    r = require("path"),
    i = require("fs-extra"),
    {
        exec: o,
        execSync: t
    } = require("child_process"),
    n = require("fix-path");
let a;
var s, p, c, d, u, l, m, f, v, g, y, _ = "sign",
    E = "logo.png",
    S = {},
    k = "win32" === process.platform;

function j() {
    return r.join(Editor.url("packages://oppo-adapter/quickgame-toolkit/lib/bin"), "index")
}

function b(f, b) {
    if (Editor.log("Checking config file " + b.dest), a.npmPath) {
        isFixPath = !1, Editor.log(Editor.T("oppo-runtime.custom_npm_path_config"), a.npmPath);
        let e = r.join(Editor.url("packages://oppo-runtime/quickgame-toolkit"), "lib", "bin");
        k ? (S.Path = a.npmPath, S.Path += ";" + e) : (S.PATH = a.npmPath, S.PATH += ":" + e)
    } else v && Editor.log(Editor.T("oppo-runtime.custom_npm_path_not_config")), n(), S = process.env;
    !1 !== function () {
        try {
            t("node -v", {
                env: S
            })
        } catch (e) {
            return a.npmPath ? (f.reply(new Error(Editor.T("oppo-runtime.custom_npm_path_config_error"))), void 0) : (Editor.Ipc.sendToWins("builder:events", "npmPath-show"), k && f.reply(new Error(Editor.T("oppo-runtime.not_install_nodejs_windows_error"))), f.reply(new Error(Editor.T("oppo-runtime.not_install_nodejs_mac_error"))), !1)
        }
        return !0
    }() && (s = r.resolve(b.dest, "..", "tempTinyRes"), p = b.dest, d = function (e) {
        var i;
        if (y = e.buildResults._subpackages, "{}" == JSON.stringify(y)) i = void 0;
        else
            for (var o in i = [], y) {
                var t = y[o].path,
                    n = r.extname(t),
                    a = r.basename(t, n),
                    s = {
                        name: a,
                        root: "subpackages/" + a + "/"
                    };
                i.push(s)
            }
        return i
    }(b), function () {
        if (!a.tinyPackageMode) return;
        var e = r.join(p, "res"),
            o = r.join(s, "res");
        i.existsSync(o) && i.removeSync(o);
        i.copySync(e, o);
        try {
            i.removeSync(e)
        } catch (r) {
            i.emptyDirSync(e)
        }
    }(), i.writeFileSync(r.join(p, E), i.readFileSync(c)), function () {
        var e = r.join(p, _);
        if (i.emptyDirSync(e), !m) {
            var o = r.join(e, "release");
            i.ensureDirSync(o), i.existsSync(u) && i.writeFileSync(r.join(o, "private.pem"), i.readFileSync(u)), i.existsSync(l) && i.writeFileSync(r.join(o, "certificate.pem"), i.readFileSync(l))
        }
    }(), function (o) {
        var t = r.join(p, e),
            n = {
                package: a.package,
                name: a.name,
                versionName: a.versionName,
                versionCode: a.versionCode,
                minPlatformVersion: a.minPlatformVersion,
                icon: "/logo.png",
                features: [{
                    name: "system.prompt"
                }, {
                    name: "system.router"
                }, {
                    name: "system.shortcut"
                }],
                permissions: [{
                    origin: "*"
                }],
                orientation: a.deviceOrientation
            };
        d && (n.subpackages = d);
        var s = JSON.stringify(n);
        i.writeFileSync(t, s)
    }(), async function () {
        let e = require("./build-jsb-adapter"),
            t = r.join(function (e) {
                let i = Editor.url("packages://oppo-adapter");
                return void 0 === e || "" === e ? i : r.join(i, e)
            }(), "engine", "index.js"),
            n = r.join(r.join(p, "jsb-adapter"), "engine", "index.js");
        await e.build({
                rootPath: t,
                dstPath: n,
                isDebug: g.debug
            }),
            function (e) {
                var o = a.tinyPackageMode;
                let t = r.join(e, "jsb-adapter", "engine", "index.js");
                var n = i.readFileSync(t, "utf8");
                n = !1 === o ? n.replace("REMOTE_SERVER_ROOT_PLACE_HOLDER", "") : n.replace("REMOTE_SERVER_ROOT_PLACE_HOLDER", a.tinyPackageServer);
                i.writeFileSync(t, n)
            }(p),
            function (e) {
                if (!a.tinyPackageMode) return;
                if (!a.packFirstScreenRes) return;
                let o = e.buildResults;
                var t = o.getDependencies(e.startScene),
                    n = r.join(s, "res", "import");
                i.copySync(n, r.join(e.dest, "res", "import")), i.removeSync(n);
                for (var p = 0; p < t.length; ++p) {
                    var c = t[p],
                        d = o.getNativeAssetPath(c);
                    if (!d || 0 === d.length) continue;
                    let n = r.join(e.dest, d.replace(e.dest, ""));
                    if (n.indexOf("\\subpackages") > -1) {
                        Editor.log(Editor.T("oppo-runtime.pack_res_to_first_pack_contain_subpack_res_error"));
                        continue
                    }
                    let a = r.join(s, d.replace(e.dest, ""));
                    i.moveSync(a, n);
                    var u = r.dirname(a);
                    i.existsSync(u) && 0 === i.readdirSync(u).length && i.removeSync(u)
                }
            }(g),
            function (e, o) {
                if (! function () {
                        if ("{}" == JSON.stringify(y)) return !1;
                        return !0
                    }()) return function (e, i) {
                    var o = "node " + j();
                    Editor.log(Editor.T("oppo-runtime.rpk_installing"));
                    var t = `${o}  cocoscreator`;
                    i(`${t+=m?"":" release"}`, {
                        env: S,
                        cwd: p
                    }, i => {
                        if (i) return e.reply(new Error(Editor.T("oppo-runtime.rpk_install_fail") + i)), void 0;
                        var o = r.join(p, "dist", a.package + (m ? "." : ".signed.") + "rpk");
                        Editor.log(Editor.T("oppo-runtime.rpk_install_success") + o), h(), e.reply(), P()
                    })
                }(e, o), void 0;
                Editor.log(Editor.T("oppo-runtime.building_subpack_rpk"));
                var t = r.join(p, "subpackages");
                if (i.existsSync(t))
                    for (var n in d) {
                        var s = r.join(p, d[n].root, "index.js"),
                            c = r.join(p, d[n].root, "main.js");
                        i.existsSync(s) && i.renameSync(s, c)
                    }(function (e, i) {
                        var o = `${"node "+j()} subpack --no-build-js`;
                        m || (o += " release");
                        i(`${o}`, {
                            env: S,
                            cwd: p
                        }, i => {
                            if (i) return e.reply(new Error(Editor.T("oppo-runtime.build_subpack_rpk_error") + i)), void 0;
                            var o = r.join(p, "dist", a.package + (m ? "." : ".signed.") + "rpk");
                            Editor.log(Editor.T("oppo-runtime.build_subpack_rpk_complet") + o), h(), e.reply(), P()
                        })
                    })(e, o)
            }(f, o)
    }())
}

function h() {
    var e = r.join(s, "res"),
        o = r.join(p, "res");
    a.tinyPackageMode && i.existsSync(s) && (i.emptyDirSync(o), i.copySync(e, o)), i.existsSync(s) && i.removeSync(s)
}

function P() {
    var e = CocosEngine,
        r = parseInt("2.2.1".replace(/[^\d]/g, ""));
    if (!0 === parseInt(e.slice(0, 6).replace(/[^\d]/g, "")) >= r) {
        var i;
        let e = {
            resUrl: (i = void 0 !== Editor.Profile.load.getSelfData ? Editor.Profile.load("project://oppo-runtime.json").getSelfData() : Editor.Profile.load("profile://project/oppo-runtime.json").data).tinyPackageServer,
            orientation: i.deviceOrientation,
            projectName: i.name
        };
        return Editor.Ipc.sendToMain("builder:notify-build-result", g, e), void 0
    }!0 === a.useDebugKey || a.package.indexOf("test") > -1 || a.name.indexOf("test") > -1 || !0 === f || Editor.Metrics.trackEvent("Project", "BetaPlatforms", "oppo-runtime", {
        packageName: a.package,
        appName: a.name,
        version: a.versionName,
        orientation: a.deviceOrientation
    })
}
module.exports = {
    name: Editor.T("oppo-runtime.platform_name"),
    platform: "quickgame",
    extends: "runtime",
    buttons: [Editor.Builder.DefaultButtons.Build],
    messages: {
        "build-start": function (e, r) {
            i.existsSync(r.dest) && i.emptyDirSync(r.dest), e.reply()
        },
        "build-finished": function (e, r) {
            var o;
            g = r, void 0 !== Editor.Profile.load.getSelfData ? (o = Editor.Profile.load("project://oppo-runtime.json"), a = o.getSelfData()) : (o = Editor.Profile.load("profile://project/oppo-runtime.json"), a = o.data);
            var t = a.package,
                n = a.name,
                s = a.versionName,
                p = a.versionCode,
                d = a.minPlatformVersion;
            v = a.showNpmPath, u = a.privatePath, l = a.certificatePath, m = a.useDebugKey, c = a.icon, f = r.debug, sendStatisticsSourceMaps = r.sourceMaps;
            var y = !0,
                _ = [],
                E = "";
            if ([{
                    name: Editor.T("oppo-runtime.package"),
                    value: t
                }, {
                    name: Editor.T("oppo-runtime.name"),
                    value: n
                }, {
                    name: Editor.T("oppo-runtime.desktop_icon"),
                    value: c
                }, {
                    name: Editor.T("oppo-runtime.version_name"),
                    value: s
                }, {
                    name: Editor.T("oppo-runtime.version_number"),
                    value: p
                }, {
                    name: Editor.T("oppo-runtime.support_min_platform"),
                    value: d
                }].forEach(function (e) {
                    e.value || (y = !1, _.push(e.name))
                }), y || (E += _.join("、") + Editor.T("oppo-runtime.not_empty")), c && (i.existsSync(c) || (y = !1, E += c + Editor.T("oppo-runtime.icon_not_exist"))), m || ("" === u ? (y = !1, E += Editor.T("oppo-runtime.private_pem_path_error")) : i.existsSync(u) || (y = !1, E += `${u}` + Editor.T("oppo-runtime.signature_not_exist")), "" === l ? (y = !1, E += Editor.T("oppo-runtime.certificate_pem_path_error")) : i.existsSync(l) || (y = !1, E += `${l}` + Editor.T("oppo-runtime.signature_not_exist"))), t.match(/^[a-zA-Z]+[0-9a-zA-Z_]*(\.[a-zA-Z]+[0-9a-zA-Z_]*)*$/) || (y = !1, E += Editor.T("oppo-runtime.package_name_error")), a.tinyPackageMode && "" === a.tinyPackageServer && (y = !1, E += "please enter remote server root"), !y) return e.reply(new Error(E)), void 0;
            b(e, r)
        }
    },
    settings: Editor.url("packages://oppo-runtime/build-ui.js")
};
