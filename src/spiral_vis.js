import {getStarsPosition} from "./spiral_generator"

export function SpiralCreator(div) {
    this.div = div;
    this.displayStars()
}

SpiralCreator.prototype.displayStars = function () {
    var params = {};
    var starsPosition = getStarsPosition(params);

    var my_galaxy = document.getElementById("my_galaxy");
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

}
