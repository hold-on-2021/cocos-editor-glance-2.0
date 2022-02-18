"use strict";
let e = {};
module.exports = e;
const r = require("electron"),
    n = require("../share/ipc"),
    t = require("./console"),
    i = require("./panel"),
    o = r.ipcRenderer,
    s = r.remote.getCurrentWindow().id;
let l = 1e3,
    a = {},
    d = !1,
    p = n._checkReplyArgs,
    u = n._popOptions,
    c = n._popReplyAndTimeout,
    f = n._wrapError,
    m = n._unwrapError,
    y = n.ErrorTimeout,
    g = n.ErrorInterrupt;

function T(e, r, n, t) {
    let i, o = `${r}:${l++}`;
    return -1 !== t && (i = setTimeout(() => {
        let r = a[o];
        r && (delete a[o], r.callback(new y(e, o, t)))
    }, t)), a[o] = {
        sessionId: o,
        timeoutId: i,
        callback: n
    }, o
}

function b(e) {
    let r = a[e];
    return r && (delete a[r.sessionId], r.timeoutId && clearTimeout(r.timeoutId)), r
}
e.option = n.option, e.sendToAll = function (e, ...r) {
    if ("string" != typeof e) return t.error("Call to `sendToAll` failed. The message must be a string."), void 0;
    o.send.apply(o, ["editor:ipc-renderer2all", e, ...r])
}, e.sendToWins = function (e, ...r) {
    if ("string" != typeof e) return t.error("Call to `sendToWins` failed. The message must be a string."), void 0;
    o.send.apply(o, ["editor:ipc-renderer2wins", e, ...r])
}, e.sendToMainSync = function (e, ...r) {
    return "string" != typeof e ? (t.error("Call to `sendToMainSync` failed. The message must be a string."), void 0) : o.sendSync.apply(o, [e, ...r])
}, e.sendToMain = function (r, ...n) {
    if ("string" != typeof r) return t.error("Call to `sendToMain` failed. The message must be a string."), void 0;
    let i, l = c(n, d);
    return l ? (i = T(r, `${s}@renderer`, l.reply, l.timeout), n = ["editor:ipc-renderer2main", r, ...n, e.option({
        sessionId: i,
        waitForReply: !0,
        timeout: l.timeout
    })]) : n = ["editor:ipc-reset-event-reply", r, ...n], o.send.apply(o, n), i
}, e.sendToPackage = function (r, n, ...t) {
    return e.sendToMain.apply(null, [`${r}:${n}`, ...t])
}, e.sendToPanel = function (r, n, ...i) {
    if ("string" != typeof n) return t.error("Call to `sendToPanel` failed. The sent message must be a string."), void 0;
    let s, l = c(i, d);
    return l ? (s = T(n, `${r}@renderer`, l.reply, l.timeout), i = ["editor:ipc-renderer2panel", r, n, ...i, e.option({
        sessionId: s,
        waitForReply: !0,
        timeout: l.timeout
    })]) : i = ["editor:ipc-renderer2panel", r, n, ...i], o.send.apply(o, i), s
}, e.sendToMainWin = function (e, ...r) {
    if ("string" != typeof e) return t.error("Call to `sendToMainWin` failed. The message must be a string."), void 0;
    o.send.apply(o, ["editor:ipc-renderer2mainwin", e, ...r])
}, e.cancelRequest = function (e) {
    b(e)
}, Object.defineProperty(e, "debug", {
    enumerable: !0,
    get: () => d,
    set(e) {
        d = e
    }
}), e._closeAllSessions = function () {
    let e = Object.keys(a);
    for (let r = 0; r < e.length; ++r) {
        let n = e[r],
            t = b(n);
        t.callback && t.callback(new g(n))
    }
}, o.on("editor:ipc-main2panel", (r, n, o, ...s) => {
    let l = u(s);
    if (l && l.waitForReply) {
        let n = r.sender,
            i = o;
        r.reply = function (...r) {
            d && !p(r) && t.warn(`Invalid argument for event.reply of "${i}": the first argument must be an instance of Error or null`);
            let o = e.option({
                sessionId: l.sessionId
            });
            return r = ["editor:ipc-reply", ...r, o], n.send.apply(n, r)
        }
    }
    s = [n, o, r, ...s], i._dispatch.apply(i, s)
}), o.on("editor:ipc-main2renderer", (r, n, ...i) => {
    !1 === function (r, n, ...i) {
        if (0 === i.length) return o.emit(n, r);
        let s = u(i);
        if (s && s.waitForReply) {
            let i = r.sender,
                o = n;
            r.reply = function (...r) {
                !1 === f(r) && t.warn(`Invalid argument for event.reply of "${o}": the first argument must be an instance of Error or null`);
                let n = e.option({
                    sessionId: s.sessionId
                });
                return r = ["editor:ipc-reply", ...r, n], i.send.apply(i, r)
            }
        }
        return i = [n, r, ...i], o.emit.apply(o, i)
    }.apply(null, [r, n, ...i]) && t.failed(`Message "${n}" from main to renderer failed, no response was received.`)
}), o.on("editor:ipc-reply", (e, ...r) => {
    let n = u(r),
        t = m(r);
    if (t) {
        let e = t.stack.split("\n");
        e.shift();
        let n = new Error(t.message);
        n.stack += "\n\t--------------------\n" + e.join("\n"), n.code = t.code, n.code = t.code, n.errno = t.errno, n.syscall = t.syscall, r[0] = n
    }
    let i = b(n.sessionId);
    i && i.callback.apply(null, r)
});