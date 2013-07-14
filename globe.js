
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
    //          1) does the Globe instance support multiple calls of createPoints()?
    //          2) is it fine that different spaceapi versions are handled asynchronously?


    $.getJSON('http://spaceapi.net/directory.json', {api: "<0.13"}, function(urls) {
        for (var name in urls) {
            $.getJSON(urls[name], function(data) {
                if ( data.hasOwnProperty("lat") && data.hasOwnProperty("lon") && data.hasOwnProperty("open") ) {
                    var open = data.open || false;
                    globe.addData([parseFloat(data.lat), parseFloat(data.lon), 0.4, open], {format: 'legend'});
                    globe.createPoints();
                }
            });
        }
    });

    $.getJSON('http://spaceapi.net/directory.json', {api: ">0.12"}, function(urls) {
        for (var name in urls) {
            $.getJSON(urls[name], function(data) {
                if ( data.hasOwnProperty("state") && data.state.hasOwnProperty("open") && data.hasOwnProperty("location")
                    && data.location.hasOwnProperty("lon") && data.location.hasOwnProperty("lat") ) {
                    globe.addData([parseFloat(data.location.lat), parseFloat(data.location.lon), 0.4, data.state.open], {format: 'legend'});
                    globe.createPoints();
                }
            });
        }
    });

    // TODO: Figure out the source of the errors in the console.
});