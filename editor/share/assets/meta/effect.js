"use strict";const e=require("./custom-asset"),r=require("fire-path"),s=require("fire-fs"),t=require("globby"),i=require("./utils/shdc-lib");function c(){let e=t.sync(Editor.url("unpack://engine/cocos2d/renderer/build/chunks/**/**.inc"));i.addChunksCache(e)}const l=!0;l||c();module.exports=class extends e{static version(){return"1.0.25"}static defaultType(){return"effect"}constructor(e){super(e),this.compiledShaders=[]}import(e,t){let a,u=r.basenameNoExt(e),n=s.readFileSync(e,"utf8");l&&c();try{a=i.buildEffect(u,n)}catch(e){Editor.error(e)}if(!a)return t();let d=new cc.EffectAsset;Object.assign(d,a),this.compiledShaders=a.shaders.map(e=>({glsl1:{vert:e.glsl1.vert,frag:e.glsl1.frag},glsl3:{vert:e.glsl3.vert,frag:e.glsl3.frag}})),this._assetdb.saveAssetToLibrary(this.uuid,d),t&&t()}};