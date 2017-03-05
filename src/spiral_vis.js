import {getStarsPosition} from "./spiral_generator"
import {Slider} from "./slider"

export function SpiralCreator(div) {
    this.div = d3.select(div);
    this.myGalaxyDiv = d3.select("#my-galaxy");
    this.params = {e: 2};

    this.margin = 25;
    this.widthCurve = this.myGalaxyDiv.nodes()[0].offsetWidth;
    console.log(this.widthCurve)
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
}

SpiralCreator.prototype.displayStars = function () {
    var starsPosition = getStarsPosition(this.params);
    var data = starsPosition;
    console.log(data)

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
    d3.select("#params-name").append("label").text("Excentricité :")
    Slider(d3.select("#params-slider"), [0.1, 10],
        function(x) { console.log(x); obj.params.e = x; obj.displayStars(); },
        {'format': function(d) { return d.toString(); },
          'initial': 2,
          'scale': d3.scaleLinear(),
          'ticks': 10
        }
    );

}
