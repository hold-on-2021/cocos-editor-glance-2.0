const e = require("path"),
    r = (require("fs"), require("gulp")),
    i = (require("gulp-sourcemaps"), require("babelify")),
    s = require("browserify"),
    t = require("vinyl-source-stream"),
    n = require("gulp-uglify"),
    p = require("vinyl-buffer");
require("async");
const u = {
    build: async function (u) {
        let {
            rootPath: a,
            dstPath: o,
            isDebug: l
        } = u;
        if (!a) throw new Error("Please specify the jsbAdapter path");
        console.time("build jsb-adapter"), await new Promise(u => {
            (function (u, a, o, l) {
                let d = e.basename(a);
                a = e.dirname(a);
                let c = s(u);
                o && o.forEach(function (e) {
                    c.exclude(e)
                });
                let b = CocosEngine,
                    f = parseInt("2.3.0".replace(/[^\d]/g, "")),
                    q = "env";
                return 1 == parseInt(b.slice(0, 6).replace(/[^\d]/g, "")) >= f && (q = require("@babel/preset-env")), !0 === l ? c.transform(i, {
                    presets: [q]
                }).bundle().pipe(t(d)).pipe(p()).pipe(r.dest(a)) : c.transform(i, {
                    presets: [q]
                }).bundle().pipe(t(d)).pipe(p()).pipe(n()).pipe(r.dest(a))
            })(a, o, void 0, l).on("end", u)
        }), console.timeEnd("build jsb-adapter")
    }
};
module.exports = u;