"use strict";
const e = require("iconv-lite"),
    t = require("fire-path"),
    r = require("fire-fs"),
    o = require("del"),
    i = require("child_process").spawn,
    n = require("tree-kill"),
    s = require("async"),
    a = require("electron"),
    l = require("globby"),
    c = require("xxtea-node"),
    d = require("zlib"),
    {
        promisify: p
    } = require("util"),
    u = Editor.require("app://share/engine-utils"),
    f = Editor.Profile.load("global://settings.json");
let g = t.join(Editor.App.home, "logs/native.log"),
    m = f.get("show-console-log");
let E, j, h, y, S, w, v, O, C, _, x, b, P, k, A, $, R, I, F = -1,
    L = -1,
    M = "",
    D = Editor.url("unpack://utils/Python27/python");

function T() {
    let e = Editor.Profile.load("local://settings.json");
    return !1 !== e.get("use-global-engine-setting") && (e = Editor.Profile.load("global://settings.json")), e.get("use-default-cpp-engine") ? Editor.builtinCocosRoot : e.get("cpp-engine-path")
}

function N(e, r) {
    var o;
    let n = K();
    if (n) return [n, o];
    e = [y].concat(e);
    try {
        if ("darwin" === process.platform) o = i("sh", e, r);
        else {
            let n = e.indexOf("--env"),
                s = "COCOS_PYTHON_HOME=" + t.dirname(D);
            n >= 0 ? n === e.length - 1 ? e.push(s) : e[n + 1] += ";" + s : (e.push("--env"), e.push(s)), o = i(D, e, r)
        }
    } catch (e) {
        n = e
    }
    return {
        error: n,
        child: o
    }
}

function K() {
    return h = T(), console.log("Cocos2dx root: " + h), -1 !== h.indexOf(" ") ? new Error(`Cocos2dx root [${h}] can't include space.`) : (j = t.join(h, "tools/cocos2d-console/bin"), y = "darwin" === process.platform ? t.join(j, "cocos") : t.join(j, "cocos.py"), null)
}

function B(e, o) {
    if (v = e.platform, !(P = e.template)) return o && o(new Error("Template is empty, please select a template.")), void 0;
    O = e.buildPath, C = e.dest, _ = e.projectName || e.title || t.basename(e.project), x = e[v].packageName || "com.fireball." + _, b = e.debug, k = e.useDebugKeystore, A = k ? Editor.url("unpack://static/build-templates/native/debug.keystore") : e.keystorePath, "win32" === process.platform && (A = A.replace(/\\/g, "/")), $ = k ? 123456 : e.keystorePassword, R = k ? "debug_keystore" : e.keystoreAlias, I = k ? 123456 : e.keystoreAliasPassword;
    let n = function (e) {
        e = e || {}, m = f.get("show-console-log");
        let o = K();
        if (o) return o;
        let i = e.ndkRoot || f.get("ndk-root"),
            n = e.androidSDKRoot || f.get("android-sdk-root");
        S = {
            COCOS_FRAMEWORKS: t.join(h, "../"),
            COCOS_X_ROOT: h,
            COCOS_CONSOLE_ROOT: j,
            NDK_ROOT: i,
            ANDROID_SDK_ROOT: n
        }, w = "";
        for (let e in S) "" !== w && (w += ";"), w += `${e}=${S[e]}`;

        function s(e, t) {
            return t ? r.existsSync(t) ? null : new Error(`Can't find [${e}] path: ${t}`) : new Error(`[${e}] is empty, please set [${e}] in Preferences.`)
        }
        if (console.log(`native environment string : ${w}`), o = s("Cocos Console Root", j)) return o;
        if (!r.existsSync(y)) return new Error(`Can't find Cocos Console Bin: ${y}`);
        if ("android" === v || "android-instant" === v) {
            if (o = s("NDK Root", i)) return o;
            if (o = s("Android SDK Root", n)) return o;
            if (!("win32" !== process.platform || process.env.JAVA_HOME && r.existsSync(process.env.JAVA_HOME))) return new Error("Please make sure java is installed and JAVA_HOME is in your environment")
        }
        return null
    }(e);
    return n ? (o && o(n), void 0) : (n = function () {
        if (-1 === v.indexOf("android") || k) return null;
        if (!A) return new Error("Keystore Path is empty, please set Keystore path");
        if (!r.existsSync(A)) return new Error(`Keystore Path [${A}] is not exists, please check Keystore path`);
        if (!$) return new Error("Keystore Password is empty, please set Keystore Password");
        if (!R) return new Error("Keystore Alias is empty, please set Keystore Alias");
        if (!I) return new Error("Keystore Alias Password is empty, please set Keystore Alias Password");
        return null
    }()) ? (o && o(n), void 0) : (s.series([e => {
        if ("win32" === process.platform) return e(), void 0;
        try {
            let t, r = i("python", ["-V"]);
            r.stderr.on("data", function (e) {
                let t = e.toString();
                "3" === (t = t.replace("Python ", "").replace("\n", ""))[0] ? Editor.warn(`Checked Python Version [${t}], please use python 2.x.x version. Recommend [2.7.5] version`): Editor.log(`Checked Python Version [${t}]`)
            }), r.on("error", function () {
                t = new Error("Can't find python, please install python or check your environment")
            }), r.on("close", function () {
                e(t)
            })
        } catch (t) {
            e(new Error("Can't find python, please install python or check your environment"))
        }
    }, e => {
        let t = N(["-v"]);
        if (t.error) return e(t.error);
        let r = t.child;
        r.stdout.on("data", function (e) {
            E = e.toString()
        }), r.stderr.on("data", function (e) {
            Editor.failed(e.toString())
        }), r.on("close", function () {
            e()
        }), r.on("error", function (t) {
            e(t)
        })
    }, e => {
        let o = t.join(j, "../../../"),
            i = t.join(o, "version"),
            n = t.join(o, "cocos/cocos2d.cpp"),
            s = t.join(o, "frameworks/js-bindings/bindings/manual/ScriptingCore.h");
        if (r.existsSync(i)) M = r.readFileSync(i, "utf8");
        else {
            let e = null,
                t = null;
            if (r.existsSync(n) ? (e = n, t = '.*return[ \t]+"(.*)";') : r.existsSync(s) && (e = s, t = '.*#define[ \t]+ENGINE_VERSION[ \t]+"(.*)"'), e) {
                let o = r.readFileSync(e, "utf8").match(t);
                o && (M = o[1])
            }
        }
        if (M) {
            let e = M.match("([0-9]+)[.]([0-9]+)");
            e && (F = parseInt(e[1]), L = parseInt(e[2]))
        }
        e()
    }], e => {
        o && o(e)
    }), void 0)
}

function U(e, o) {
    let i = require("ini"),
        n = t.join(e, "cocos2d.ini");
    if (!r.existsSync(n)) return Editor.failed(`Can't find ${n}`), null;
    let s = i.parse(r.readFileSync(n, "utf-8"));
    s.paths.templates || (s.paths.templates = "../../../templates"), s.engineMode = s.global.cocos2d_x_mode, s.templatesPath = t.join(e, s.paths.templates);
    let a = t.join(s.templatesPath, "js-template-*");
    s.templates = [], l(a, (e, r) => {
        r.forEach(e => {
            e = t.normalize(e);
            let r = t.basename(e);
            r = r.replace("js-template-", ""), s.templates.push(r)
        }), o && o(s)
    })
}
const V = 23;
const J = 26;

function q(e) {
    let t = "utf-8",
        o = r.readFileSync(Editor.url("unpack://utils/locale-encoding.py"));
    try {
        let r;
        try {
            r = "darwin" === process.platform ? i("python", ["-c", o]) : i(D, ["-c", o])
        } catch (t) {
            return e && e(t), void 0
        }
        r.stdout.on("data", function (e) {
            let r = e.toString();
            r && (t = r)
        }), r.stderr.on("data", function (e) {
            Editor.failed(e.toString())
        }), r.on("close", function () {
            e && e(null, t)
        }), r.on("error", function (t) {
            e && e(t)
        })
    } catch (r) {
        Editor.log("Get locale encoding failed, use utf-8 encoding"), e && e(null, t)
    }
}

function z(t, o, i) {
    let n = "utf-8",
        s = {
            logFilePath: g,
            disableEditorLog: !m,
            useSystemEncoding: !0,
            prefix: ""
        };

    function a() {
        let s;
        o.logFilePath && (r.ensureFileSync(o.logFilePath), s = r.createWriteStream(o.logFilePath, {
            defaultEncoding: n
        })), t.stdout.on("data", t => {
            if (s && s.write(t), o.disableEditorLog) return;
            let r;
            (r = "win32" === process.platform ? e.decode(t, n) : t.toString()).length > 1 && (r = r.replace(/\n*$/g, "")), r.split("\n").forEach(e => {
                o.prefix && (e = o.prefix + " : " + e), Editor.log(e)
            })
        }), t.stderr.on("data", t => {
            if (s && s.write(t), o.disableEditorLog) return;
            let r;
            r = "win32" === process.platform ? e.decode(t, n) : t.toString(), o.prefix && (r = o.prefix + " : " + r), -1 !== r.toLowerCase().indexOf("warning") ? Editor.warn(r) : Editor.failed(r)
        }), t.on("close", (e, r) => {
            s && s.close(), i.call(t, null, e, r)
        }), t.on("error", function (e) {
            i.call(t, e)
        })
    }
    if ("function" == typeof o ? (i = o, o = s) : o = Object.assign(s, o), o.useSystemEncoding) return q((e, t) => {
        n = t, a()
    }), void 0;
    a()
}

function H() {
    if ("binary" !== P) return null;
    let e = t.join(h, "prebuilt", v);
    return r.existsSync(e) ? null : new Error(`Can't find prebuilt libs for platform [${v}]. Please compile prebuilt libs first`)
}

function W(e) {
    if (-1 === v.indexOf("android")) return;
    k && (A = Editor.url("unpack://static/build-templates/native/debug.keystore")), "win32" === process.platform && (A = A.replace(/\\/g, "/"));
    let o = t.join(C, "frameworks/runtime-src/proj.android-studio/gradle.properties");
    if (r.existsSync(o)) {
        let i = r.readFileSync(o, "utf-8");
        i = (i = (i = (i = (i = (i = i.replace(/RELEASE_STORE_FILE=.*/, `RELEASE_STORE_FILE=${A}`)).replace(/RELEASE_STORE_PASSWORD=.*/, `RELEASE_STORE_PASSWORD=${$}`)).replace(/RELEASE_KEY_ALIAS=.*/, `RELEASE_KEY_ALIAS=${R}`)).replace(/RELEASE_KEY_PASSWORD=.*/, `RELEASE_KEY_PASSWORD=${I}`)).replace(/PROP_TARGET_SDK_VERSION=.*/, `PROP_TARGET_SDK_VERSION=${X(e.apiLevel)}`)).replace(/PROP_COMPILE_SDK_VERSION=.*/, `PROP_COMPILE_SDK_VERSION=${X(e.apiLevel)}`);
        let n = e.appABIs && e.appABIs.length > 0 ? e.appABIs.join(":") : "armeabi-v7a";
        i = i.replace(/PROP_APP_ABI=.*/g, `PROP_APP_ABI=${n}`), r.writeFileSync(o, i), i = "", i += `ndk.dir=${S.NDK_ROOT}\n`, i += `sdk.dir=${S.ANDROID_SDK_ROOT}`, "win32" === process.platform && (i = (i = i.replace(/\\/g, "\\\\")).replace(/:/g, "\\:")), r.writeFileSync(t.join(t.dirname(o), "local.properties"), i)
    }
}

function G() {
    let e = t.join(C, ".cocos-project.json");
    if (!r.existsSync(e)) return Editor.error(`Can't find project json [${e}]`), void 0;
    let o = JSON.parse(r.readFileSync(e, "utf8")),
        i = o.projectName,
        n = o.packageName,
        s = i !== _,
        a = n !== x;
    if (!s && !a) return;
    let l = t.join(C, "cocos-project-template.json");
    if (!r.existsSync(l)) return Editor.error(`Can't find template json [${l}]`), void 0;
    let c, d = JSON.parse(r.readFileSync(l, "utf8")).do_add_native_support;
    a && (c = (c = (c = d.project_replace_package_name.files).concat(d.project_replace_mac_bundleid.files)).concat(d.project_replace_ios_bundleid.files)).forEach(function (e) {
        let o = t.join(C, e);
        if (!r.existsSync(o)) return Editor.error(`Can't not find file [${e}], replace package name failed`), void 0;
        let i = r.readFileSync(o, "utf8");
        i = i.replace(new RegExp(n, "gm"), x), r.writeFileSync(o, i)
    }), s && ((c = d.project_replace_project_name.files).forEach(e => {
        let o = t.join(C, e.replace("PROJECT_NAME", i));
        if (!r.existsSync(o)) return Editor.error(`Can't not find file [${o}], replace project name failed`), void 0;
        let n = r.readFileSync(o, "utf8");
        n = n.replace(new RegExp(i, "gm"), _), r.writeFileSync(o, n)
    }), (c = d.project_rename.files).forEach(e => {
        let o = t.join(C, e.replace("PROJECT_NAME", i));
        if (!r.existsSync(o)) return Editor.error(`Can't not find file [${o}], replace project name failed`), void 0;
        let n = t.join(C, e.replace("PROJECT_NAME", _));
        r.renameSync(o, n)
    })), o.projectName = _, o.packageName = x, r.writeFileSync(e, JSON.stringify(o, null, 2))
}

function Y(e, o) {
    const i = require("plist");
    let n = t.join(C, "frameworks/runtime-src/proj.ios_mac/ios/Info.plist");
    if (r.existsSync(n)) {
        let t = r.readFileSync(n, "utf8"),
            o = i.parse(t),
            s = [];
        e.landscapeRight && s.push("UIInterfaceOrientationLandscapeRight"), e.landscapeLeft && s.push("UIInterfaceOrientationLandscapeLeft"), e.portrait && s.push("UIInterfaceOrientationPortrait"), e.upsideDown && s.push("UIInterfaceOrientationPortraitUpsideDown"), o.UISupportedInterfaceOrientations = s, t = i.build(o), r.writeFileSync(n, t)
    }
    let s = [t.join(C, "frameworks/runtime-src/proj.android-studio/app/AndroidManifest.xml"), t.join(C, "frameworks/runtime-src/proj.android-studio/game/AndroidManifest.xml")].filter(e => r.existsSync(e));
    for (let t = 0, i = s.length; t < i; t++) {
        let i = s[t],
            n = i.indexOf("proj.android-studio") >= 0,
            a = /android:screenOrientation=\"[^"]*\"/,
            l = 'android:screenOrientation="unspecified"';
        if (e.landscapeRight && e.landscapeLeft && e.portrait && e.upsideDown) l = 'android:screenOrientation="fullSensor"';
        else if (e.landscapeRight && !e.landscapeLeft) l = 'android:screenOrientation="landscape"';
        else if (!e.landscapeRight && e.landscapeLeft) l = 'android:screenOrientation="reverseLandscape"';
        else if (e.landscapeRight && e.landscapeLeft) l = 'android:screenOrientation="sensorLandscape"';
        else if (e.portrait && !e.upsideDown) l = 'android:screenOrientation="portrait"';
        else if (!e.portrait && e.upsideDown) {
            let e = "reversePortrait";
            o < 16 && !n && (e = "reversePortait"), l = `android:screenOrientation="${e}"`
        } else if (e.portrait && e.upsideDown) {
            let e = "sensorPortrait";
            o < 16 && !n && (e = "sensorPortait"), l = `android:screenOrientation="${e}"`
        }
        let c = r.readFileSync(i, "utf8");
        c = c.replace(a, l), r.writeFileSync(i, c)
    }
}

function X(e) {
    let t = e.match("android-([0-9]+)$"),
        r = -1;
    return t && (r = parseInt(t[1])), r
}
var Q = [
    ["USE_VIDEO", "VideoPlayer"],
    ["USE_WEB_VIEW", "WebView"],
    ["USE_EDIT_BOX", "EditBox"],
    ["USE_AUDIO", "AudioSource"],
    ["USE_SPINE", "Spine Skeleton"],
    ["USE_DRAGONBONES", "DragonBones"],
    ["USE_SOCKET", "Native Socket"]
];

function Z(e) {
    let o = e.platform.toLowerCase();
    if ("mac" === o) {
        ee("link" === e.template ? t.join(T(), "cocos/platform/mac/CCModuleConfigMac.debug.xcconfig") : t.join(C, "frameworks/cocos2d-x/cocos/platform/mac/CCModuleConfigMac.debug.xcconfig"), e), ee("link" === e.template ? t.join(T(), "cocos/platform/mac/CCModuleConfigMac.release.xcconfig") : t.join(C, "frameworks/cocos2d-x/cocos/platform/mac/CCModuleConfigMac.release.xcconfig"), e)
    } else if ("ios" === o) {
        ee("link" === e.template ? t.join(T(), "cocos/platform/ios/CCModuleConfigIOS.debug.xcconfig") : t.join(C, "frameworks/cocos2d-x/cocos/platform/ios/CCModuleConfigIOS.debug.xcconfig"), e), ee("link" === e.template ? t.join(T(), "cocos/platform/ios/CCModuleConfigIOS.release.xcconfig") : t.join(C, "frameworks/cocos2d-x/cocos/platform/ios/CCModuleConfigIOS.release.xcconfig"), e)
    } else "android" === o || "android-instant" === o ? function (e) {
        let o = t.join(C, "frameworks/runtime-src/proj.android-studio/jni/CocosApplication.mk");
        if (!r.existsSync(o)) return Editor.failed(`Can not find file ${o}`), void 0;
        let i = r.readFileSync(o, "utf8");
        Q.forEach(t => {
            (function (t) {
                let r = -1 !== e.excludedModules.indexOf(t[1]); - 1 === i.indexOf(t[0]) ? i += `${t[0]} := ${r?0:1}\n` : i = i.replace(new RegExp(`${t[0]}\\s*:=\\s*(0|1)`, "g"), `${t[0]} := ${r?0:1}`)
            })(t)
        }), r.writeFileSync(o, i)
    }(e) : "win32" === o && function (e) {}()
}

function ee(e, t) {
    if (!r.existsSync(e)) return Editor.failed(`Can not find file ${e}`), void 0;
    let o = r.readFileSync(e, "utf8");
    Q.forEach(e => {
        (function (e) {
            let r = -1 !== t.excludedModules.indexOf(e[1]);
            o = -1 === o.indexOf(e[0]) ? o.replace(/\$\(inherited\)/, t => t + ` ${e[0]}=${r?0:1}`) : o.replace(new RegExp(`${e[0]}=(0|1)`), `${e[0]}=${r?0:1}`)
        })(e)
    }), r.writeFileSync(e, o)
}
let te, re, oe, ie, ne;

function se() {
    te && (re = !0, n(te.pid, "SIGTERM", () => {
        re = !1
    }), te = null)
}

function ae(e) {
    let o = !1;
    if ("ios" === v) {
        o = r.readdirSync(t.join(e.dest, "frameworks/runtime-src/proj.ios_mac/")).some(e => e.endsWith(".xcworkspace"))
    }
    return o
}

function le(e) {
    Editor.log("Begin generate Android App Bundle...");
    let o = "android-instant" === v,
        n = o ? ":game:bundle" : "bundle",
        s = t.join(C, "frameworks/runtime-src/proj.android-studio"),
        a = "win32" === process.platform ? ".\\gradlew.bat" : "./gradlew";
    i(a, [`${n}${b?"Debug":"Release"}`], {
        cwd: s
    }).on("close", i => {
        if (0 === i) {
            let e = t.join(s, `app/build/outputs/bundle/${b?"debug":"release"}/${_}.aab`);
            o && (e = t.join(s, `game/build/outputs/bundle/${b?"debugFeature":"releaseFeature"}/game.aab`)), r.copySync(e, t.join(C, b ? "simulator" : "publish", "android", `${_}-${b?"debug":"release"}.aab`))
        } else Editor.warn("generate Android App Bundle fail");
        e && e()
    })
}

function ce() {
    oe && (n(oe.pid), oe = null)
}

function de() {
    ie && (n(ie.pid), ie = null, Editor.Panel.close("simulator-debugger"))
}
module.exports = {
    build: function (e, i) {
        B(e, n => {
            if (n = n || H()) return i && i(n), void 0;
            let s = X(e.apiLevel);
            if (s = s > 0 ? s : V, !r.existsSync(C)) {
                Editor.log("Creating native cocos project to ", C);
                let a = "tempCocosProject",
                    l = t.join(O, a);
                if (r.existsSync(l)) try {
                    o.sync(l, {
                        force: !0
                    })
                } catch (n) {
                    return i && i(n), void 0
                }
                Editor.Ipc.sendToMain("builder:state-changed", "creating native project", .05);
                let c = N(["new", a, "-l", "js", "-d", O, "-t", P, "--env", w]);
                return c.error ? (i && i(c.error), void 0) : (z(c.child, (n, c) => n ? (i && i(n), void 0) : 0 !== c ? (i && i(new Error("Failed to create project with exitCode : " + c)), void 0) : (r.rename(l, C, n => {
                    if (n) return i && i(n), void 0;
                    U(j, n => {
                        let l = t.join(n.templatesPath, "js-template-" + P),
                            c = t.join(l, "cocos-project-template.json"),
                            d = t.join(C, "cocos-project-template.json");
                        r.copySync(c, d);
                        try {
                            (function (e, o) {
                                let i = t.join(C, ".cocos-project.json"),
                                    n = JSON.parse(r.readFileSync(i, "utf8"));
                                n.projectName = e, n.packageName = o, r.writeFileSync(i, JSON.stringify(n, null, 2))
                            })(a, "org.cocos2dx." + a), void("win32" !== process.platform && [t.join(C, "frameworks/runtime-src/proj.android-studio/app/jni/Application.mk")].forEach(e => {
                                    let t = r.readFileSync(e, "utf8").split("\n");
                                    for (let e = 0; e < t.length; e++) {
                                        let r = t[e];
                                        r.match(/\bAPP_SHORT_COMMANDS\b.*:=.*true/) && (t[e] = "#" + r)
                                    }
                                    r.writeFileSync(e, t.join("\n"))
                                })), G(),
                                function () {
                                    if ("android-instant" !== P) {
                                        let e = t.join(C, `frameworks/runtime-src/proj.ios_mac/${_}.xcodeproj/project.pbxproj`);
                                        if (r.existsSync(e)) {
                                            let o = r.readFileSync(e, "utf8");
                                            o = o.replace(/\/Applications\/CocosCreator.app\/Contents\/Resources\/cocos2d-x/g, t.resolve(h)), r.writeFileSync(e, o)
                                        } else Editor.warn(`Can't find path [${e}]. Replacing project file failed`)
                                    }
                                    let e = [t.join(C, "frameworks/runtime-src/proj.android-studio/build-cfg.json"), t.join(C, "frameworks/runtime-src/proj.android-studio/settings.gradle"), t.join(C, "frameworks/runtime-src/proj.android-studio/app/build.gradle"), t.join(C, "frameworks/runtime-src/proj.android-studio/game/build.gradle")];
                                    "android-instant" !== P && (e.push(t.join(C, "frameworks/runtime-src/proj.win32/build-cfg.json")), e.push(t.join(C, `frameworks/runtime-src/proj.win32/${_}.vcxproj`)), e.push(t.join(C, `frameworks/runtime-src/proj.win32/${_}.sln`))), "link" === P && (e.push(t.join(C, "frameworks/runtime-src/proj.ios_mac/ios/UserConfigIOS.debug.xcconfig")), e.push(t.join(C, "frameworks/runtime-src/proj.ios_mac/ios/UserConfigIOS.release.xcconfig")), e.push(t.join(C, "frameworks/runtime-src/proj.ios_mac/mac/UserConfigMac.debug.xcconfig")), e.push(t.join(C, "frameworks/runtime-src/proj.ios_mac/mac/UserConfigMac.release.xcconfig"))), e.forEach(e => {
                                        if (!r.existsSync(e)) return Editor.warn(`Replace file [${e}] not find.`), void 0;
                                        let o = r.readFileSync(e, "utf8"),
                                            i = t.resolve(h),
                                            n = t.basename(e);
                                        "build-cfg.json" !== n && "settings.gradle" !== n && "build.gradle" !== n || (i = i.replace(/\\/g, "/")), o = (o = o.replace(/\$\{COCOS_X_ROOT\}/g, i)).replace(/\$\(COCOS_X_ROOT\)/g, i), r.writeFileSync(e, o)
                                    })
                                }(),
                                function () {
                                    try {
                                        o.sync(t.join(C, "res"), {
                                            force: !0
                                        }), o.sync(t.join(C, "src"), {
                                            force: !0
                                        })
                                    } catch (e) {
                                        Editor.error(e)
                                    }
                                }(), W(e), Y(e.orientation, s), Z(e)
                        } catch (e) {
                            return i && i(e), void 0
                        }
                        i && i()
                    })
                }), void 0)), void 0)
            }
            try {
                G(), W(e), Y(e.orientation, s),
                    function () {
                        let e = t.join(C, ".cocos-project.json");
                        if (!r.existsSync(e)) return Editor.failed(`Can't find project json [${e}]`), void 0;
                        let o = JSON.parse(r.readFileSync(e, "utf8")).engine_version;
                        o !== M && Editor.failed(`Project version [${o}] not match cocos2d-x-lite version [${M}]. Please delete your build path, then rebuild project.`)
                    }(), Z(e)
            } catch (n) {
                return i && i(n), void 0
            }
            i && i()
        })
    },
    compile: function (e, t) {
        Editor.Ipc.sendToMain("builder:state-changed", "init settings", 0), B(e, o => {
            if (o = o || H()) return t && t(o), void 0;
            if (!r.existsSync(C)) return t && t(new Error(`Can't find ${C}, please first build project`)), void 0;
            Editor.Ipc.sendToMain("builder:state-changed", "compile native", .1), Editor.log("Start to compile native project. Please wait..."), Editor.log(`The log file path [ ${g} ]`);
            let i = ["compile", "-p", "android-instant" === v ? "android" : v, "-m", b ? "debug" : "release", "--compile-script", 0, "--env", w],
                n = {
                    cwd: C
                };
            "android-instant" === v && i.push("--instant-game"), ae(e) && i.push("--xcworkspace");
            let s = V;
            if ("android" === v || "android-instant" === v) {
                if (i.push("--android-studio"), e.apiLevel) {
                    let t = X(e.apiLevel);
                    t > 0 && (i.push("--ap"), i.push(e.apiLevel), s = t)
                }
                e.appABIs && e.appABIs.length > 0 && (i.push("--app-abi"), i.push(e.appABIs.join(":")))
            }
            if ("win32" === v) {
                let t = "";
                t = "auto" === e.vsVersion ? "2015" : e.vsVersion, i.push("--vs"), i.push(t)
            }
            Y(e.orientation, s);
            let a = N(i, n);
            if (a.error) return t && t(a.error), void 0;
            let l = .1;

            function c() {
                (l += 5e-4) > .9 && (l = .9), Editor.Ipc.sendToMain("builder:state-changed", "compile native", l)
            }(te = a.child).stdout.on("data", () => {
                c()
            }), te.stderr.on("data", () => {
                c()
            }), z(te, async (r, o, i) => {
                if (r) return t && t(r), void 0;
                if (te = null, 0 === o) !e.appBundle || "android-instant" !== v && "android" !== v || await p(le)(), Editor.Ipc.sendToMain("builder:state-changed", "finish", 1), Editor.log("Compile native project successfully.");
                else {
                    if (!re && "SIGTERM" !== i) return t && t(new Error(`Compile failed. The log file path [ ${g} ]`)), void 0;
                    Editor.log("Compile native project exited normal")
                }
                t && t()
            })
        })
    },
    encryptJsFiles: function (e, i, n) {
        B(e, s => {
            if (s) return n && n(s), void 0;
            if (!r.existsSync(C)) return n && n(new Error(`Can't find ${C}, please first build project`)), void 0;
            if (!e.xxteaKey) return n && n(new Error("xxtea key is empty.")), void 0;
            (function (e) {
                let o = t.join(C, "frameworks/runtime-src/Classes/AppDelegate.cpp");
                if (!r.existsSync(o)) return Editor.warn(`Can't find path [${o}]`), void 0;
                let i = r.readFileSync(o, "utf8").split("\n");
                for (let t = 0; t < i.length; t++) - 1 !== i[t].indexOf("jsb_set_xxtea_key") && (i[t] = `    jsb_set_xxtea_key("${e.xxteaKey}");`);
                r.writeFileSync(o, i.join("\n"))
            })(e);
            let a = [t.join(C, "src", "**/*.js")];
            if (i)
                for (let e in i) a.push(t.join(C, i[e].path, "*.js"));
            l(a, (i, s) => {
                if (i) return n && n(i), void 0;
                s.forEach(i => {
                    i = t.normalize(i);
                    try {
                        let n = r.readFileSync(i, "utf8");
                        e.zipCompressJs ? (n = d.gzipSync(n), n = c.encrypt(n, c.toBytes(e.xxteaKey))) : n = c.encrypt(c.toBytes(n), c.toBytes(e.xxteaKey)), r.writeFileSync(t.join(t.dirname(i), t.basenameNoExt(i)) + ".jsc", n), o.sync(i, {
                            force: !0
                        })
                    } catch (e) {
                        Editor.warn(e)
                    }
                }), n && n()
            })
        })
    },
    run: function (e, o) {
        ce(), Editor.log("Start to run project"), B(e, n => {
            if (n) return o && o(n), void 0;
            if (!r.existsSync(C)) return o && o(new Error(`Can't find ${C}, please first build project`)), void 0;
            Editor.log("Start to run project. Please wait..."), Editor.log(`The log file path [ ${g} ]`);
            let s = ["run", "-p", "android-instant" === v ? "android" : v, "-m", b ? "debug" : "release", "--env", w, "--compile-script", 0],
                a = {
                    cwd: C
                };
            if ("android-instant" === v) {
                let t = e["android-instant"];
                s.push("--instant-game"), t.scheme && t.host && t.pathPattern && (s.push("--launch-url"), s.push(`${t.scheme}://${t.host}${t.pathPattern}`))
            }
            ae(e) && s.push("--xcworkspace");
            let l = V;
            if ("android" === v || "android-instant" === v) {
                if (s.push("--android-studio"), e.apiLevel) {
                    let t = X(e.apiLevel);
                    t > 0 && (s.push("--ap"), s.push(e.apiLevel), l = t)
                }
                e.appABIs && e.appABIs.length > 0 && (s.push("--app-abi"), s.push(e.appABIs.join(":")))
            }
            if ("win32" === v && "auto" !== e.vsVersion && (s.push("--vs"), s.push(e.vsVersion)), Y(e.orientation, l), "win32" === process.platform && "win32" === v) {
                let e;
                e = b ? t.join(C, "simulator/win32", _ + ".exe") : t.join(C, "publish/win32", _ + ".exe");
                try {
                    oe = i(e, {}, a)
                } catch (n) {
                    return o && o(n), void 0
                }
            } else {
                let e = N(s, a);
                if (e.error) return o && o(e.error), void 0;
                oe = e.child
            }
            z(oe, (e, t) => e ? (o && o(e), void 0) : 0 !== t ? (o && o(new Error(`Failed to run project. The log file path [ ${g} ]`)), void 0) : (o && o(), void 0))
        })
    },
    runSimulator: function (n) {
        de(),
            function () {
                try {
                    let e = Editor.Profile.load("local://settings.json");
                    e.get("use-global-engine-setting") && (e = Editor.Profile.load("global://settings.json"));
                    let o = e.get("use-default-cpp-engine") ? void 0 : e.get("cpp-engine-path"),
                        i = u.getSimulatorConfigAt(o),
                        n = i.init_cfg;
                    const s = Editor.Profile.load("project://project.json");
                    if (s.get("use-project-simulator-setting")) {
                        let e = s.get("simulator-resolution");
                        n.width = e.width, n.height = e.height, n.isLandscape = s.get("simulator-orientation")
                    } else {
                        let t = e.get("simulator-resolution"),
                            r = i.simulator_screen_size[t] || e.get("simulator-customsize-resolution");
                        n.width = r.width, n.height = r.height, n.isLandscape = e.get("simulator-orientation")
                    }
                    let a = u.getSimulatorConfigPath(o);
                    r.existsSync(t.dirname(a)) && r.writeJsonSync(a, i, "utf-8")
                } catch (e) {
                    Editor.error(e)
                }
            }();
        let a, l, c, d = Editor.Profile.load("global://settings.json");
        d && d.get("simulator-debugger") && Editor.Panel.open("simulator-debugger");
        let p = Editor.url("unpack://static/simulator/"),
            f = "utf-8";
        "darwin" === process.platform ? (c = Editor.url("unpack://simulator/mac/Simulator.app"), a = t.join(c, "Contents/MacOS/Simulator"), l = t.join(c, "Contents/Resources")) : "win32" === process.platform && (c = Editor.url("unpack://simulator/win32"), a = t.join(c, "Simulator.exe"), l = c);
        let g = Editor.url("unpack://engine/bin");
        [{
            src: t.join(g, "cocos2d-jsb-for-preview.js"),
            dst: t.join(l, "src/cocos2d-jsb.js")
        }, {
            src: t.join(p, "asset-record-pipe.js"),
            dst: t.join(l, "src/asset-record-pipe.js")
        }, {
            src: t.join(p, "simulator-config.js"),
            dst: t.join(l, "src/simulator-config.js")
        }, {
            src: Editor.url("packages://jsb-adapter/bin"),
            dst: t.join(l, "jsb-adapter")
        }].forEach(e => {
            r.copySync(e.src, e.dst)
        });
        let m = t.join(Editor.Project.path, "temp/internal"),
            E = Editor.url("unpack://static/default-assets");
        o.sync(m, {
            force: !0
        }), r.copySync(E, m), s.series([e => {
            if (n) {
                r.ensureDirSync(n.recordPath), r.emptyDirSync(n.recordPath), "win32" === process.platform && (n.recordPath = n.recordPath.replace(/\\/g, "/"));
                let e = r.readFileSync(t.join(p, "simulator-config.js"), "utf-8");
                e = (e = e.replace(/CC_SIMULATOR_RECORD_MODE\s=\sfalse/g, "CC_SIMULATOR_RECORD_MODE = true")).replace(/CC_SIMULATOR_RECORD_PATH\s=\s""/g, `CC_SIMULATOR_RECORD_PATH = "${n.recordPath}"`), r.writeFileSync(t.join(l, "src/simulator-config.js"), e)
            }
            e()
        }, e => {
            let o = r.readFileSync(t.join(p, "main.js"), "utf-8"),
                i = t.join(Editor.Project.path, "library/imports"),
                n = Editor.Project.path,
                s = Editor.ProjectCompiler.DEST_PATH;
            "win32" === process.platform && (i = i.replace(/\\/g, "/"), n = n.replace(/\\/g, "/"), s = s.replace(/\\/g, "/")), o = (o = (o = o.replace(/{libraryPath}/g, `'${i}/'`)).replace(/{rawAssetsBase}/g, `'${n}/'`)).replace(/{tempScriptsPath}/g, `'${s}/'`);
            let a = u.getSimulatorConfigAt();
            a && a.init_cfg.waitForConnect && (o = "debugger\n" + o), r.writeFileSync(t.join(l, "main.js"), o), e()
        }, e => {
            var o = Editor.isWin32 ? "win32" : "mac";
            Editor.PreviewServer.query("settings.js", o, (o, i) => {
                if (o) return e(o), void 0;
                let n = i;
                n = n.replace(/"?internal"?:/, '"temp/internal":'), r.writeFileSync(t.join(l, "src/settings.js"), n), e()
            })
        }, e => {
            let o = t.join(l, "preview-scene.json");
            Editor.PreviewServer.getPreviewScene(function (t) {
                e(t)
            }, function (t) {
                r.writeFile(o, t, e)
            }, function (t) {
                r.copy(t, o, e)
            })
        }, e => {
            q((t, r) => {
                f = r, e(t)
            })
        }], t => {
            if (t) return Editor.failed(t), void 0;
            let r = ["-workdir", l, "-writable-path", l, "-console", "false", "--env", w];
            try {
                ie = i(a, r)
            } catch (t) {
                return Editor.error(t), void 0
            }
            let o = (e, t) => {
                if (e) return Editor.error(e), void 0;
                0 === t && (ie = null)
            };
            ie.stderr.on("data", t => {
                let r;
                (r = "win32" === process.platform ? e.decode(t, f) : t.toString()).length > 1 && (r = r.replace(/\n*$/g, ""));
                let o = "error"; - 1 !== r.toLowerCase().indexOf("warning") && (o = "warn"), Editor.Ipc.sendToPanel("scene", "scene:print-simulator-log", r, o)
            }), ie.stdout.on("data", t => {
                let r;
                (r = "win32" === process.platform ? e.decode(t, f) : t.toString()).length > 1 && (r = r.replace(/\n*$/g, "")), r.split("\n").forEach(e => {
                    Editor.Ipc.sendToPanel("scene", "scene:print-simulator-log", e)
                })
            }), ie.on("close", (e, t) => {
                o.call(ie, null, e, t), Editor.Panel.close("simulator-debugger")
            }), ie.on("error", function (e) {
                o.call(ie, e), Editor.Panel.close("simulator-debugger")
            })
        })
    },
    saveKeystore: function (e, n) {
        let s = "keytool";
        if ("win32" === process.platform) {
            if (!process.env.JAVA_HOME || !r.existsSync(process.env.JAVA_HOME)) return n && n(new Error("Please make sure java is installed and JAVA_HOME is in your environment")), void 0;
            if (s = t.join(process.env.JAVA_HOME, "bin/keytool.exe"), !r.existsSync(s)) return n && n(new Error(`Can't find path [${s}]. Please make sure JAVA_HOME is in your environment and exists`)), void 0
        }
        let a = e.dest;
        r.existsSync(a) && o.sync(a, {
            force: !0
        });
        let l = [];
        e.commonName && l.push(`CN=${e.commonName}`), e.organizationalUnit && l.push(`OU=${e.organizationalUnit}`), e.organization && l.push(`O=${e.organization}`), e.locality && l.push(`L=${e.locality}`), e.state && l.push(`S=${e.state}`), e.country && l.push(`C=${e.country}`), l = l.join(",");
        let c = ["-genkey", "-keyalg", "RSA", "-keysize", "1024", "-validity", e.validity, "-keystore", t.basename(a), "-storepass", e.password, "-alias", e.alias, "-keypass", e.aliasPassword, "-dname", l];
        Editor.log("Creating keystore : ", c.join(" "));
        let d, p = {
            cwd: t.dirname(a)
        };
        try {
            d = i(s, c, p)
        } catch (e) {
            return n && n(e), void 0
        }
        z(d, (e, t) => e ? (n && n(e), void 0) : 0 !== t ? (n && n(new Error("Failed to create keystore, please check the log information")), void 0) : (n(), void 0))
    },
    openNativeLogFile: function () {
        r.ensureFileSync(g), a.shell.openItem(g)
    },
    stopCompile: se,
    getCocosTemplates: function (e) {
        let r = Editor.Profile.load("local://settings.json");
        !1 !== r.get("use-global-engine-setting") && (r = Editor.Profile.load("global://settings.json")), r.get("use-default-cpp-engine") ? (h = Editor.builtinCocosRoot, Editor.dev && !h && Editor.error("Can not find builtin cocos2d-x, please run 'gulp update-externs'.")) : (h = r.get("cpp-engine-path")) || Editor.error("Can not find cocos engine."), U(t.join(h, "tools", "cocos2d-console", "bin"), t => {
            e && e(null, t.templates)
        })
    },
    getAndroidAPILevels: function (e) {
        let o = f.get("android-sdk-root");
        if (!r.isDirSync(o)) return e(null, []), void 0;
        let i = t.join(o, "platforms", "android-*");
        l(i, (o, i) => {
            let n = [];
            i.forEach(e => {
                e = t.normalize(e);
                let o = t.basename(e);
                X(o) >= V && r.isDirSync(e) && n.push(o)
            }), e && e(null, n)
        })
    },
    getAndroidInstantAPILevels: function (e) {
        let o = f.get("android-sdk-root");
        if (!r.isDirSync(o)) return e(null, []), void 0;
        let i = t.join(o, "platforms", "android-*");
        l(i, (o, i) => {
            let n = [];
            i.forEach(e => {
                e = t.normalize(e);
                let o = t.basename(e);
                X(o) >= J && r.isDirSync(e) && n.push(o)
            }), e && e(null, n)
        })
    },
    stop: function () {
        se(), ce(), de(), ne && (n(ne.pid), ne = null)
    },
    showLogInConsole: m,
    getCocosSpawnProcess: N,
    getCocosRoot: T
};