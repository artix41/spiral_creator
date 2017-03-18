import {getStarsPosition} from "./spiral_generator"
import {Slider} from "./slider"
import oc from "../node_modules/three-orbit-controls/index"
var OrbitControls = oc(THREE);

export function SpiralCreator3D(div) {
    this.myGalaxyDiv = document.getElementById("my-galaxy");
    this.margin = 25;
    this.widthGalaxy = this.myGalaxyDiv.offsetWidth;
    this.heightGalaxy = 400;
    this.colorStar = "#DBE3EB";
    this.radiusStar = 1;

    this.params =   {
        e: {label: "Excentricity", value: 1.3, range:[0.1, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        noise: {label: "Noise", value: 0.5, range: [0.1, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        nbrStarsInEllipse: {label: "Number of stars per ellipse", value: 100, range: [50, 500], scale: d3.scaleLinear(), ticks: 5, decimals: 0},
        nbrEllipses: {label: "Number of ellipses", value: 50, range: [10, 100], scale: d3.scaleLinear(), ticks: 10, decimals: 0}
    };

    this.displayParams();
    this.initRenderer();
    this.initStars();

    var obj = this;
    function animate() {
        requestAnimationFrame(animate);
        //obj.stars[1].rotation.x += 0.01;
        //obj.stars[1].rotation.y += 0.02;
        obj.renderer.render(obj.scene, obj.camera);
    }
    this.renderer.render(this.scene, this.camera);
    animate();
}

SpiralCreator3D.prototype.clearScene = function(nStars) {
    var obj = this;
    _.range(nStars).forEach(function(d,i) {
        var selectedObject = obj.scene.getObjectByName("star" + i);
        if(selectedObject) {
            obj.scene.remove(selectedObject);
        }
    })
}

SpiralCreator3D.prototype.initRenderer = function(){
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.widthGalaxy, this.heightGalaxy);
    this.myGalaxyDiv.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, this.widthGalaxy / this.heightGalaxy, 1, 10000);
    this.camera.position.set(0, 0, 1000);
    this.scene.add(this.camera);

    var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light.position.set( 0, 0, 400 );
    this.scene.add(light);

    var controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set( 0, 1, 0 );
    controls.update();
}

SpiralCreator3D.prototype.initStars = function() {
    //var texture = new THREE.TextureLoader().load("sprite.png");
    var material = new THREE.SpriteMaterial({ color: 0xffffff, fog: true });
    var sprite = new THREE.Sprite(material);

    // var geometry = new THREE.SphereGeometry(this.radiusStar, 32, 32);
    // var material = new THREE.MeshBasicMaterial({
    //     color:this.colorStar,
    //     //wireframe: true
    // });

    var data = getStarsPosition(this.params);
    this.clearScene(data.length);

    var xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
    .range([-200,200]);

    var yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
    .range([-200,200]);

    this.stars = [];
    var obj = this;
    data.forEach(function(d, i) {
        obj.stars.push(new THREE.Sprite(material));
        obj.stars[i].position.x = xScale(d.x);
        obj.stars[i].position.y = yScale(d.y);
        obj.stars[i].name = "star" + i;
        obj.scene.add(obj.stars[i]);
    });
}

SpiralCreator3D.prototype.displayParams = function() {
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
                obj.initStars();
            },
            {'format': d => d.toString(),
              'initial': obj.params[p].value,
              'scale': obj.params[p].scale,
              'ticks': obj.params[p].ticks
            }
        );

    });
}
