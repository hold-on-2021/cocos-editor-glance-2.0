"use strict";
"browser" === process.type ? module.exports = require("./browser") : module.exports = require("./renderer");