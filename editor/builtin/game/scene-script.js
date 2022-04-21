let e, a;
module.exports = {
    initPreviewCamera(r) {
        if (e) return r.reply && r.reply();

        function n() {
            const n = Editor.require("packages://game-window/preview-camera");
            let i = new cc.Node("preview-camera-node"),
                t = i.addComponent(n);
            t.cameras = cc.Camera.cameras, i.parent = _Scene.view.foregroundNode, e = t, a = !1, r.reply && r.reply()
        }
        a || (a = !0, a = !0, cc.engine.isInitialized ? n() : cc.engine.on("scene-view-ready", n))
    },
    setCanvas(a) {
        e && (e.canvas = a)
    },
    enabled(a, r) {
        e && (e.node.active = r)
    },
    getBase64Data(a) {
        if (!e) return this.initPreviewCamera({}), a.reply(null);
        a.reply && a.reply(null, e.getBase64Data())
    },
    getBinaryData(a) {
        if (!e) return this.initPreviewCamera({}), a.reply(null);
        if (!a.reply) return;
        let r = e.getBinaryData(),
            n = !!r;
        a.reply(null, n, r)
    }
};
