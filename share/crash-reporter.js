require("electron").crashReporter.start({
    productName: "Electron",
    companyName: "Chukong Technologies",
    submitURL: "http://192.168.52.28:1127/post",
    autoSubmit: !0
});