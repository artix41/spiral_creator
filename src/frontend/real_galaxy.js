listGalaxies = [
    {
        image: "images/galaxies/ngc3031.jpg",
        name: "NGC 3031 − M81",
        description: "Spiral galaxy about 12 million light-years away in the constellation Ursa Major. Due to its proximity to Earth, large size and active galactic nucleus (which harbors a 70 million M☉ supermassive black hole), Messier 81 has been studied extensively by professional astronomers. The galaxy's large size and relatively high brightness also make it a popular target for amateur astronomers.Messier 81 was first discovered by Johann Elert Bode on December 31, 1774. Consequently, the galaxy is sometimes referred to as \"Bode's Galaxy\". In 1779, Pierre Méchain and Charles Messier reidentified Bode's object, which was subsequently listed in the Messier Catalogue.",
        constellation: "Ursa Major",
        masse: "?",
        distance: "11.8 Mly",
        dimension: "60 Kly"
    },
    {
        image: "images/galaxies/ngc1068.jpg",
        name: "NGC 1068 − M77",
        description: "Messier 77 (also known as NGC 1068) is a barred spiral galaxy about 47 million light-years away in the constellation Cetus. Messier 77 is an active galaxy with an Active Galactic Nucleus (AGN), which is obscured from view by astronomical dust at visible wavelengths. The diameter of the molecular disk and hot plasma associated with the obscuring material was first measured at radio wavelengths by the VLBA and VLA. The hot dust around the nucleus was subsequently measured in the mid-infrared by the MIDI instrument at the VLTI. It is the brightest Seyfert galaxy and is of type 2.",
        constellation: "Cetus",
        masse: "?",
        distance: "51.9 Mly",
        dimension: "107 Kly"
    },
    {
        image: "images/galaxies/ngc3351.jpg",
        name: "NGC 3351 − M95",
        description: "Messier 95 (also known as M95 or NGC 3351) is a barred spiral galaxy about 38 million light-years away in the constellation Leo. In the Catalogue of Named Galaxies, it is called Calopis Leonis, or the beautiful-eyed galaxy. It was discovered by Pierre Méchain in 1781, and catalogued by Charles Messier four days later. On 16 March 2012, a supernova was discovered in M95.",
        constellation: "Leo",
        masse: "?",
        distance: "38 Mly",
        dimension: "?"
    },
    {
        image: "images/galaxies/ngc3368.jpg",
        name: "NGC 3368 − M96",
        description: "Messier 96 (also known as M96 or NGC 3368) is an intermediate spiral galaxy about 35 million light-years away in the constellation Leo(the Lion). It was discovered by French astronomer Pierre Méchain on March 20, 1781. After communicating his finding, French astronomer Charles Messier confirmed the finding four days later and added it to his catalogue of nebulous objects. Finding this object is extremely difficult with binoculars. With a telescope of 25.4 cm (10.0 in) aperture, the galaxy is visible as a 3 × 5 arcminute halo with a brighter core region.[3]",
        constellation: "Leo",
        masse: "?",
        distance: "31 ± 3 Mly",
        dimension: "?"
    },
    {
        image: "images/galaxies/ngc3370.jpg",
        name: "NGC 3370",
        description: "NGC 3370 (also known as UGC 5887 or Silverado Galaxy[2]) is a spiral galaxy about 98 million light-years away in the constellation Leo. It is comparable to our own Milky Way both in diameter (100,000 light years) and mass (1011 solar masses). NGC 3370 exhibits an intricate spiral arm structure surrounding a poorly defined nucleus.",
        constellation: "Leo",
        masse: "?",
        distance: "98 Mly",
        dimension: "?"
    },
    {
        image: "images/galaxies/ngc3556.jpg",
        name: "NGC 3556 − M108",
        description: "Messier 108 (also known as NGC 3556) is a barred spiral galaxy in the constellation Ursa Major. It was discovered by Pierre Méchain in 1781 or 1782.From the perspective of the Earth, this galaxy is seen almost edge-on. This galaxy is an isolated[3] member of the Ursa Major Cluster of galaxies in the Virgo supercluster. It has a morphological classification of type SBbc in the de Vaucouleurs system, which means it is a barred spiral galaxy with somewhat loosely wound arms. The maximum angular size of the galaxy in the optical band is 11′.1 × 4′.6, and it is inclined 75° to the line of sight.",
        constellation: "Ursa Major",
        masse: "125 GM☉",
        distance: "45 Mly",
        dimension: "?"
    },
    {
        image: "images/galaxies/ngc3623.jpg",
        name: "NGC 3623 − M65",
        description: "Messier 65 (also known as NGC 3623) is an intermediate spiral galaxy about 35 million light-years away in the constellation Leo. It was discovered by Charles Messier in 1780. Along with M66 and NGC 3628, M65 forms the Leo Triplet, a small group of galaxies.",
        constellation: "Leo",
        masse: "?",
        distance: "35 Mly",
        dimension: "?"
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
