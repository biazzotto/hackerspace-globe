
$(function() {

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        return;
    }

    var openColor = new THREE.Color(0x00ff00);
    var closedColor = new THREE.Color(0xff0000);
    function colorize(open) {
        return open ? openColor : closedColor;
    };

    var globe = new DAT.Globe($('#globeContainer').get(0), colorize);
    TWEEN.start();
    new TWEEN.Tween(globe).to({time: 0},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
    globe.animate();

    // TODO: have a look at these questions.
    //
    //          1) does the Globe instance support multiple calls of createPoints()? => it seems so


    $.getJSON('https://directory.spaceapi.io/', function(urls) {
        for (var name in urls) {
            $.getJSON(urls[name], function(data) {
                var lat = 0;
                var lon = 0;
                var open = false;
                if ( data.hasOwnProperty("lat") && data.hasOwnProperty("lon") && data.hasOwnProperty("open") ) {
                    // old v0.12 and before
                    lat = data.lat;
                    lon = data.lon;
                    open = data.open || false;
                } else if ( data.hasOwnProperty("state") && data.state.hasOwnProperty("open") && data.hasOwnProperty("location")
                    && data.location.hasOwnProperty("lon") && data.location.hasOwnProperty("lat") ) {

                    // v0.13 and later
                    lat = data.location.lat;
                    lon = data.location.lon;
                    open = data.state.open || false;
                }

                globe.addData([parseFloat(lat), parseFloat(lon), 0.1, open], {format: 'legend'});
                globe.createPoints();
            });
        }
    });

    // TODO: Figure out the source of the errors in the console.
});
