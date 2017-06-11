import {getStarsPosition} from "./spiral_generator"
import {Slider} from "./slider"

export function SpiralCreator2D(div) {
    this.div = d3.select(div);
    this.myGalaxyDiv = d3.select("#my-galaxy");
    this.params =   {
        e: {label: "Excentricity", value: 1.3, range:[0.1, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        noise: {label: "Noise", value: 0.5, range: [0.1, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        nbrStarsInEllipse: {label: "Number of stars per ellipse", value: 150, range: [50, 500], scale: d3.scaleLinear(), ticks: 5, decimals: 0},
        nbrEllipses: {label: "Number of ellipses", value: 40, range: [10, 100], scale: d3.scaleLinear(), ticks: 10, decimals: 0}
    };

    this.margin = 25;
    this.widthCurve = this.myGalaxyDiv.nodes()[0].offsetWidth;
    this.heightCurve = 400;
    this.colorPoint = "#DBE3EB";
    this.sizePoint = 15;
    this.bgColor = '#080810';

    this.canvas = this.myGalaxyDiv.append("canvas")
    .attr("width", this.widthCurve).attr("height", this.heightCurve)
    .attr("style", "background-color: " + this.bgColor)
    this.context = this.canvas.node().getContext("2d");

    this.displayParams();
    this.displayStars();
}

SpiralCreator2D.prototype.createGradientColor = function() {
    var colorToRgba = function(hex, opacity) {
        var rgbColor = "rgba("
        rgbColor = rgbColor.concat(parseInt(hex.slice(1,3), 16), ",");
        rgbColor = rgbColor.concat(parseInt(hex.slice(3,5), 16), ",");
        rgbColor = rgbColor.concat(parseInt(hex.slice(5,7), 16), ",");
        rgbColor = rgbColor.concat(opacity, ")");

        return rgbColor
    };
    var gradient = this.context.createRadialGradient(this.sizePoint / 2, this.sizePoint / 2, 0, this.sizePoint / 2,this.sizePoint / 2,this.sizePoint/2);
    gradient.addColorStop(0, colorToRgba(this.colorPoint, 1));
    gradient.addColorStop(0.25,colorToRgba(this.colorPoint, 0.1));
    gradient.addColorStop(0.75,colorToRgba(this.colorPoint, 0.05));
    gradient.addColorStop(1,colorToRgba(this.colorPoint, 0));

    return gradient

}

SpiralCreator2D.prototype.createStarImage = function(gradient) {
    var starCanvas = document.createElement('canvas'); // offscreen canvas to create a star
    starCanvas.width = this.sizePoint * 2;
    starCanvas.height = this.sizePoint * 2;
    var starContext = starCanvas.getContext("2d");

    starContext.fillStyle = gradient;
    starContext.arc(this.sizePoint, this.sizePoint, this.sizePoint, 0, 2*Math.PI, true);
    starContext.fill();

    return starCanvas;
}

SpiralCreator2D.prototype.displayStars = function () {
    var data = getStarsPosition(this.params);

    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.width);

    var gradient = this.createGradientColor()
    var starImage = this.createStarImage(gradient);

    var xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
    .range([this.margin,this.widthCurve - this.margin]);

    var yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
    .range([this.margin,this.heightCurve - this.margin]);


    var obj = this;
    data.forEach(function(d) {
        obj.context.drawImage(starImage, xScale(d.x), yScale(d.y));
    });
    this.context.fill();

};

SpiralCreator2D.prototype.displayParams = function() {
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
