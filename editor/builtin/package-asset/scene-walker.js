const e = require("fire-fs"),
    r = require("fire-url"),
    t = require("fire-path"),
    i = require("async"),
    s = require("./parse/depend");
let d = cc.js._getClassById,
    u = Editor.remote.importPath,
    o = new cc.deserialize.Details;
module.exports = {
    _queryDependAsset(l, n, a) {
        let p = Editor.remote.assetdb.uuidToUrl(l);
        if (!p || -1 !== p.indexOf(s.INTERNAL)) return a();
        let c = n[l];
        if (c) return a();
        if (Editor.remote.assetdb.isSubAssetByUuid(l)) {
            p = Editor.remote.assetdb.uuidToUrl(l);
            let e = r.dirname(p);
            if (l = Editor.remote.assetdb.urlToUuid(e), c = n[l]) return a()
        }
        n[l] = !0, Editor.assetdb.queryMetaInfoByUuid(l, (r, p) => {
            if (r) return Editor.error(r), void 0;
            let y = Editor.assets[p.assetType];
            if (!y || cc.RawAsset.isRawAssetType(y)) return a();
            let f = JSON.parse(p.json);
            if (f && f.rawTextureUuid && (n[f.rawTextureUuid] = !0), s.isScript(p.assetType)) return s.queryDependScriptByUuid(l, (e, r) => {
                if (e) return Editor.error(e), void 0;
                i.each(r, (e, r) => {
                    (c = n[e]) || (n[e] = !0), r()
                }, a)
            }), void 0;
            let U = l.slice(0, 2) + t.sep + l + ".json",
                q = t.join(u, U),
                E = e.readFileSync(q);
            o.reset(), cc.deserialize(E, o, {
                classFinder: function (e) {
                    if (Editor.Utils.UuidUtils.isUuid(e)) {
                        let r = Editor.Utils.UuidUtils.decompressUuid(e);
                        o.uuidList.push(r)
                    }
                    let r = d(e);
                    return r || null
                }
            }), 0 === o.uuidList.length ? a() : i.each(o.uuidList, (e, r) => {
                this._queryDependAsset(e, n, r)
            }, a)
        })
    },
    queryDependAsset(e, r) {
        let t = [];
        this._queryDependAsset(e, t, () => {
            r(null, Object.keys(t))
        })
    },
    "query-depend-asset"(e, r) {
        this.queryDependAsset(r, (r, t) => {
            if (r) return Editor.error(r), void 0;
            e.reply && e.reply(null, t)
        })
    }
};
