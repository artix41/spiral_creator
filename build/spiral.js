(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.spiral = global.spiral || {})));
}(this, (function (exports) { 'use strict';

function getStarsPosition(params) {
    var nbrEllipses = 40;
    var positions = [];
    for (var iTraj = 0; iTraj < nbrEllipses; iTraj++) {
        var a = iTraj + 1;
        var b = params.e * (iTraj + 1);
        var angle = (iTraj / nbrEllipses) * Math.PI / 2;
        var X = _.range(100).map(() => getStarOnEllipse(a,b,angle));
        positions = positions.concat(X);
    }
    return positions;
}

function getStarOnEllipse(a, b, angle) {
    var t = Math.random() * 2 * Math.PI;
    var X = [a * Math.cos(t), b * Math.sin(t)];
    var A = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];
    var position = numeric.dot(A,X);

    return {x: position[0], y: position[1]};
}

function Slider(div, domain, callback, params) {
    // Code by Ben Frederickson in fmin
    params = params || {};
    var margin = params.margin || {right: 13, left: 10},
        height = params.height || 35,
        format = params.format || function(d) { return d + "*"; },
        width = params.width || div.nodes()[0].offsetWidth;

    var svg = div.append("svg")
        .attr("width", width)
        .attr("height", height);

    var x = (params.scale || d3.scaleLinear())
        .domain(domain)
        .range([0, width - margin.left - margin.right])
        .clamp(true);

    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + 10 + ")");


    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")

      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay");

      // ugh: stroke-width on safari of track-overlay seems messed. drag on whole svg
      // instead
      svg
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() {
                var value = x.invert(d3.event.x);
                handle.attr("cx", x(value));
                callback(value);
            }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(params.ticks || 5))
      .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(format);

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9)
        .attr("cx", x(params.initial || x.invert(0)));

    function move(value, duration) {
       handle.transition().duration(duration).attr("cx", x(value));
    }

    function change(value) {
        handle.attr("cx", x(value));
        callback(value);
    }

    return {'change': change, 'move': move};
}

function SpiralCreator(div) {
    this.div = d3.select(div);
    this.myGalaxyDiv = d3.select("#my-galaxy");
    this.params = {e: 2};

    this.margin = 25;
    this.widthCurve = this.myGalaxyDiv.nodes()[0].offsetWidth;
    console.log(this.widthCurve);
    this.heightCurve = 400;

    this.colorPoint = "rgba(255, 245, 242,1.0)";
    this.sizePoint = 2;
    this.bgColor = '#282830';

    this.displayParams();
    this.displayStars();
}

SpiralCreator.prototype.updateData = function() {
    var starsPosition = getStarsPosition(this.params);
    this.data.x = starsPosition.x;
    this.data.y = starsPosition.y;
};

SpiralCreator.prototype.displayStars = function () {
    var starsPosition = getStarsPosition(this.params);
    var data = starsPosition;
    console.log(data);

    this.myGalaxyDiv.selectAll("svg").data([]).exit().remove();
    var myGalaxySvg = this.myGalaxyDiv.append("svg")
    .attr("width", this.widthCurve).attr("height", this.heightCurve)
    .attr("style", "background-color: " + this.bgColor);

    var circle = myGalaxySvg.selectAll("circle").data(data).enter().append("circle");

    var xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
    .range([this.margin,this.widthCurve - this.margin]);

    var yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
    .range([this.margin,this.heightCurve - this.margin]);

    circle.attr("r", this.sizePoint)
    .attr("fill", this.colorPoint)
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y));

};

SpiralCreator.prototype.redraw = function() {
    this.updateData();
    Plotly.redraw(this.myGalaxyDiv);
};

SpiralCreator.prototype.displayParams = function() {
    var obj = this;
    d3.select("#params-name").append("label").text("Excentricité :");
    Slider(d3.select("#params-slider"), [0.1, 10],
        function(x) { console.log(x); obj.params.e = x; obj.displayStars(); },
        {'format': function(d) { return d.toString(); },
          'initial': 2,
          'scale': d3.scaleLinear(),
          'ticks': 10
        }
    );

};

exports.SpiralCreator = SpiralCreator;

Object.defineProperty(exports, '__esModule', { value: true });

})));
