"use strict";
const t = require("events");
let e, s, i = {},
    r = 1e3;
class u extends t {
    constructor() {
        super(), this._currentAudioSource = null, this._buffer = null, this._played = 0, this._started = !1, this._state = "stopped", this.loop = !1, this.playbackRate = 1, this.volume = 1
    }
    state() {
        return this._state
    }
    play(t) {
        t = t || 0, this._started && this._reset(this._buffer), this._timestamp = e.currentTime, this._played = t, this._started = !0, this._currentAudioSource.start(0, t), this._state = "playing", this.emit("started")
    }
    stop() {
        if ("paused" === this._state) return this._state = "stopped", this._played = 0, this.emit("ended"), void 0;
        if (!this._currentAudioSource) return;
        if (!this._started) return;
        let t = this._currentAudioSource;
        t.stop(0), t.onended = null, this._currentAudioSource = null, this._state = "stopped", this._played = 0, this.emit("ended")
    }
    pause() {
        if (!this._currentAudioSource) return;
        if (!this._started) return;
        this._played = this.time();
        let t = this._currentAudioSource;
        t.stop(0), t.onended = null, this._currentAudioSource = null, this._state = "paused", this.emit("paused")
    }
    resume() {
        this.play(this._played)
    }
    length() {
        return this._buffer.length
    }
    buffer() {
        return this._buffer
    }
    time() {
        return "paused" === this._state ? this._played : "playing" === this._state ? (e.currentTime - this._timestamp) * this.playbackRate + this._played : 0
    }
    mute(t) {
        s.gain.value = t ? -1 : this.volume
    }
    setVolume(t) {
        this.volume = t, s.gain.value = t
    }
    setLoop(t) {
        this.loop = t, this._currentAudioSource && (this._currentAudioSource.loop = t)
    }
    setPlaybackRate(t) {
        this.playbackRate = t, this._currentAudioSource && (this._currentAudioSource.playbackRate.value = t, "paused" !== this._state && (this.pause(), this.play()))
    }
    _reset(t) {
        this.stop();
        let i = e.createBufferSource();
        i.buffer = t, i.loop = this.loop, i.playbackRate.value = this.playbackRate, i.connect(s), i.onended = (() => {
            this.stop()
        }), this._currentAudioSource = i, this._buffer = t, this._started = !1, this._startAt = 0, this._state = "stopped"
    }
}
let a = {
    context: () => (e || (e = new window.AudioContext, (s = e.createGain()).gain.value = 1, s.connect(e.destination)), e),
    load(t, e) {
        let s = new window.XMLHttpRequest;
        return s.open("GET", t, !0), s.responseType = "arraybuffer", s.onreadystatechange = (r => {
            if (4 === s.readyState) {
                if (-1 === [0, 200, 304].indexOf(s.status)) throw delete i[s._session], new Error(`While loading from url ${t} server responded with a status of ${s.status}`);
                i[s._session] && (delete i[s._session], function (t, s) {
                    t.decodeAudioData(s, t => {
                        let s = new u;
                        s._reset(t), e && e(null, s)
                    }, t => {
                        e && e(t.err)
                    })
                }(this.context(), r.target.response))
            }
        }), s._session = r, i[r] = s, ++r, s.send(), s._session
    },
    cancel(t) {
        let e = i[t];
        e && (delete i[t], e.onreadystatechange = null, e.abort())
    }
};
module.exports = a;