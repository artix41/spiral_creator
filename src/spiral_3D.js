import {getStarsPosition, Trajectory} from "./spiral_generator"
import {Slider} from "./slider"
import oc from "../node_modules/three-orbit-controls/index"
var OrbitControls = oc(THREE);

export function SpiralCreator3D(div) {
    this.myGalaxyDiv = document.getElementById("my-galaxy");
    this.margin = 25;
    this.widthGalaxy = this.myGalaxyDiv.offsetWidth;
    this.heightGalaxy = 400;
    this.colorStar = "#DBE3EB";
    this.radiusStar = 5;
    this.speed = 0.01;

    this.params =   {
        e: {label: "Excentricity", value: 1.3, range:[0.1, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        noise: {label: "Noise", value: 0.8, range: [0.01, 10], scale: d3.scaleLog(), ticks: 3, decimals: 2},
        nbrStarsInEllipse: {label: "Number of stars per ellipse", value: 400, range: [50, 500], scale: d3.scaleLinear(), ticks: 5, decimals: 0},
        nbrEllipses: {label: "Number of ellipses", value: 100, range: [10, 100], scale: d3.scaleLinear(), ticks: 10, decimals: 0},
        speed: {label: "Speed", value: 0.02, range:[0.001, 0.1], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        radiusPerturbation: {label: "Radius of perturbation", value: 1, range:[0.001, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        freqPerturbation: {label: "Frequency of perturbation", value: 10, range: [0, 10], scale: d3.scaleLinear(), ticks: 11, decimal:0}
    };

    this.displayParams();
    this.initRenderer();
    this.initStars();

    var obj = this;
    function animate() {
        requestAnimationFrame(animate);
        for(var i = 0; i < obj.stars.vertices.length; i++) {
            obj.stars.vertices[i].traj.update(obj.params.speed.value);
            obj.stars.vertices[i].x = obj.xScale(obj.stars.vertices[i].traj.getPosition().x);
            obj.stars.vertices[i].y = obj.yScale(obj.stars.vertices[i].traj.getPosition().y);
        }
        obj.starsSystem.geometry.verticesNeedUpdate = true;
        obj.renderer.render(obj.scene, obj.camera);
    }
    this.renderer.render(this.scene, this.camera);
    animate();
}

SpiralCreator3D.prototype.clearScene = function() {
    var selectedObject = this.scene.getObjectByName("starsSystem");
    this.scene.remove(selectedObject);

};

SpiralCreator3D.prototype.initRenderer = function(){
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.widthGalaxy, this.heightGalaxy);
    this.myGalaxyDiv.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, this.widthGalaxy / this.heightGalaxy, 1, 10000);
    this.camera.position.set(0, 0, 500);
    this.scene.add(this.camera);

    var light = new THREE.AmbientLight( 0xffffff);
    //light.position.set( 0, 0, 400 );
    this.scene.add(light);

    var controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set( 0, 1, 0 );
    controls.update();
}

SpiralCreator3D.prototype.initStars = function() {
    var spriteMap = new THREE.TextureLoader().load("particle.png");
    var material = new THREE.PointsMaterial({
        map: spriteMap,
        color: 0xffffff,
        size: this.radiusStar,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });

    this.stars = new THREE.Geometry();

    var data = getStarsPosition(this.params);

    this.xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
    .range([-200,200]);

    this.yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
    .range([-200,200]);

    var obj = this;
    data.forEach(function(d, i) {
        obj.stars.vertices.push(new THREE.Vector3(obj.xScale(d.x), obj.xScale(d.y), 0));
        obj.stars.vertices[i].traj = new Trajectory(d.t, d.a, d.b, d.angle, d.radiusPerturbation, d.freqPerturbation);
        obj.stars.vertices[i].traj = new Trajectory(d.t, d.a, d.b, d.angle, d.radiusPerturbation, d.freqPerturbation);
    });

    this.starsSystem = new THREE.Points(this.stars, material);
    this.starsSystem.sortParticles = true;
    this.starsSystem.name = "starsSystem";

    this.clearScene();
    this.scene.add(this.starsSystem);
};

SpiralCreator3D.prototype.displayParams = function() {
    var obj = this;
    Object.keys(this.params).forEach(function(p, i) {
        var row = d3.select("#params-galaxy").append("div").attr("class", "row").style("text-align", "left");
        row.append("div").attr("class", "col-md-6")
        .append("label").attr("class", "param" + i).text(obj.params[p].label + " = " + obj.params[p].value.toFixed(obj.params[p].decimals));
        var slider = row.append("div").attr("class", "col-md-6");
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
};
