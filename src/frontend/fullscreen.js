function full() {
    var el = document.getElementById('my-galaxy');

    if(el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen();
    }
    else {
        el.mozRequestFullScreen();
    }

    console.log('fullscreen!');
}
function resize(sc) {
    var c = document.getElementsByTagName('canvas')[0];
    var height = $(window).height();
    var width = $(window).width();

    sc.widthGalaxy = width;
    sc.heightGalaxy = height;
    sc.initRenderer();
    sc.initStars();
}

function on_fullscreen_change(widthCanvas, heightCanvas, sc) {
    var c = document.getElementsByTagName('canvas')[0];
    if(document.mozFullScreen || document.webkitIsFullScreen) {
        resize(sc);
    }
    else {
        sc.widthGalaxy = widthCanvas;
        sc.heightGalaxy = heightCanvas;
        sc.initRenderer();
        sc.initStars();
    }
}
