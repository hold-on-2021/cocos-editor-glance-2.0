"use strict";
const i = require("util");
i.promisify || (i.promisify = function (i) {
    return function (...n) {
        return new Promise(function (r, t) {
            i(...n, (i, n) => {
                i ? t(i) : r(n)
            })
        })
    }
});