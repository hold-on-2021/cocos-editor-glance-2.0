const e = require("path"),
    r = (require("fs"), require("gulp")),
    i = (require("gulp-sourcemaps"), require("babelify")),
    t = require("browserify"),
    n = require("vinyl-source-stream"),
    s = (require("gulp-uglify"), require("vinyl-buffer"));
require("async");
const a = {
    build: async function (a) {
        let {
            rootPath: u,
            dstPath: o
        } = a;
        if (!u) throw new Error("Please specify the jsbAdapter path");
        console.time("build jsb-adapter"), await new Promise(a => {
            (function (a, u, o) {
                let l = e.basename(u);
                u = e.dirname(u);
                let p = t();
                a.forEach(function (e) {
                    p.add(e)
                }), o && o.forEach(function (e) {
                    p.exclude(e)
                });
                let c = CocosEngine,
                    d = parseInt("2.3.0".replace(/[^\d]/g, "")),
                    f = "env";
                return 1 == parseInt(c.slice(0, 6).replace(/[^\d]/g, "")) >= d && (f = require("@babel/preset-env")), p.transform(i, {
                    presets: [f]
                }).bundle().pipe(n(l)).pipe(s()).pipe(r.dest(u))
            })([u], o).on("end", a)
        }), console.timeEnd("build jsb-adapter")
    }
};
module.exports = a;