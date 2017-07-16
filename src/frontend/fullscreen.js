function resizeToFull(sc) {
    var myGalaxyDiv = document.getElementById("my-galaxy");
    var guiElement = document.getElementsByClassName("dg ac")[0];
    var bodyElement = document.getElementsByTagName("body")[0];

    var height = $(window).height();
    var width = $(window).width();

    bodyElement.style.overflow = "hidden";

    myGalaxyDiv.style.position = "fixed";
    myGalaxyDiv.style.left = 0;
    myGalaxyDiv.style.top = 0;
    myGalaxyDiv.style.right = 0;
    myGalaxyDiv.style.bottom = 0;
    myGalaxyDiv.style.width = "100%";
    myGalaxyDiv.style.height = "100%";
    myGalaxyDiv.style.zIndex = 1001;

    guiElement.style.display = "block";

    sc.widthGalaxy = width;
    sc.heightGalaxy = height;
    sc.initRenderer();
    sc.initStars();
}

function resizeToNormal(sc, width, height) {
    var myGalaxyDiv = document.getElementById("my-galaxy");
    var guiElement = document.getElementsByClassName("dg ac")[0];
    var bodyElement = document.getElementsByTagName("body")[0];

    bodyElement.style.overflow = "auto";

    myGalaxyDiv.style.position = "relative";
    myGalaxyDiv.style.width = width.toString() + "px";
    myGalaxyDiv.style.height = height.toString() + "px";

    guiElement.style.display = "none";

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
