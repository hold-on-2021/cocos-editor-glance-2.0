"use strict";
const e = require("electron"),
    t = e.ipcMain,
    s = require("path"),
    r = (require("fire-fs"), Editor.Profile.load("global://settings.json"));
t.on("asset-db:explore", (t, s) => {
    var r = Editor.assetdb._fspath(s);
    e.shell.showItemInFolder(r)
}), t.on("asset-db:query-path-by-url", (e, t) => {
    e.reply && e.reply(null, Editor.assetdb._fspath(t))
}), t.on("asset-db:query-uuid-by-url", (e, t) => {
    e.reply && e.reply(null, Editor.assetdb.urlToUuid(t))
}), t.on("asset-db:query-path-by-uuid", (e, t) => {
    e.reply && e.reply(null, Editor.assetdb.uuidToFspath(t))
}), t.on("asset-db:query-url-by-uuid", (e, t) => {
    e.reply && e.reply(null, Editor.assetdb.uuidToUrl(t))
}), t.on("asset-db:query-info-by-uuid", (e, t) => {
    e.reply && e.reply(null, Editor.assetdb.assetInfoByUuid(t))
}), t.on("asset-db:query-meta-info-by-uuid", (e, t) => {
    if (!e.reply) return;
    let r = Editor.assetdb.uuidToFspath(t);
    if (r) {
        let d = r + ".meta",
            a = Editor.require("app://asset-db/lib/meta").get(Editor.assetdb, t),
            o = JSON.stringify(a.serialize(), null, 2),
            i = Editor.assetdb.isSubAssetByPath(r),
            n = Editor.assetdb._uuid2mtime[t];
        if (i) {
            let e = Editor.assetdb.fspathToUuid(s.dirname(r));
            n = Editor.assetdb._uuid2mtime[e]
        }
        return e.reply(null, {
            assetType: a.assetType(),
            defaultType: a.constructor.defaultType(),
            assetUrl: Editor.assetdb.uuidToUrl(t),
            assetPath: r,
            metaPath: d,
            metaMtime: n ? n.meta : 0,
            assetMtime: n ? n.asset : 0,
            isSubMeta: i,
            json: o
        }), void 0
    }
    e.reply()
}), t.on("asset-db:deep-query", e => {
    e.reply && Editor.assetdb.deepQuery((t, s) => {
        e.reply(null, s)
    })
}), t.on("asset-db:query-assets", (e, t, s) => {
    e.reply && Editor.assetdb.queryAssets(t, s, (t, s) => {
        e.reply(null, s)
    })
}), t.on("asset-db:query-mounts", e => {
    e.reply && e.reply(null, Editor.assetdb._mounts)
}), t.on("asset-db:import-assets", (e, t, s, r) => {
    r && Editor.Ipc.sendToPanel("assets", "assets:start-refresh"), Editor.assetdb.watchOFF(), Editor.assetdb.import(t, s, (t, s) => {
        e.reply && (t ? e.reply() : e.reply(null, s)), r && Editor.Ipc.sendToPanel("assets", "assets:end-refresh")
    }), Editor.App.focused || Editor.assetdb.watchON()
}), t.on("asset-db:create-asset", (e, t, s) => {
    Editor.assetdb.watchOFF(), Editor.assetdb.create(t, s, e.reply && function (t, s) {
        e.reply(t, s)
    }), Editor.App.focused || Editor.assetdb.watchON()
}), t.on("asset-db:move-asset", (e, t, s, r) => {
    Editor.assetdb.watchOFF(), Editor.assetdb.move(t, s, (d, a) => {
        d && (r ? Editor.Dialog.messageBox({
            type: "warning",
            buttons: [Editor.T("MESSAGE.ok")],
            title: Editor.T("MESSAGE.warning"),
            message: Editor.T("MESSAGE.assets.failed_to_move", {
                srcUrl: t,
                destUrl: s
            }),
            detail: `${d.message}`,
            noLink: !0
        }) : Editor.assetdb.error(Editor.T("MESSAGE.assets.failed_to_move", {
            srcUrl: t,
            destUrl: s
        }) + `messages: ${d.stack}`)), e.reply && e.reply(d, a)
    }), Editor.App.focused || Editor.assetdb.watchON()
}), t.on("asset-db:delete-assets", (e, t) => {
    Editor.assetdb.watchOFF(), Editor.assetdb.delete(t, e.reply && function (t, s) {
        e.reply(t, s)
    }), Editor.App.focused || Editor.assetdb.watchON()
}), t.on("asset-db:save-exists", (e, t, s) => {
    Editor.assetdb.watchOFF(), Editor.assetdb.saveExists(t, s, e.reply && function (t, s) {
        e.reply(t, s)
    }), Editor.App.focused || Editor.assetdb.watchON()
}), t.on("asset-db:create-or-save", (e, t, s) => {
    Editor.assetdb.watchOFF(), Editor.assetdb.exists(t) ? Editor.assetdb.saveExists(t, s, e.reply && function (t, s) {
        e.reply(t, s)
    }) : Editor.assetdb.create(t, s, e.reply && function (t, s) {
        e.reply(t, s)
    }), Editor.App.focused || Editor.assetdb.watchON()
}), t.on("asset-db:save-meta", (e, t, s) => {
    Editor.assetdb.watchOFF(), Editor.assetdb.saveMeta(t, s, e.reply && function () {
        e.reply()
    }), Editor.App.focused || Editor.assetdb.watchON()
}), t.on("asset-db:refresh", (e, t) => {
    Editor.assetdb.watchOFF(), Editor.assetdb.refresh(t, e.reply && function (t, s) {
        e.reply(t, s)
    }), Editor.focused || Editor.assetdb.watchON()
}), t.on("asset-db:attach-mountpath", (e, t) => {
    Editor.assetdb.watchOFF(), Editor.assetdb.attachMountPath(t, e.reply && function (t) {
        e.reply(t)
    }), Editor.focused || Editor.assetdb.watchON()
}), t.on("asset-db:unattach-mountpath", (e, t) => {
    Editor.assetdb.watchOFF(), Editor.assetdb.unattachMountPath(t, e.reply && function (t) {
        e.reply(t)
    }), Editor.focused || Editor.assetdb.watchON()
}), t.on("asset-db:query-watch-state", () => {
    Editor.Ipc.sendToMainWin("asset-db:watch-state-changed", Editor.assetdb.getWatchState())
}), t.on("asset-db:asset-changed", function (e, t) {
    if (Editor.ProjectCompiler.isScript(t.type)) {
        var s = Editor.assetdb.uuidToFspath(t.uuid);
        Editor.ProjectCompiler.compileScripts([s])
    }
}), t.on("asset-db:asset-uuid-changed", function (e, t) {
    Editor.ProjectCompiler.needCompile(t.type, t.uuid) && Editor.ProjectCompiler.rebuild()
}), t.on("asset-db:assets-moved", function (e, t) {
    var s = !1,
        r = [],
        d = [];
    t.forEach(function (e) {
        Editor.ProjectCompiler.needCompile(e.type, e.uuid) && (r.push(e.srcPath), d.push(e.destPath), s = !0), "scene" === e.type && e.uuid === Editor.currentSceneUuid && Editor.Ipc.sendToMain("scene:update-title")
    }), s && Editor.ProjectCompiler.moveScripts(r, d)
}), t.on("asset-db:assets-created", function (e, t) {
    var s = !1,
        r = [];
    t.forEach(function (e) {
        Editor.ProjectCompiler.needCompile(e.type, e.uuid) && (r.push(e.path), s = !0), "scene" === e.type && (Editor.sceneList.push(e.uuid), e.uuid === Editor.currentSceneUuid && Editor.Ipc.sendToMain("scene:update-title"))
    }), s && Editor.ProjectCompiler.compileScripts(r)
}), t.on("asset-db:assets-deleted", function (e, t) {
    var s = !1,
        r = [];
    t.forEach(function (e) {
        if (Editor.ProjectCompiler.needCompile(e.type, e.uuid) && (r.push({
                path: e.path,
                uuid: e.uuid
            }), s = !0), "scene" === e.type) {
            var t = Editor.sceneList.indexOf(e.uuid); - 1 !== t && Editor.sceneList.splice(t, 1), e.uuid === Editor.currentSceneUuid && (Editor.Ipc.sendToMain("scene:set-current-scene", null, () => {}), Editor.Ipc.sendToMain("scene:update-title"))
        }
    }), s && Editor.ProjectCompiler.removeScripts(r)
}), t.on("asset-db:script-import-failed", function (e, t) {
    t.error && Editor.ProjectCompiler.singleScriptCompileFailed(t)
}), t.on("asset-db:meta-backup", (t, d) => {
    if (!r.get("show-meta-backup-dialog")) return;
    let a = s.normalize(s.join(Editor.Project.path, Editor.metaBackupPath)),
        o = Editor.T("MESSAGE.assets.meta_backup_detail", {
            backupPath: a
        });
    d.forEach((e, t) => {
        o += "\n" + (t + 1) + ". " + e
    });
    let i = Editor.Dialog.messageBox({
        type: "warning",
        buttons: [Editor.T("MESSAGE.ok"), Editor.T("MESSAGE.assets.meta_backup_help"), Editor.T("MESSAGE.assets.meta_backup_never_show")],
        message: Editor.T("MESSAGE.assets.meta_backup_msg"),
        detail: o,
        noLink: !0,
        defaultId: 0
    });
    1 === i ? e.shell.openExternal(Editor.T("MESSAGE.assets.meta_backup_help_url")) : 2 === i && (r.set("show-meta-backup-dialog", !1), r.save())
});