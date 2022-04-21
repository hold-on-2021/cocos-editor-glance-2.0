const t = require(Editor.url("app://editor/share/sharp")),
    e = require("child_process").spawn,
    r = require("child_process").spawnSync,
    n = require("fire-fs"),
    o = require("fire-path"),
    i = require("async"),
    a = Editor.remote.Project.path,
    c = o.join(a, "temp/TexturePacker/build");

function s(t, e) {
    return o.join(o.dirname(t), o.basenameNoExt(t) + e)
}

function l(e, r, n, o) {
    let i = t(e),
        a = ".png";
    if ("webp" === n.name) i = i.webp({
        quality: n.quality
    }), a = ".webp";
    else if ("jpg" === n.name) i = i.jpeg({
        quality: n.quality
    }), a = ".jpg";
    else if ("png" === n.name) {
        let t = n.quality / 10 | 0;
        i = i.png({
            compressionLevel: t
        })
    }
    r = s(r, a), i.toFile(r, t => {
        o(t)
    })
}

function p(t) {
    if ("number" != typeof t) return;
    let e = 2;
    for (; t > e;) e *= 2;
    return e
}

function u(r, i, l, u) {
    let m = Editor.url("unpack://static/tools/texture-compress/PVRTexTool/OSX_x86/PVRTexToolCLI");
    "win32" === process.platform && (m = Editor.url("unpack://static/tools/texture-compress/PVRTexTool/Windows_x86_64/PVRTexToolCLI.exe"));
    let _ = !1,
        f = "PVRTC1_4";

    function d() {
        i = s(i, ".pvr");
        let t = "pvrtc" + l.quality,
            n = ["-i", r, "-o", i, "-squarecanvas", "+", "-potcanvas", "+", "-q", t, "-f", `${f},UBN,lRGB`];
        console.log(`pvrtc compress command :  ${m} ${n.join(" ")}`),
            function (t, r, n, o) {
                let i = e(t, r, n);
                i.stdout.on("data", function (t) {
                    t.toString().split("\n").forEach(t => {
                        Editor.log(t)
                    })
                }), i.stderr.on("data", function (t) {
                    t.toString().split("\n").forEach(t => {
                        Editor.info(t)
                    })
                }), i.on("close", function () {
                    o && o(null)
                }), i.on("error", function (t) {
                    o && o(t)
                })
            }(m, n, {}, u)
    }
    if ("pvrtc_4bits" === l.name ? f = "PVRTC1_4" : "pvrtc_4bits_rgb" === l.name ? f = "PVRTC1_4_RGB" : "pvrtc_2bits" === l.name ? f = "PVRTC1_2" : "pvrtc_2bits_rgb" === l.name ? f = "PVRTC1_2_RGB" : "pvrtc_4bits_rgb_a" === l.name ? (f = "PVRTC1_4_RGB", _ = !0) : "pvrtc_2bits_rgb_a" === l.name && (f = "PVRTC1_2_RGB", _ = !0), _) {
        let e = o.relative(a, r),
            i = o.join(c, "pvr_alpha", e);
        return function (e, r, i) {
            let a = new t(e);
            a.metadata().then(e => {
                const c = e.width,
                    s = e.height;
                let l = p(c),
                    u = p(s);
                u < l / 2 && (u = l / 2);
                let m = e.channels,
                    _ = 4 === m;
                a.raw().toBuffer((e, a) => {
                    if (e) return i(e);
                    const l = 2 * c * u * 3;
                    let p, f, d = Buffer.alloc(l, 0);
                    for (let t = 0; t < s; t++)
                        for (let e = 0; e < c; e++) {
                            let r = t * c + e,
                                n = r * m;
                            d[p = 3 * r] = a[n], d[p + 1] = a[n + 1], d[p + 2] = a[n + 2], f = 3 * ((t + u) * c + e);
                            let o = a[n + 3];
                            _ || (o = 255), d[f] = o, d[f + 1] = o, d[f + 2] = o
                        }
                    const R = {
                        raw: {
                            width: c,
                            height: 2 * u,
                            channels: 3
                        }
                    };
                    n.ensureDirSync(o.dirname(r)), t(d, R).toFile(r, t => {
                        i(t)
                    })
                })
            })
        }(r, i, t => {
            if (t) return u(t);
            r = i, setTimeout(() => {
                d()
            }, 10)
        }), void 0
    }
    d()
}

function m(t, e, n, i) {
    let a = Editor.url("unpack://static/tools/texture-compress/mali/OSX_x86/etcpack");
    "win32" === process.platform && (a = Editor.url("unpack://static/tools/texture-compress/mali/Windows_64/etcpack.exe"));
    let c = o.dirname(a);
    a = "." + o.sep + o.basename(a);
    let s = "etc1",
        l = "RGB";
    "etc1" === n.name ? (s = "etc1", l = "RGBA") : "etc1_rgb" === n.name ? s = "etc1" : "etc2" === n.name ? (s = "etc2", l = "RGBA") : "etc2_rgb" === n.name && (s = "etc2");
    let p = [o.normalize(t), o.dirname(e), "-c", s, "-s", n.quality],
        u = c,
        m = Object.assign({}, process.env);
    m.PATH = c + ":" + m.PATH;
    let _ = {
        cwd: u,
        env: m
    };
    "etc2" === s && p.push("-f", l), "etc1" === s && "RGBA" === l && p.push("-aa"), console.log(`etc compress command :  ${a} ${p.join(" ")}`),
        function (t, e, n, o) {
            let i = r(t, e, n);
            i.stdout.length > 0 && i.stdout.toString().split("\n").forEach(t => {
                Editor.log(t)
            }), i.stderr.length > 0 && i.stderr.toString().split("\n").forEach(t => {
                Editor.error(t)
            }), o(i.error)
        }(a, p, _, i)
}
module.exports = function (t, e) {
    let r = t.src,
        a = t.dst,
        c = t.actualPlatform,
        p = t.compressOption;
    "web-mobile" === c || "web-desktop" === c ? c = "web" : "mac" !== c && "win32" !== c || (c = "native");
    let _ = [],
        f = p[c];

    function d() {
        return _.map(t => {
            let e = cc.Texture2D.PixelFormat;
            if (t.name.startsWith("pvrtc_")) {
                let r = e.RGBA_PVRTC_4BPPV1;
                return "pvrtc_2bits" === t.name ? r = e.RGBA_PVRTC_2BPPV1 : "pvrtc_4bits_rgb" === t.name ? r = e.RGB_PVRTC_4BPPV1 : "pvrtc_2bits_rgb" === t.name ? r = e.RGB_PVRTC_2BPPV1 : "pvrtc_4bits_rgb_a" === t.name ? r = e.RGB_A_PVRTC_4BPPV1 : "pvrtc_2bits_rgb_a" === t.name && (r = e.RGB_A_PVRTC_2BPPV1), `.pvr@${r}`
            }
            if (t.name.startsWith("etc")) {
                let r = e.RGB_ETC1;
                return "etc1" === t.name ? r = e.RGBA_ETC1 : "etc2" === t.name ? r = e.RGBA_ETC2 : "etc2_rgb" === t.name && (r = e.RGB_ETC2), `.pkm@${r}`
            }
            return "." + t.name
        })
    }
    if (f && f.formats.length > 0 ? _ = f.formats : p.default && (_ = p.default.formats), n.ensureDirSync(o.dirname(a)), 0 === _.length) return n.copy(r, a, t => {
        t && Editor.error("Failed to copy native asset file %s to %s", r, a), e(t, d(), [a])
    }), void 0;
    i.each(_, (t, e) => {
        let n = l;
        t.name.startsWith("pvrtc_") ? n = u : t.name.startsWith("etc") && (n = m), n(r, a, t, e)
    }, t => {
        let r = d();
        e(t, r, r.map(t => s(a, t.replace(/@.*/, ""))))
    })
};
