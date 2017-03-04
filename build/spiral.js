(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.spiral = global.spiral || {})));
}(this, (function (exports) { 'use strict';

function getStarsPosition(params) {
    var nbrEllipses = 50;
    var x = [], y = [];
    for (var iTraj = 0; iTraj < nbrEllipses; iTraj++) {
        var a = 1 * (iTraj + 1);
        var b = 2 * (iTraj + 1);
        var angle = (iTraj / nbrEllipses) * Math.PI / 2;
        var X = _.range(150).map(() => getStarOnEllipse(a,b,angle));
        x = x.concat(X.map(pos => pos.x));
        y = y.concat(X.map(pos => pos.y));
    }
    console.log(x);
    return {x: x, y: y};
}

function getStarOnEllipse(a, b, angle) {
    var t = Math.random() * 2 * Math.PI;
    var X = [a * Math.cos(t), b * Math.sin(t)];
    var A = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];
    var position = numeric.dot(A,X);

    return {x: position[0], y: position[1]};
}

function SpiralCreator(div) {
    this.div = div;
    this.displayStars();
}

SpiralCreator.prototype.displayStars = function () {
    var params = {};
    var starsPosition = getStarsPosition(params);

    var my_galaxy = document.getElementById("my_galaxy");
    var layout = {
        paper_bgcolor: 'rgba(44, 62, 80,1.0)',
        plot_bgcolor: '#282830',
        xaxis: {
            showgrid: false,
            zeroline: false,
            showline: false,
            ticks: '',
            showticklabels: false
        },
        yaxis: {
            showgrid: false,
            zeroline: false,
            showline: false,
            ticks: '',
            showticklabels: false
        },
        autosize: true,
        hovermode: false,
    };
    var data = {
        x: starsPosition.x,
        y: starsPosition.y,
        mode: 'markers',
        type: 'scatter',
        marker: {size: 2, color: 'rgba(255, 245, 242,1.0)'},
    };

    Plotly.newPlot(my_galaxy, [data], layout);
};

SpiralCreator.prototype.displayParams = function() {

};

exports.SpiralCreator = SpiralCreator;

Object.defineProperty(exports, '__esModule', { value: true });

})));
