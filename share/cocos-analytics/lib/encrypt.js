"use strict";const e=require("crypto");let n="-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9LCzyypg24REurnyflGy2LdFj\nc63hBk/69r84TAJHlE7x92kUpZBF+7cRf0bFRIRA52OsKlF/ljzCjfOPBE9JfNIq\n+dwF/rSqns+eyQHPQFd5lY692loz9Mo1pNgElpHuJbfydju7F5KTnQYqviCWompm\nLKKdzAPcY1AVJfWd+QIDAQAB\n-----END PUBLIC KEY-----\n";function r(r){return e.publicEncrypt({key:n,padding:e.constants.RSA_PKCS1_PADDING},new Buffer(r))}var t={urlsafe_b64encode:e=>e.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""),encryptPostData(e){for(var n=new Buffer(0),t=0,l=(e=new Buffer(e)).length;l-t>0;){if(l-t>117){var c=r(e.slice(t,t+117));n=Buffer.concat([n,c],c.length+n.length)}else{c=r(e.slice(t,t+l-t));n=Buffer.concat([n,c],c.length+n.length)}t+=117}var f=n.toString("base64");return f=this.urlsafe_b64encode(f)}};module.exports=t;