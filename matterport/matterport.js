(function() {

    var initialize = function(matterportId, iframe) {
        console.log('Intitializing... %s', matterportId, iframe);
        if (!matterportId || !iframe) {
            console.log('Failed');
            return;
        }

        var showcaseLoaded = function(showcase) {
            showcase.on(showcase.Events.MODEL_LOADED, function() {});
            showcase.on(showcase.Events.ENTER_PANO, function() {});
            showcase.on(showcase.Events.MOVE, function() {});
        }

        var matterportLoaded = function() {
            try {
                // ** Replace demo applicationKey with your application key **
                window.SHOWCASE_EMBED_SDK.connect({

                                                  applicationKey: 'a8a9d13f-7212-4cf6-865a-f11c42a843a1',
                                                  iframe: iframe
                                                  })
                .then(showcaseLoaded)
                .catch(console.error);
            } catch (e) {
                console.error(e);
            }
        };

        iframe.addEventListener('load', matterportLoaded, true);
        iframe.setAttribute('src', 'https://my.matterport.com/show/?m=' + matterportId + '&hhl=0&play=1&tiles=1');
    };

    window.initializeMatterport = function(matterportId) {
        console.log('initializeMatterport(', matterportId, ')');
        var iframe = document.getElementById('matterport-content');
        if (iframe) {
            console.log('Loaded!');
            initialize(matterportId, iframe);
        } else {
            console.log('Not yet ready...');
            window.onload = function() {
                console.log('onload');
                var iframe = document.getElementById('matterport-content');
                initialize(matterportId, iframe);
            };
        }
    };

})();