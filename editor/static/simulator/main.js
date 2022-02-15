(function () {

    function boot () {
        window.__quick_compile_project__.destPath = {tempScriptsPath};

        if ( !_CCSettings.debug ) {
            // retrieve minified raw assets
            var rawAssets = _CCSettings.rawAssets;
            var assetTypes = _CCSettings.assetTypes;
            for (var mount in rawAssets) {
                var entries = rawAssets[mount];
                for (var uuid in entries) {
                    var entry = entries[uuid];
                    var type = entry[1];
                    if (typeof type === 'number') {
                        entry[1] = assetTypes[type];
                    }
                }
            }
        }

        // init engine
        var canvas, div;
        var AssetOptions = {
            libraryPath: {libraryPath},
            rawAssetsBase: {rawAssetsBase},
            rawAssets: _CCSettings.rawAssets
        };

        cc.AssetLibrary.init(AssetOptions);

        var onStart = function () {
            cc.view.resizeWithBrowserSize(true);

            // init assets

            // load stashed scene, unlike the standard loading process, here we do some hack to reduce the engine size.
            cc.loader.load('preview-scene.json', function (error, json) {
                if (error) {
                    cc.error(error);
                    return;
                }
                cc.AssetLibrary.loadJson(json,
                    function (err, sceneAsset) {
                        if (err) {
                            cc.error(err);
                            return;
                        }
                        var scene = sceneAsset.scene;
                        scene._name = sceneAsset._name;
                        // scene._id = ??;   stashed scene dont have uuid...
                        cc.director.runSceneImmediate(scene, function () {
                            // play game
                            cc.game.resume();
                        });
                    }
                );
            });

            // purge
            //noinspection JSUndeclaredVariable
            _CCSettings = undefined;
        };

        var jsList = _CCSettings.jsList || [];
        jsList = jsList.map(function (x) { return AssetOptions.rawAssetsBase + x; });

        var option = {
            scenes: _CCSettings.scenes,
            debugMode: cc.debug.DebugMode.INFO,
            showFPS: true,
            frameRate: 60,
            groupList: _CCSettings.groupList,
            collisionMatrix: _CCSettings.collisionMatrix,
            jsList: jsList
        };

        cc.game.run(option, onStart);
    }

    require({tempScriptsPath} + '__quick_compile__.js');
    require('src/simulator-config.js');
    require('src/settings.js');
    require('src/cocos2d-jsb.js');
    require('jsb-adapter/jsb-engine.js');
    require('src/asset-record-pipe.js');

    boot();

})();
