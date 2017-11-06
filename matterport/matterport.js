(function() {
    var getQueryParams = function(location) {
        var rawParams = location.split('?').slice(1).join('?').split('&');
        var params = {};
        for (var i = 0; i < rawParams.length; i++) {
            var split = rawParams[i].split('=');
            var key = split[0];
            var value = split.slice(1).join('=');
            params[key] = value;
        }
        return params;
    };

    var initialize = function(matterportId, iframe) {
        if (!matterportId || !iframe) {
            return;
        }

        var showcaseLoaded = function(showcase) {
            showcase.on(showcase.Events.MODEL_LOADED, function() {});
            showcase.on(showcase.Events.ENTER_PANO, function() {});
            showcase.on(showcase.Events.MOVE, function() {});
            showcase.moveToMode({ mode: showcase.Mode.PANORAMA });
        };

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

    var matterportId = getQueryParams(location.href)['id'];
    if (matterportId) {
        window.onload = function() {
            var iframe = document.getElementById('matterport-content');
            initialize(matterportId, iframe);
        };
    } else {
        console.error('No matterport ID specified');
    }

})();