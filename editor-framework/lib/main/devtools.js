"use strict";let e={focus(e){e.openDevTools(),e.nativeWin.devToolsWebContents&&e.nativeWin.devToolsWebContents.focus()},executeJavaScript(e,t){e.openDevTools(),e.nativeWin.devToolsWebContents&&e.nativeWin.devToolsWebContents.executeJavaScript(t)},enterInspectElementMode(t){e.executeJavaScript(t,"DevToolsAPI.enterInspectElementMode()")}};module.exports=e;