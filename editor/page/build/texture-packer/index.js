const e=require("fire-path"),t=(require("async"),require("lodash"),require("fire-fs")),i=require("./utils"),r=e.join(Editor.remote.Project.path,"temp/TexturePacker/preview"),a=e.join(Editor.remote.Project.path,"temp/TexturePacker/build"),s="raw-assets";class u{async init(e){this.writer=e.writer,this.actualPlatform=e.actualPlatform;let t=await i.queryAtlases(e.files);this.spriteFrames=t.spriteFrames,this.pacInfos=t.pacInfos,this.textureUuids=t.textureUuids,this.texture2pac=t.texture2pac}needPack(e){return-1!==this.textureUuids.indexOf(e)}async pack(r){let u=[],l=Object.create(null),n=Object.create(null),o=e.join(a,s),c=this.pacInfos;for(let e of c)e.meta.uuid in r&&!e.meta.filterUnused||(e.spriteFrames=e.spriteFrames.filter(e=>e._uuid in r));let d={dest:o,pacInfos:c=c.filter(e=>e.meta.uuid in r||e.spriteFrames.length>0),buildAssets:r,needCompress:!0,actualPlatform:this.actualPlatform},p=await i.pack(d);return await Promise.all(p.map(async i=>{u=u.concat(i.unpackedTextures);let a=null;i.uuid in r&&((a=new cc.SpriteAtlas)._uuid=i.uuid);let o=i.pacInfo.meta;for(let r=0;r<i.atlases.length;++r){let u=i.atlases[r],c=require("../hash-uuid"),d=u.files.map(e=>e.uuid),p=c.calculate([d],c.BuiltinHashType.AutoAtlasTexture)[0];if(!u.compressd)throw"Cann't find atlas.compressed.";let h=u.compressd.suffix,m=e.join(this.writer.dest,"..",s,p.slice(0,2),p);n[p]=await Promise.all(h.map(async e=>new Promise((i,r)=>{e=e.split("@")[0];let a=u.compressd.imagePathNoExt+e,s=m+e;t.copy(a,s,e=>{if(e)return r(e);i(s)})})));let f=new cc.Texture2D;f._exportedExts=h,f._uuid=p,f.width=u.width,f.height=u.height,f.packable=o.packable,f.setPremultiplyAlpha(o.premultiplyAlpha);let w=cc.Texture2D.Filter;switch(o.filterMode){case"point":f.setFilters(w.NEAREST,w.NEAREST);break;case"bilinear":case"trilinear":f.setFilters(w.LINEAR,w.LINEAR)}await this.write(f);for(let e=0;e<u.files.length;++e){let t=u.files[e],i=this.generateSpriteFrame(t,p);l[i._uuid]=p,a&&(a._spriteFrames[t.name]=Editor.serialize.asAsset(i._uuid)),await this.write(i)}}a&&await this.write(a)})),{unpackedTextures:u,packedSpriteFrames:l,packedTextures:n}}generateSpriteFrame(e,t){let i=new cc.SpriteFrame,r=e.spriteFrame;i._name=e.name,i._uuid=r._uuid;let a=e.trim;return i._rect=cc.rect(a.x,a.y,a.width,a.height),i._offset=r.getOffset(),i._originalSize=cc.size(e.rawWidth,e.rawHeight),i._rotated=e.rotated,i.insetLeft=r.insetLeft,i.insetTop=r.insetTop,i.insetRight=r.insetRight,i.insetBottom=r.insetBottom,i._texture=Editor.serialize.asAsset(t),i}async write(e,t){let i=Editor.serialize(e,{exporting:!0,nicify:!0,stringify:!1,dontStripDefault:!1});await new Promise((t,r)=>{this.writer.writeJsonByUuid(e._uuid,i,e=>{if(e)return r(e);t()})})}}u.generatePreviewFiles=async function(e){let t=Editor.remote.assetdb.assetInfoByUuid(e),a=r,s=await i.queryAtlases(t);await i.pack({pacInfos:s.pacInfos,dest:a})},u.queryPreviewInfo=function(i,a){let s=Editor.url("db://assets"),u=Editor.remote.assetdb.assetInfoByUuid(i),l=e.relative(s,e.dirname(u.path)),n=e.join(r,l,e.basename(u.path)),o=e.join(n,"info.json");if(!t.existsSync(o))return a(null);let c=t.readJSONSync(o);if(!c.result)return a(null);a(null,{packedTextures:c.result.atlases.map(t=>{let i=0;t.files.forEach(e=>{i+=e.width*e.height});let r=i/(t.width*t.height)*100|0;return{path:t.imagePath,name:e.basename(t.imagePath),result:`${t.width}x${t.height}, ${r}% usage`}}),unpackedTextures:c.result.unpackedTextures.map(t=>{let i=t.originalPath||t.path,r=Editor.assetdb.remote.uuidToFspath(t.textureUuid);return{path:i,name:e.basename(r),result:t.width+"x"+t.height}})})},module.exports=u;