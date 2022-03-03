"use strict";
const e = require("../../utils");
exports.template = '\n\n<div>\n    <div class="wrapper content" @dblclick="_onDbFoldClick">\n        <i id="foldIcon" v-el:foldIcon v-bind:class="_foldIconClass()" @dblclick="_onStopDefault" @click="_onFoldClick"></i>\n        <ui-checkbox class="item-checkbox" :value="assettree ? assettree.selected : true" v-on:confirm="_onDirectorySelectClick"></ui-checkbox>\n        <img class="icon" src="unpack://static/icon/assets/folder.png">\n        <span class="foldName"> {{assettree ? assettree.name : \'\'}} </span>\n    </div>\n\n    <div class="item-content" v-show="_folded()" v-for="item in assettree ? assettree.children : []">\n        <div>\n            <div v-if="!_isDirectory(item)" class="item layout horizontal content" @dblclick="_onDbFoldItemClick(item)">\n                <ui-checkbox class="item-checkbox" :value="item.selected" v-on:change="_onFileSelected(item)"></ui-checkbox>\n                <img class="item-img" :src=\'item.icon\'>\n                <p class="item-name">{{item.name}}</p>\n            </div>\n            <package-export-asset-item v-if="_isDirectory(item)" v-bind:assettree="item"></package-export-asset-item>\n        </div>\n    </div>\n</div>\n\n', exports.props = ["assettree"], exports.created = function () {
    this._clickCheckbox = !1, this.assettree.selected = e.getSelectedStates(this.assettree.url), this.assettree.children && this.assettree.children.forEach(t => {
        t.selected = e.getSelectedStates(t.url)
    })
}, exports.methods = {
    _onFileSelected(t) {
        this.assettree.children && this.assettree.children.forEach(s => {
            s === t && (s.selected = !s.selected, e.setSelectedStates(s.url, s.selected), s.selected && (this.assettree.selected = !0, e.setSelectedStates(this.assettree.url, this.assettree.selected)))
        })
    },
    _onDirectorySelectClick: function (t) {
        t.stopPropagation(), this._clickCheckbox = !0, this.assettree.selected = t.detail.value, e.setSelectedStates(this.assettree.url, t.detail.value),
            function t(s, i) {
                s && s.forEach(s => {
                    s.selected = i, t(s.children, i), e.setSelectedStates(s.url, i)
                })
            }(this.assettree.children, t.detail.value)
    },
    _folded() {
        return !this.assettree || this.assettree.folded
    },
    _isDirectory: e => "directory" === e.type,
    _foldIconClass() {
        return this.assettree && this.assettree.folded ? "fa fa-caret-down" : "fa fa-caret-right"
    },
    _onDbFoldItemClick(e) {
        Editor.Ipc.sendToAll("assets:hint", e.info.uuid)
    },
    _clickFold(e) {
        this._onStopDefault(e), this.assettree.folded = !this.assettree.folded, this.$root._changedAssetTreeFoldedState()
    },
    _onFoldClick(e) {
        this._clickCheckbox = !1, this._clickFold(e)
    },
    _onStopDefault(e) {
        e.stopPropagation(), e.preventDefault()
    },
    _onDbFoldClick(e) {
        this._clickCheckbox || this._clickFold(e)
    }
};