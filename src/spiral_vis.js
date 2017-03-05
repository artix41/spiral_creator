import {getStarsPosition} from "./spiral_generator"
import {Slider} from "./slider"

export function SpiralCreator(div) {
    this.div = d3.select(div);
    this.myGalaxyDiv = d3.select("#my-galaxy");
    this.params =   {
        e: {label: "Excentricité", value: 0.8, range:[0.1, 10], scale: d3.scaleLog(), ticks: 2},
        noise: {label: "Bruit", value: 0.1, range: [0.1, 10], scale: d3.scaleLog(), ticks: 2},
        nbrStarsInEllipse: {label: "Nombre d'étoiles par ellipse", value: 100, range: [50, 500], scale: d3.scaleLinear(), ticks: 10},
        nbrEllipses: {label: "Nombre d'ellipses", value: 40, range: [10, 100], scale: d3.scaleLog(), ticks: 2}
    };

    this.margin = 25;
    this.widthCurve = this.myGalaxyDiv.nodes()[0].offsetWidth;
    this.heightCurve = 400;
    this.colorPoint = "rgba(255, 245, 242,1.0)";
    this.sizePoint = 1;
    this.bgColor = '#080810';

    this.displayParams();
    this.displayStars();
}

SpiralCreator.prototype.updateData = function() {
    var starsPosition = getStarsPosition(this.params);
    this.data.x = starsPosition.x;
    this.data.y = starsPosition.y;
}

SpiralCreator.prototype.displayStars = function () {
    var starsPosition = getStarsPosition(this.params);
    var data = starsPosition;

    this.myGalaxyDiv.selectAll("svg").data([]).exit().remove();
    var myGalaxySvg = this.myGalaxyDiv.append("svg")
    .attr("width", this.widthCurve).attr("height", this.heightCurve)
    .attr("style", "background-color: " + this.bgColor)

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
}


SpiralCreator.prototype.displayParams = function() {
    var obj = this;
    Object.keys(this.params).forEach(function(p, i) {
        var row = d3.select("#params-galaxy").append("div").attr("class", "row").style("text-align", "left");
        row.append("div").attr("class", "col-md-3")
        .append("label").attr("class", "param" + i).text(obj.params[p].label + " = " + obj.params[p].value.toFixed(1));
        var slider = row.append("div").attr("class", "col-md-3");
        Slider(slider, obj.params[p].range,
            function(x) {
                obj.params[p].value = x;
                d3.select(".param" + i).text(obj.params[p].label + " = " + obj.params[p].value.toFixed(1));
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
