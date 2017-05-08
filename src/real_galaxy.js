listGalaxies = [
    {
        image: "images/galaxies/ngc3031.jpg",
        name: "ngc3031",
        description: "Beautiful spiral galaxy in the constellation of Penguin"
    },
    {
        image: "images/galaxies/ngc1068.jpg",
        name: "ngc1068",
        description: "Beautiful spiral galaxy in the constellation of Penguin"
    },
    {
        image: "images/galaxies/ngc3351.jpg",
        name: "ngc3351",
        description: "Beautiful spiral galaxy in the constellation of Penguin"
    },
    {
        image: "images/galaxies/ngc3368.jpg",
        name: "ngc3368",
        description: "Beautiful spiral galaxy in the constellation of Penguin"
    },
    {
        image: "images/galaxies/ngc3370.jpg",
        name: "ngc3370",
        description: "Beautiful spiral galaxy in the constellation of Penguin"
    },
    {
        image: "images/galaxies/ngc3556.jpg",
        name: "ngc3556",
        description: "Beautiful spiral galaxy in the constellation of Penguin"
    },
    {
        image: "images/galaxies/ngc3623.jpg",
        name: "ngc3623",
        description: "Beautiful spiral galaxy in the constellation of Penguin"
    }
];

var curGalaxy = listGalaxies[0]

var divRealGalaxy = document.getElementById("real-galaxy");
divRealGalaxy.style.backgroundImage = "url(" + curGalaxy.image + ")";

var divAllThumbnails = document.getElementById("all-thumbnails");

var initLeftPosition = 6; // init at 6% to compensate the margin
var sizeImage = 24; // in percent

var curLeftPosition = initLeftPosition;
listGalaxies.forEach(function(galaxy) {
    var img = document.createElement("img");
    img.className = "thumbnail";
    img.setAttribute("src", galaxy.image);
    img.style.left = curLeftPosition + "%";
    img.onclick = function() {
        curGalaxy = galaxy;
        divRealGalaxy.style.backgroundImage = "url(" + curGalaxy.image + ")";
    }
    divAllThumbnails.appendChild(img);
    curLeftPosition += sizeImage;
});

var arrowLeft = document.getElementById("arrow-left");
var arrowRight = document.getElementById("arrow-right");

var repeaterLeft;
var repeaterRight;

var shift = 2;
arrowLeft.onmouseover = function() {
    var listThumbnails = Array.from(document.getElementsByClassName("thumbnail"));
    repeaterLeft = setInterval(function() {
        var firstLeftPosition = parseInt(listThumbnails[0].style.left.slice(0,-1))
        if (firstLeftPosition >= initLeftPosition) {
            clearInterval(repeaterLeft);
        }
        else {
            listThumbnails.forEach(function(img) {
                img.style.left = parseInt(img.style.left.slice(0,-1)) + shift + "%";
            });
        }
    }, 0);
}
arrowLeft.onmouseout = function() {
    clearInterval(repeaterLeft);
}

arrowRight.onmouseover = function() {
    var listThumbnails = Array.from(document.getElementsByClassName("thumbnail"));
    repeaterRight = setInterval(function() {
        var lastLeftPosition = parseInt(listThumbnails[listThumbnails.length - 1].style.left.slice(0,-1));
        if (lastLeftPosition <= 70) {
            clearInterval(repeaterRight);
        }
        else {
            listThumbnails.forEach(function(img) {
                img.style.left = parseInt(img.style.left.slice(0,-1)) - shift + "%";
            });
        }
    }, 1);
}
arrowRight.onmouseout = function() {
    clearInterval(repeaterRight);
}
