import {getStarsPosition} from "./spiral_generator"
import {Slider} from "./slider"

export function SpiralCreator(div) {
    this.div = d3.select(div);
    this.myGalaxyDiv = document.getElementById("my_galaxy");
    this.params = {e: 2};
    this.displayParams();
    this.displayStars();
}

SpiralCreator.prototype.updateData = function() {
    var starsPosition = getStarsPosition(this.params);
    this.data.x = starsPosition.x;
    this.data.y = starsPosition.y;
}

SpiralCreator.prototype.displayStars = function () {
    var layout = {
        paper_bgcolor: 'rgba(44, 62, 80,1.0)',
        plot_bgcolor: '#282830',
        margin: {
            l: 0,
            t: 0,
            r: 0,
            b: 0
        },
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

    var starsPosition = getStarsPosition(this.params);
    this.data = {
        x: starsPosition.x,
        y: starsPosition.y,
        mode: 'markers',
        type: 'scatter',
        marker: {size: 2, color: 'rgba(255, 245, 242,1.0)'},
    };

    Plotly.newPlot(this.myGalaxyDiv, [this.data], layout);
};

SpiralCreator.prototype.redraw = function() {
    this.updateData();
    Plotly.redraw(this.myGalaxyDiv);
}

SpiralCreator.prototype.displayParams = function() {
    var obj = this;
    d3.select("#params_name").append("label").text("Excentricité :")
    Slider(d3.select("#params_slider"), [0.1, 10],
        function(x) { console.log(x); obj.params.e = x; obj.redraw(); },
        {'format': function(d) { return d.toString(); },
          'initial': 2,
          'scale': d3.scaleLinear(),
          'ticks': 10
        }
    );

}
