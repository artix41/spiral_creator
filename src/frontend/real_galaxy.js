listGalaxies = [
    {
        image: "images/galaxies/ngc3031.jpg",
        name: "NGC 3031",
        description: "Beautiful spiral galaxy in the constellation of Penguin",
        constellation: "Pinguin",
        masse: "Très très lourd",
        distance: "Très très loin",
        dimension: "Très très long"
    },
    {
        image: "images/galaxies/ngc1068.jpg",
        name: "NGC 1068",
        description: "Beautiful spiral galaxy in the constellation of Penguin",
        constellation: "Pinguin",
        masse: "Très très lourd",
        distance: "Très très loin",
        dimension: "Très très long"
    },
    {
        image: "images/galaxies/ngc3351.jpg",
        name: "NGC 3351",
        description: "Beautiful spiral galaxy in the constellation of Penguin",
        constellation: "Pinguin",
        masse: "Très très lourd",
        distance: "Très très loin",
        dimension: "Très très long"
    },
    {
        image: "images/galaxies/ngc3368.jpg",
        name: "NGC 3368",
        description: "Beautiful spiral galaxy in the constellation of Penguin",
        constellation: "Pinguin",
        masse: "Très très lourd",
        distance: "Très très loin",
        dimension: "Très très long"
    },
    {
        image: "images/galaxies/ngc3370.jpg",
        name: "NGC 3370",
        description: "Beautiful spiral galaxy in the constellation of Penguin",
        constellation: "Pinguin",
        masse: "Très très lourd",
        distance: "Très très loin",
        dimension: "Très très long"
    },
    {
        image: "images/galaxies/ngc3556.jpg",
        name: "NGC 3556",
        description: "Beautiful spiral galaxy in the constellation of Penguin",
        constellation: "Pinguin",
        masse: "Très très lourd",
        distance: "Très très loin",
        dimension: "Très très long"
    },
    {
        image: "images/galaxies/ngc3623.jpg",
        name: "NGC 3623",
        description: "Beautiful spiral galaxy in the constellation of Penguin"
    }
];

var curGalaxy = listGalaxies[0]

var divGalaxyPicture = document.getElementById("galaxy-picture");
divGalaxyPicture.style.backgroundImage = "url(" + curGalaxy.image + ")";

createThumbnailsNavigation();
createDescriptions();

function createDescriptions() {
    divDescriptionGalaxy = document.getElementById("galaxy-information");

    firstRow = divDescriptionGalaxy.appendChild(document.createElement("div"));
    firstRow.className = "row";
    nameGalaxy = firstRow.appendChild(document.createElement("h3"));
    nameGalaxy.id = "name-galaxy";
    nameGalaxy.innerText = curGalaxy.name;

    secondRow = divDescriptionGalaxy.appendChild(document.createElement("div"));
    secondRow.className = "row";
    constellationCol = secondRow.appendChild(document.createElement("div"));
    constellationCol.className = "col-md-6";
    labelConstellation = constellationCol.appendChild(document.createElement("label"));
    labelConstellation.innerText = "Constellation : "
    textConstellation = constellationCol.appendChild(document.createElement("span"));
    textConstellation.id = "constellation-galaxy";
    textConstellation.innerText = curGalaxy.constellation;

    distanceCol = secondRow.appendChild(document.createElement("div"));
    distanceCol.className = "col-md-6";
    labelDistance = distanceCol.appendChild(document.createElement("label"));
    labelDistance.innerText = "Distance : ";
    textDistance = distanceCol.appendChild(document.createElement("span"));
    textDistance.id = "distance-galaxy";
    textDistance.innerText = curGalaxy.distance;

    thirdRow = divDescriptionGalaxy.appendChild(document.createElement("div"));
    thirdRow.className = "row";
    masseCol = thirdRow.appendChild(document.createElement("div"));
    masseCol.className = "col-md-6";
    labelMasse = masseCol.appendChild(document.createElement("label"));
    labelMasse.innerText = "Masse : ";
    textMasse = masseCol.appendChild(document.createElement("span"));
    textMasse.id = "masse-galaxy";
    textMasse.innerText = curGalaxy.masse;

    dimensionCol = thirdRow.appendChild(document.createElement("div"));
    dimensionCol.className = "col-md-6";
    labelDimension = dimensionCol.appendChild(document.createElement("label"));
    labelDimension.innerText = "Dimension : ";
    textDimension = dimensionCol.appendChild(document.createElement("span"));
    textDimension.id = "dimension-galaxy";
    textDimension.innerText = curGalaxy.dimension;

    fourthRow = divDescriptionGalaxy.appendChild(document.createElement("div"));
    fourthRow.className = "row";
    descriptionGalaxy = fourthRow.appendChild(document.createElement("p"));
    descriptionGalaxy.id = "description-galaxy";
    descriptionGalaxy.innerText = curGalaxy.description;

}

function changeGalaxy(newGalaxy) {
    curGalaxy = newGalaxy;
    divGalaxyPicture.style.backgroundImage = "url(" + curGalaxy.image + ")";

    nameGalaxy = document.getElementById("name-galaxy");
    nameGalaxy.innerText = curGalaxy.name;
    constellationGalaxy = document.getElementById("constellation-galaxy");
    constellationGalaxy.innerText = curGalaxy.constellation;
    distanceGalaxy = document.getElementById("distance-galaxy");
    distanceGalaxy.innerText = curGalaxy.distance;
    masseGalaxy = document.getElementById("masse-galaxy");
    masseGalaxy.innerText = curGalaxy.masse;
    dimensionGalaxy = document.getElementById("dimension-galaxy");
    dimensionGalaxy.innerText = curGalaxy.dimension;
    descriptionGalaxy = document.getElementById("description-galaxy");
    descriptionGalaxy.innerText = curGalaxy.description;

}

function createThumbnailsNavigation() {
    var divAllThumbnails = document.getElementById("all-thumbnails");

    var sizeImage = 24; // in percent

    // ============= Initialization =============

    var curLeftPosition = 0;
    listGalaxies.forEach(function(galaxy) {
        var img = document.createElement("img");
        img.className = "thumbnail";
        img.setAttribute("src", galaxy.image);
        img.style.left = curLeftPosition + "%";
        img.onclick = function() {
            changeGalaxy(galaxy);
        }
        divAllThumbnails.appendChild(img);
        curLeftPosition += sizeImage;
    });

    // ============== Mouse hover on arrows ==============

    var arrowLeft = document.getElementById("arrow-left");
    var arrowRight = document.getElementById("arrow-right");

    var repeaterLeft;
    var repeaterRight;

    var shift = 2;

    arrowLeft.onmouseover = function() {
        var listThumbnails = Array.from(document.getElementsByClassName("thumbnail"));
        repeaterLeft = setInterval(function() {
            var firstLeftPosition = parseInt(listThumbnails[0].style.left.slice(0,-1))
            if (firstLeftPosition >= 0) {
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
            if (lastLeftPosition <= 76) {
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
}
