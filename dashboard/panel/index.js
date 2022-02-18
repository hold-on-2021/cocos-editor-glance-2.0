"use strict";
const e = require("electron"),
    t = (require("path"), require("fs"), require("./utils")),
    s = (e.ipcRenderer, Editor.Profile.load("global://dashborad.json"));
Editor.require("app://share/protocol/protocol-core"), Pace.ignore(() => {}), Pace.once("hide", () => {
    Editor.UI.removeLoadingMask(), Editor.Ipc.sendToAll("editor:ready")
}), Editor.UI.addLoadingMask({
    background: "#333"
}), window.vm = new Vue({
    el: document.getElementById("dashboard"),
    data: {
        tab: "project",
        projects: [],
        templates: [],
        filter: "",
        error: "",
        loading: !1,
        isloggedin: null,
        skip: !Editor.remote.requireLogin,
        tutorial: !1,
        hasreadnews: [],
        shouldreadnews: [],
        news_msg_time: 0,
        news_msg_url: "http://creator-api.cocos.com/api/dashboard/msgs",
        news_category_url: "https://www.cocos.com/{{language}}/{{category}}"
    },
    components: {
        "window-header": require("./components/window-header"),
        tabs: require("./components/tabs"),
        "tab-project": require("./components/tab-project"),
        "tab-create": require("./components/tab-create"),
        "tab-help": require("./components/tab-help"),
        "tab-news": require("./components/tab-news"),
        "window-footer": require("./components/window-footer")
    },
    methods: {
        updateProjects() {
            Editor.Ipc.sendToMain("app:query-recent", (e, t) => {
                e && Editor.error(e.message), this.projects = t
            })
        },
        updateTemplates() {
            this.templates = [{
                name: Editor.T("DASHBOARD.template_empty"),
                desc: Editor.T("DASHBOARD.template_empty_desc"),
                banner: "./static/img/empty-project.png",
                templateName: "blank"
            }], Editor.Ipc.sendToMain("app:query-templates", (e, t) => {
                if (e) return console.log(e), void 0;
                t.forEach(e => {
                    this.templates.push(e)
                })
            })
        },
        async updateNewsMsg() {
            let e, s = this.news_msg_time = Date.now();
            try {
                e = (await t.sendGetRequest(this.news_msg_url, {
                    lang: Editor.lang,
                    ver: Editor.remote.versions.CocosCreator.replace(/-.+$/, "")
                })).data
            } catch (t) {
                e = []
            }
            if (s === this.news_msg_time) {
                this.shouldreadnews = e;
                for (let s of e)
                    if (2 === s.msg_type && -1 === this.hasreadnews.indexOf(s.pid)) {
                        t.event.emit("change-tab", "news");
                        break
                    }
            }
        },
        _onLogin() {
            this.isloggedin = !0
        }
    },
    async ready() {
        t.event.on("change-tab", s => {
            if ("open" === s) {
                let s = e.remote.dialog.showOpenDialog({
                    title: Editor.T("DASHBOARD.choose_project"),
                    properties: ["openDirectory"]
                });
                return s ? (Editor.Ipc.sendToMain("app:open-project", s[0], !!this.isloggedin, (e, s) => {
                    e && t.event.emit("change-error-message", e.message), s && !s.abort && t.event.emit("update-projects")
                }), void 0) : (this.tab = "project", void 0)
            }
            this.tab = s
        }), t.event.on("change-error-message", e => {
            this.error = e
        }), t.event.on("update-projects", () => {
            this.updateProjects()
        }), t.event.on("update-templates", () => {
            this.updateTemplates()
        }), t.event.on("change-filter", e => {
            this.filter = e
        }), this.updateProjects(), this.updateTemplates(), this.isloggedin = null, Editor.User.on("waiting", () => {
            this.loading = !0
        }), Editor.User.on("login", () => {
            const e = document.querySelector("login-frame");
            e && (e.hidden = !0), this.loading = !1
        }), Editor.User.on("logout", () => {
            this.isloggedin = !1, this.loading = !1
        }), Editor.User.on("exception", e => {
            this.loading = !1, e && "object" == typeof e && "login" === e.source && (this.loading = !1, Editor.warn(e.msg), 301 !== e.code && 302 !== e.code && 420 !== e.code && 421 !== e.code && (this.skip = !0))
        }), this.loading = !0, this.isloggedin = await Editor.User.isLoggedIn(), this.loading = !1, t.event.on("record-news-id", e => {
            if (!s) return;
            Array.isArray(s.get("news")) || s.set("news", []);
            const t = this.hasreadnews.indexOf(e); - 1 !== t && this.hasreadnews.splice(t, 1), this.hasreadnews.length >= 500 && this.hasreadnews.shift(), this.hasreadnews.push(e), s.set("news", JSON.parse(JSON.stringify(this.hasreadnews))), s.save()
        });
        let o = s.get("news_msg_url");
        o || (o = "http://creator-api.cocos.com/api/dashboard/msgs", s.set("news_msg_url", o)), this.news_msg_url = o;
        let r = s.get("news_category_url");
        r || (r = "https://www.cocos.com/{{language}}/{{category}}", s.set("news_category_url", r)), this.news_category_url = r, this.tutorial = s.get("lastRemindVersion") !== Editor.remote.versions.CocosCreator, this.hasreadnews = s.get("news") || [], s.save(), this.updateNewsMsg()
    }
});