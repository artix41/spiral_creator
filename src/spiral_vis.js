import {getStarsPosition} from "./spiral_generator"
import {Slider} from "./slider"

export function SpiralCreator(div) {
    this.div = d3.select(div);
    this.myGalaxyDiv = d3.select("#my-galaxy");
    this.params =   {
        e: {label: "Excentricity", value: 1.3, range:[0.1, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        noise: {label: "Noise", value: 0.5, range: [0.1, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        nbrStarsInEllipse: {label: "Number of stars per ellipse", value: 200, range: [50, 500], scale: d3.scaleLinear(), ticks: 5, decimals: 0},
        nbrEllipses: {label: "Number of ellipses", value: 60, range: [10, 100], scale: d3.scaleLinear(), ticks: 10, decimals: 0}
    };

    this.margin = 25;
    this.widthCurve = this.myGalaxyDiv.nodes()[0].offsetWidth;
    this.heightCurve = 400;
    this.colorPoint = "rgba(255, 245, 242,1.0)";
    this.sizePoint = 15;
    this.bgColor = '#080810';

    this.displayParams();
    this.displayStars();
}

SpiralCreator.prototype.createGradientColor = function(svg) {
    var gradient = svg.append("svg:defs")
    .append("svg:radialGradient")
    .attr("id", "gradientStar")
    .attr("cx", 0.25)
    .attr("cy", 0.25)
    .attr("r", 0.25)

    gradient.append("svg:stop")
    .attr("offset", "0%")
    .attr("stop-color", this.colorPoint)
    .attr("stop-opacity", 1);

    gradient.append("svg:stop")
    .attr("offset", "25%")
    .attr("stop-color", this.colorPoint)
    .attr("stop-opacity", 0.1);

    gradient.append("svg:stop")
    .attr("offset", "75%")
    .attr("stop-color", this.colorPoint)
    .attr("stop-opacity", 0.05);

    gradient.append("svg:stop")
    .attr("offset", "100%")
    .attr("stop-color", this.colorPoint)
    .attr("stop-opacity", 0);
}

SpiralCreator.prototype.displayStars = function () {
    var starsPosition = getStarsPosition(this.params);
    var data = starsPosition;

    this.myGalaxyDiv.selectAll("svg").data([]).exit().remove();
    var myGalaxySvg = this.myGalaxyDiv.append("svg")
    .attr("width", this.widthCurve).attr("height", this.heightCurve)
    .attr("style", "background-color: " + this.bgColor)

    this.createGradientColor(myGalaxySvg);

    var circle = myGalaxySvg.selectAll("circle").data(data).enter().append("circle");

    var xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
    .range([this.margin,this.widthCurve - this.margin]);

    var yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
    .range([this.margin,this.heightCurve - this.margin]);

    circle.attr("r", this.sizePoint)
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("fill", "url(#gradientStar)")

};

SpiralCreator.prototype.redraw = function() {
    this.updateData();
    Plotly.redraw(this.myGalaxyDiv);
}


SpiralCreator.prototype.displayParams = function() {
    var obj = this;
    Object.keys(this.params).forEach(function(p, i) {
        var row = d3.select("#params-galaxy").append("div").attr("class", "row").style("text-align", "left");
        row.append("div").attr("class", "col-md-3")
        .append("label").attr("class", "param" + i).text(obj.params[p].label + " = " + obj.params[p].value.toFixed(obj.params[p].decimals));
        var slider = row.append("div").attr("class", "col-md-3");
        Slider(slider, obj.params[p].range,
            function(x) {
                obj.params[p].value = x;
                d3.select(".param" + i).text(obj.params[p].label + " = " + obj.params[p].value.toFixed(obj.params[p].decimals));
                obj.displayStars();
            },
            {'format': d => d.toString(),
              'initial': obj.params[p].value,
              'scale': obj.params[p].scale,
              'ticks': obj.params[p].ticks
            }
        );

    });
}
