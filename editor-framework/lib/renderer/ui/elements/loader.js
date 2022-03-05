"use strict";
const e = require("chroma-js"),
    t = require("./utils"),
    s = require("../utils/resource-mgr");
module.exports = t.registerElement("ui-loader", {
    get inline() {
        return null !== this.getAttribute("inline")
    },
    set inline(e) {
        e ? this.setAttribute("inline", "") : this.removeAttribute("inline")
    },
    get maskColor() {
        return this._maskColor
    },
    set maskColor(t) {
        let s = e(t).rgba();
        s !== this._maskColor && (this._maskColor = s, this.style.backgroundColor = e(s).css())
    },
    template: '\n    <div class="animate"></div>\n    <div class="label">\n      <content></content>\n    </div>\n  ',
    style: s.getResource("theme://elements/loader.css"),
    factoryImpl(e) {
        e && (this.innerText = e)
    },
    ready() {
        let t = this.getAttribute("color");
        this._maskColor = null !== t ? e(t).rgba() : [0, 0, 0, .3], this.style.backgroundColor = e(this.maskColor).css()
    }
});