window.onload = function() {
    var matterportID = window.MATTERPORT_ID || 'cKHMpazixm2';
    var iframe = document.getElementById('matterport-content');
    if (!matterportID || !iframe) {
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
    iframe.setAttribute('src', 'https://my.matterport.com/show/?m=' + matterportID + '&hhl=0&play=1&tiles=1');



};
