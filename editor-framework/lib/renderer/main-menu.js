"use strict";
let n = {};
module.exports = n;
const e = require("./ipc"),
    i = require("./menu");
n.init = function () {
    e.sendToMain("main-menu:init")
}, n.apply = function () {
    e.sendToMain("main-menu:apply")
}, n.update = function (n, a) {
    i.checkTemplate(a) && e.sendToMain("main-menu:update", n, a)
}, n.add = function (n, a) {
    i.checkTemplate(a) && e.sendToMain("main-menu:add", n, a)
}, n.remove = function (n) {
    e.sendToMain("main-menu:remove", n)
}, n.set = function (n, i) {
    e.sendToMain("main-menu:set", n, i)
};