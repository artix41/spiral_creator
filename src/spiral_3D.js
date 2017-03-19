import {getStarsPosition, Star} from "./spiral_generator"
import {Slider} from "./slider"
import oc from "../node_modules/three-orbit-controls/index"
var OrbitControls = oc(THREE);

export function SpiralCreator3D(div) {
    this.myGalaxyDiv = document.getElementById("my-galaxy");
    this.margin = 25;
    this.widthGalaxy = this.myGalaxyDiv.offsetWidth;
    this.heightGalaxy = 400;
    this.colorStar = "#DBE3EB";
    this.radiusStar = 30;
    this.speed = 0.1;

    this.params =   {
        e: {label: "Excentricity", value: 1.3, range:[0.1, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        noise: {label: "Noise", value: 0.5, range: [0.1, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        nbrStarsInEllipse: {label: "Number of stars per ellipse", value: 100, range: [50, 500], scale: d3.scaleLinear(), ticks: 5, decimals: 0},
        nbrEllipses: {label: "Number of ellipses", value: 50, range: [10, 100], scale: d3.scaleLinear(), ticks: 10, decimals: 0}
    };

    /*var colorToRgba = function(hex, opacity) {
        var rgbColor = "rgba("
        rgbColor = rgbColor.concat(parseInt(hex.slice(1,3), 16), ",");
        rgbColor = rgbColor.concat(parseInt(hex.slice(3,5), 16), ",");
        rgbColor = rgbColor.concat(parseInt(hex.slice(5,7), 16), ",");
        rgbColor = rgbColor.concat(opacity, ")");

        return rgbColor
    };

    var c=document.getElementById("canvas");

    var ctx=c.getContext("2d");

    var gradient=ctx.createRadialGradient(this.radiusStar / 2, this.radiusStar / 2, 0, this.radiusStar / 2,this.radiusStar / 2,this.radiusStar/2);
    console.log(colorToRgba(this.colorStar, 1))
    gradient.addColorStop(0, colorToRgba(this.colorStar, 1));
    gradient.addColorStop(0.25,colorToRgba(this.colorStar, 0.1));
    gradient.addColorStop(0.75,colorToRgba(this.colorStar, 0.05));
    gradient.addColorStop(1,colorToRgba(this.colorStar, 0));

    ctx.fillStyle=gradient;
    ctx.fillRect(10,10,150,100);*/

    this.displayParams();
    this.initRenderer();
    this.initStars();

    var obj = this;
    function animate() {
        requestAnimationFrame(animate);
        for(var i = 0; i < obj.stars.length; i++) {
            obj.stars[i].update(obj.speed);
            obj.stars[i].sprite.position.x = obj.xScale(obj.stars[i].getPosition().x);
            obj.stars[i].sprite.position.y = obj.yScale(obj.stars[i].getPosition().y);
        }
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
    //var spriteMap = new THREE.Texture(starImage)
    var spriteMap = new THREE.TextureLoader().load("particle.png");
    var material = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff, fog: true, lights: true });

    var data = getStarsPosition(this.params);
    this.clearScene(data.length);

    this.xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
    .range([-200,200]);

    this.yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
    .range([-200,200]);

    this.stars = [];
    var obj = this;
    var t0 = performance.now()
    data.forEach(function(d, i) {
        obj.stars.push(new Star(new THREE.Sprite(material), d.t, d.a, d.b, d.angle));
        obj.stars[i].sprite.position.x = obj.xScale(d.x);
        obj.stars[i].sprite.position.y = obj.yScale(d.y);
        obj.stars[i].sprite.scale.set(5,5,1);
        obj.stars[i].sprite.name = "star" + i;
        obj.scene.add(obj.stars[i].sprite);
    });
    console.log("Total : ",  performance.now() - t0 + " ms")
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
