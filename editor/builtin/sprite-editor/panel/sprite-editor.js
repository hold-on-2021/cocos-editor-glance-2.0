const t = require("fs"),
    e = require("fire-path"),
    s = Editor.require("app://editor/page/gizmos/2d/elements/tools"),
    i = require("svg.js");
Editor.Panel.extend({
    template: t.readFileSync(Editor.url("packages://sprite-editor/panel/sprite-editor.html"), "utf8"),
    style: t.readFileSync(Editor.url("packages://sprite-editor/panel/sprite-editor.css"), "utf8"),
    $: {
        root: "#root"
    },
    ready() {
        this._vm = function (t) {
            return new window.Vue({
                el: t,
                data: {
                    hasContent: !1,
                    scale: 50,
                    minScale: 20,
                    maxScale: 500,
                    dirty: !1,
                    leftPos: 0,
                    rightPos: 0,
                    topPos: 0,
                    bottomPos: 0
                },
                watch: {
                    scale: "_scaleChanged",
                    leftPos: "leftPosChanged",
                    rightPos: "rightPosChanged",
                    topPos: "topPosChanged",
                    bottomPos: "bottomPosChanged"
                },
                compiled() {
                    this._svg = i(this.$els.svg), this._svg.spof(), this._lastBcr = null, this._svgColor = "#5c5", this._dotSize = 6, this._borderLeft = 0, this._borderRight = 0, this._borderBottom = 0, this._borderTop = 0, this._startLeftPos = 0, this._startRightPos = 0, this._startTopPos = 0, this._startBottomPos = 0, this._meta = null, this._scalingSize = null, this.addListeners()
                },
                methods: {
                    run(t) {
                        this.openSprite(t.uuid)
                    },
                    _T: t => Editor.T(t),
                    addListeners() {
                        let t = this;
                        window.addEventListener("resize", function (e) {
                            (t._image || t._meta) && (t._refreshScaleSlider(), t.resize(t._meta.rawWidth * t.scale / 100, t._meta.rawHeight * t.scale / 100))
                        })
                    },
                    _refreshScaleSlider() {
                        var t, e, s, i = this.$els.content.getBoundingClientRect();
                        this._lastBcr && i.width === this._lastBcr.width && i.height === this._lastBcr.height || (t = (e = i.width / this._meta.rawWidth * 100) < (s = i.height / this._meta.rawHeight * 100) ? e : s, this.minScale = Math.ceil(t / 5), this.maxScale = Math.ceil(t), this.scale = Math.ceil((t + this.minScale) / 2), this._lastBcr = this.$els.content.getBoundingClientRect())
                    },
                    openSprite(t) {
                        if (!t) return;
                        let e = this;
                        this._loadMeta(t, function (s, i, o) {
                            if (s) return Editor.error("Failed to load meta %s, Message: %s", t, s.stack), void 0;
                            e.hasContent = !0, e._refreshScaleSlider(), Editor.assetdb.queryMetaInfoByUuid(o.rawTextureUuid, function (t, s) {
                                e._image = new Image, e._image.src = s.assetPath, e._image.onload = function () {
                                    e.resize(e._meta.rawWidth * e.scale / 100, e._meta.rawHeight * e.scale / 100)
                                }
                            })
                        })
                    },
                    _loadMeta(t, s) {
                        if (0 === t.indexOf("mount-")) return s && s(new Error("Not support mount type assets.")), void 0;
                        Editor.assetdb.queryMetaInfoByUuid(t, function (i, o) {
                            if (!o) return s && s(new Error("Can not find asset path by uuid " + t)), void 0;
                            var h = o.assetType;
                            if ("sprite-frame" !== h) return s && s(new Error("Only support sprite-frame type assets now.")), void 0;
                            var r = JSON.parse(o.json);
                            r.__name__ = e.basenameNoExt(o.assetPath), r.__path__ = o.assetPath, r.__mtime__ = o.assetMtime, this._meta = r, this._resetPos(), s && s(null, h, r)
                        }.bind(this))
                    },
                    _resetPos() {
                        let t = this._meta,
                            e = (t.rawWidth - t.width) / 2,
                            s = (t.rawHeight - t.height) / 2;
                        this.leftPos = Math.max(e + t.borderLeft + t.offsetX, 0), this.rightPos = Math.max(e + t.borderRight + t.offsetX, 0), this.topPos = Math.max(s + t.borderTop + t.offsetY, 0), this.bottomPos = Math.max(s + t.borderBottom + t.offsetY, 0)
                    },
                    _scaleChanged() {
                        this._image && this._meta && (this.scale < this.minScale ? this.scale = this.minScale : this.scale > this.maxScale && (this.scale = this.maxScale), this.resize(this._meta.rawWidth * this.scale / 100, this._meta.rawHeight * this.scale / 100))
                    },
                    _onInputChanged(t) {
                        var e = t.srcElement;
                        if (this._image && this._meta && void 0 !== e.value) {
                            var s = Number.parseInt(e.value),
                                i = 0;
                            switch (e.id) {
                                case "inputL":
                                    i = this._image.width - this.rightPos, this.leftPos = this.correctPosValue(s, 0, i);
                                    break;
                                case "inputR":
                                    i = this._image.width - this.leftPos, this.rightPos = this.correctPosValue(s, 0, i);
                                    break;
                                case "inputT":
                                    i = this._image.height - this.bottomPos, this.topPos = this.correctPosValue(s, 0, i);
                                    break;
                                case "inputB":
                                    i = this._image.height - this.topPos, this.bottomPos = this.correctPosValue(s, 0, i)
                            }
                            s > i && (e.value = i)
                        }
                    },
                    _onSliderValueChanged(t) {
                        this.scale = t.target.value
                    },
                    resize(t, e) {
                        var s = this.$els.content.getBoundingClientRect(),
                            i = Editor.Utils.fitSize(t, e, s.width, s.height);
                        this._scalingSize = {
                            width: Math.ceil(i[1]),
                            height: Math.ceil(i[0])
                        }, this.$els.canvas.width = Math.ceil(i[0]), this.$els.canvas.height = Math.ceil(i[1]), this.repaint()
                    },
                    getCanvasRect() {
                        var t = {};
                        return t.top = this.$els.canvas.offsetTop, t.left = this.$els.canvas.offsetLeft, t.bottom = this.$els.canvas.offsetTop + this.$els.canvas.height, t.right = this.$els.canvas.offsetLeft + this.$els.canvas.width, t.width = this.$els.canvas.width, t.height = this.$els.canvas.height, t
                    },
                    updateBorderPos(t) {
                        this._borderLeft = t.left + this.leftPos * (this.scale / 100), this._borderRight = t.right - this.rightPos * (this.scale / 100), this._borderTop = t.top + this.topPos * (this.scale / 100), this._borderBottom = t.bottom - this.bottomPos * (this.scale / 100)
                    },
                    repaint() {
                        var t = this.$els.canvas.getContext("2d");
                        t.imageSmoothingEnabled = !1;
                        var e, s, i, o, h = this._meta;
                        if (i = h.width, o = h.height, e = ((h.rawWidth - h.width) / 2 + h.offsetX) * (this.scale / 100), s = ((h.rawHeight - h.height) / 2 + h.offsetY) * (this.scale / 100), h.rotated) {
                            var r = this.$els.canvas.width / 2,
                                a = this.$els.canvas.height / 2;
                            t.translate(r, a), t.rotate(-90 * Math.PI / 180), t.translate(-r, -a), e = this.$els.canvas.width / 2 - (o / 2 - h.offsetY) * (this.scale / 100), s = this.$els.canvas.height / 2 - (i / 2 - h.offsetX) * (this.scale / 100);
                            let d = i;
                            i = o, o = d
                        }
                        t.drawImage(this._image, h.trimX, h.trimY, i, o, e, s, i * (this.scale / 100), o * (this.scale / 100)), this.drawEditElements()
                    },
                    svgElementMoved(t, e, s) {
                        var i = e / (this.scale / 100),
                            o = s / (this.scale / 100);
                        if (i = i > 0 ? Math.floor(i) : Math.ceil(i), o = o > 0 ? Math.floor(o) : Math.ceil(o), Math.abs(i) > 0) {
                            if (t.indexOf("l") >= 0) {
                                var h = this._startLeftPos + i;
                                this.leftPos = this.correctPosValue(h, 0, this._image.width - this.rightPos)
                            }
                            if (t.indexOf("r") >= 0) {
                                var r = this._startRightPos - i;
                                this.rightPos = this.correctPosValue(r, 0, this._image.width - this.leftPos)
                            }
                        }
                        if (Math.abs(o) > 0) {
                            if (t.indexOf("t") >= 0) {
                                var a = this._startTopPos + o;
                                this.topPos = this.correctPosValue(a, 0, this._image.height - this.bottomPos)
                            }
                            if (t.indexOf("b") >= 0) {
                                var d = this._startBottomPos - o;
                                this.bottomPos = this.correctPosValue(d, 0, this._image.height - this.topPos)
                            }
                        }
                    },
                    svgCallbacks(t) {
                        var e = {};
                        return e.start = function () {
                            this._startLeftPos = this.leftPos, this._startRightPos = this.rightPos, this._startTopPos = this.topPos, this._startBottomPos = this.bottomPos
                        }.bind(this), e.update = function (e, s) {
                            this.svgElementMoved(t, e, s)
                        }.bind(this), e
                    },
                    drawLine(t, e, i, o, h) {
                        var r = {
                                x: t,
                                y: e
                            },
                            a = {
                                x: i,
                                y: o
                            },
                            d = s.lineTool(this._svg, r, a, this._svgColor, "default", this.svgCallbacks(h));
                        return "l" === h || "r" === h ? d.style("cursor", "col-resize") : "t" !== h && "b" !== h || d.style("cursor", "row-resize"), d
                    },
                    drawDot(t, e, i) {
                        var o = {
                                color: this._svgColor
                            },
                            h = s.circleTool(this._svg, this._dotSize, o, o, this.svgCallbacks(i));
                        return "l" === i || "r" === i || "t" === i || "b" === i ? h.style("cursor", "pointer") : "lb" === i || "rt" === i ? h.style("cursor", "nesw-resize") : "rb" !== i && "lt" !== i || h.style("cursor", "nwse-resize"), this.moveDotTo(h, t, e), h
                    },
                    moveDotTo(t, e, s) {
                        t && t.move(e, s)
                    },
                    drawEditElements() {
                        if (this._image) {
                            this._svg.clear();
                            var t = this.getCanvasRect();
                            this.updateBorderPos(t), this.lineLeft = this.drawLine(this._borderLeft, t.bottom, this._borderLeft, t.top, "l"), this.lineRight = this.drawLine(this._borderRight, t.bottom, this._borderRight, t.top, "r"), this.lineTop = this.drawLine(t.left, this._borderTop, t.right, this._borderTop, "t"), this.lineBottom = this.drawLine(t.left, this._borderBottom, t.right, this._borderBottom, "b"), this.dotLB = this.drawDot(this._borderLeft, this._borderBottom, "lb"), this.dotLT = this.drawDot(this._borderLeft, this._borderTop, "lt"), this.dotRB = this.drawDot(this._borderRight, this._borderBottom, "rb"), this.dotRT = this.drawDot(this._borderRight, this._borderTop, "rt"), this.dotL = this.drawDot(this._borderLeft, t.bottom - t.height / 2, "l"), this.dotR = this.drawDot(this._borderRight, t.bottom - t.height / 2, "r"), this.dotB = this.drawDot(t.left + t.width / 2, this._borderBottom, "b"), this.dotT = this.drawDot(t.left + t.width / 2, this._borderTop, "t")
                        }
                    },
                    correctPosValue: (t, e, s) => t < e ? e : t > s ? s : t,
                    checkState() {
                        let t = Math.ceil((this._meta.rawWidth - this._meta.width) / 2),
                            e = Math.ceil((this._meta.rawHeight - this._meta.height) / 2);
                        var s = this.leftPos - t - this._meta.offsetX !== this._meta.borderLeft,
                            i = this.rightPos - t - this._meta.offsetX !== this._meta.borderRight,
                            o = this.topPos - e - this._meta.offsetY !== this._meta.borderTop,
                            h = this.bottomPos - e - this._meta.offsetY !== this._meta.borderBottom;
                        this.dirty = s || i || o || h
                    },
                    leftPosChanged() {
                        if (this._image) {
                            var t = this.getCanvasRect();
                            this.updateBorderPos(t), this.moveDotTo(this.dotL, this._borderLeft, t.bottom - t.height / 2), this.moveDotTo(this.dotLB, this._borderLeft, this._borderBottom), this.moveDotTo(this.dotLT, this._borderLeft, this._borderTop), this.lineLeft && this.lineLeft.plot(this._borderLeft, t.bottom, this._borderLeft, t.top), this.checkState()
                        }
                    },
                    rightPosChanged() {
                        if (this._image) {
                            var t = this.getCanvasRect();
                            this.updateBorderPos(t), this.moveDotTo(this.dotR, this._borderRight, t.bottom - t.height / 2), this.moveDotTo(this.dotRB, this._borderRight, this._borderBottom), this.moveDotTo(this.dotRT, this._borderRight, this._borderTop), this.lineRight && this.lineRight.plot(this._borderRight, t.bottom, this._borderRight, t.top), this.checkState()
                        }
                    },
                    topPosChanged() {
                        if (this._image) {
                            var t = this.getCanvasRect();
                            this.updateBorderPos(t), this.moveDotTo(this.dotT, t.left + t.width / 2, this._borderTop), this.moveDotTo(this.dotLT, this._borderLeft, this._borderTop), this.moveDotTo(this.dotRT, this._borderRight, this._borderTop), this.lineTop && this.lineTop.plot(t.left, this._borderTop, t.right, this._borderTop), this.checkState()
                        }
                    },
                    bottomPosChanged() {
                        if (this._image) {
                            var t = this.getCanvasRect();
                            this.updateBorderPos(t), this.moveDotTo(this.dotB, t.left + t.width / 2, this._borderBottom), this.moveDotTo(this.dotLB, this._borderLeft, this._borderBottom), this.moveDotTo(this.dotRB, this._borderRight, this._borderBottom), this.lineBottom && this.lineBottom.plot(t.left, this._borderBottom, t.right, this._borderBottom), this.checkState()
                        }
                    },
                    onMouseWheel(t) {
                        if (this._image) {
                            t.stopPropagation();
                            var e = Editor.Utils.smoothScale(this.scale / 100, t.wheelDelta);
                            this.scale = 100 * e
                        }
                    },
                    _onRevert(t) {
                        this._image && this._meta && (t && t.stopPropagation(), this._resetPos(), this.checkState())
                    },
                    _onApply(t) {
                        if (!this._image || !this._meta) return;
                        t && t.stopPropagation();
                        var e = this._meta.borderTop,
                            s = this._meta.borderBottom,
                            i = this._meta.borderLeft,
                            o = this._meta.borderRight,
                            h = this._meta;
                        let r = Math.ceil((h.rawWidth - h.width) / 2),
                            a = Math.ceil((h.rawHeight - h.height) / 2);
                        h.borderTop = Math.max(this.topPos - a - h.offsetY, 0), h.borderBottom = Math.max(this.bottomPos - a - h.offsetY, 0), h.borderLeft = Math.max(this.leftPos - r - h.offsetX, 0), h.borderRight = Math.max(this.rightPos - r - h.offsetX, 0);
                        var d = JSON.stringify(h),
                            l = h.uuid;
                        Editor.assetdb.saveMeta(l, d, t => {
                            t && (this._meta.borderTop = e, this._meta.borderBottom = s, this._meta.borderLeft = i, this._meta.borderRight = o, this._resetPos(), this.checkState())
                        }), this.checkState()
                    }
                }
            })
        }(this.$root)
    },
    run(t) {
        this._vm.run(t)
    }
});
