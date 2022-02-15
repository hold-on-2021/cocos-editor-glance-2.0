"use strict";const t=Editor.metas["custom-asset"],e=require("fire-path"),i=require("./fnt-parser");module.exports=class extends t{constructor(t){super(t),this.itemWidth=0,this.itemHeight=0,this.startChar="",this.rawTextureUuid="",this.fontSize=0}static version(){return"1.1.0"}static defaultType(){return"label-atlas"}_createFntConfigString(t,e,i,a,r,s){var h=t.rawWidth,n=t.rawHeight,o=a.charCodeAt(0),d=`info face="Arial" size=${s} bold=0 italic=0 charset="" unicode=0 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spaceing=0,0\n`;d+=`common lineHeight=${i} base=${s} scaleW=${h} scaleH=${n} pages=1 packed=0\n`,d+=`page id=0 file="${r}"\n`,d+="chars count=0\n";for(var m=0,u=i;u<=n;u+=i)for(var g=0;g<h&&g+e<=h;g+=e){var c=o+m;d+=`char id=${c}     x=${g}   y=${u-i}   width=${e}     height=${i}     xoffset=0     yoffset=0    xadvance=${e}    page=0 chnl=0 letter="${String.fromCharCode(c)}"\n`,++m}return d}postImport(t,a){var r=this._assetdb,s=new cc.LabelAtlas;s.name=e.basenameNoExt(t);var h=.88*this.itemHeight,n=r.loadMetaByUuid(this.rawTextureUuid);if(n){let a=r.uuidToFspath(n.uuid);var o=n.getSubMetas(),d=e.basenameNoExt(a),m=o[d];if(s.spriteFrame=Editor.serialize.asAsset(m.uuid),this.itemWidth>0&&this.itemHeight>0&&this.itemWidth<=m.rawWidth&&this.itemHeight<=m.rawHeight){var u=this._createFntConfigString(m,this.itemWidth,this.itemHeight,this.startChar,d,h);s._fntConfig=i.parseFnt(u)}else{var g=`LabelAtlas '${t}' fnt data invalid, `;this.itemWidth<=0||this.itemWidth>m.rawWidth?g+=`the item width must range from 1 - ${m.rawWidth}.`:(this.itemHeight<=0||this.itemHeight>m.rawHeight)&&(g+=`the item height must range from 1 - ${m.rawHeight}.`),Editor.warn(g)}}else Editor.warn(`The raw texture file of LabelAtlas '${t}' is missing.`);return s.fontSize=h,this.fontSize=h,r.saveAssetToLibrary(this.uuid,s),a()}};