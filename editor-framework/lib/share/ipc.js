"use strict";
let e = {},
    {
        wrapError: r
    } = require("./utils");
e._checkReplyArgs = function (e) {
    if (0 === e.length) return !0;
    let t = e[0];
    return null === t || void 0 === t || (t instanceof Error ? (t = r(t), e[0] = t, !0) : !!("__error__" in t))
}, e._popOptions = function (e) {
    let r = e[e.length - 1];
    return r && "object" == typeof r && r.__ipc__ ? (e.pop(), r) : null
}, e._popReplyAndTimeout = function (e, r) {
    let t, n, o = e[e.length - 1];
    if ("number" == typeof o) {
        if (e.length < 2) return null;
        if (n = o, "function" != typeof (o = e[e.length - 2])) return null;
        t = o, e.splice(-2, 2)
    } else {
        if ("function" != typeof o) return null;
        t = o, n = r ? 1e4 : 18e4, e.pop()
    }
    return {
        reply: t,
        timeout: n
    }
}, e.option = function (e) {
    return e.__ipc__ = !0, e
};
e._wrapError = function (r) {
    if (e._checkReplyArgs(r)) return !0;
    let t = new Error("Invalid argument for event.reply(), first argument must be null or Error");
    return r.unshift({
        __error__: !0,
        stack: t.stack,
        message: t.message,
        code: "EINVALIDARGS"
    }), !1
}, e._unwrapError = function (e) {
    let r = e[0];
    return r && r.__error__ ? r : null
};
e.ErrorTimeout = class extends Error {
    constructor(e, r, t) {
        super(`ipc timeout. message: ${e}, session: ${r}`), this.code = "ETIMEOUT", this.ipc = e, this.sessionId = r, this.timeout = t
    }
}, e.ErrorNoPanel = class extends Error {
    constructor(e, r) {
        super(`ipc failed to send, panel not found. panel: ${e}, message: ${r}`), this.code = "ENOPANEL", this.ipc = r, this.panelID = e
    }
}, e.ErrorNoMsg = class extends Error {
    constructor(e, r) {
        super(`ipc failed to send, message not found. panel: ${e}, message: ${r}`), this.code = "ENOMSG", this.ipc = r, this.panelID = e
    }
}, e.ErrorInterrupt = class extends Error {
    constructor(e) {
        super(`Ipc will not have a callback. message: ${e}`), this.code = "EINTERRUPT", this.ipc = e
    }
}, module.exports = e;