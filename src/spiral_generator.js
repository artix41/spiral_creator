export function getStarsPosition(params) {
    var t0 = performance.now();
    var positions = [];
    for (var iTraj = 0; iTraj < params.nbrEllipses.value; iTraj++) {
        var a = iTraj + 1;
        var b = params.e.value * (iTraj + 1);
        var angle = (iTraj / params.nbrEllipses.value) * Math.PI * 2;
        var X = _.range(params.nbrStarsInEllipse.value).map(() => generateStarOnEllipse(a, b, angle, params.noise.value));
        positions = positions.concat(X)
    }
    return positions;
}

function generateStarOnEllipse(a, b, angle, noise) {
    var t = Math.random() * 2 * Math.PI;
    var noisyA = a + rnorm(0,noise);
    var noisyB = b + rnorm(0,noise);
    var X = [noisyA * Math.cos(t), noisyB * Math.sin(t)];
    var A = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];
    var position = numeric.dot(A,X);

    return {x: position[0], y: position[1], t: t, a: noisyA, b: noisyB, angle: angle};
}

export function Trajectory(t, a, b, angle) {
    this.t = t;
    this.a = a;
    this.b = b;
    this.angle = angle;
}

Trajectory.prototype.getPosition = function() {
    var X = [this.a * Math.cos(this.t), this.b * Math.sin(this.t)];
    var A = [[Math.cos(this.angle), -Math.sin(this.angle)], [Math.sin(this.angle), Math.cos(this.angle)]];
    var position = numeric.dot(A,X);

    return {x: position[0], y: position[1]};
}

Trajectory.prototype.update = function (speed) {
    this.t += speed;
    this.t %= 2 * Math.PI;
};

Trajectory.prototype.display = function() {
    var material = new THREE.LineBasicMaterial({color:0xff0000, opacity:1});
    var ellipse = new THREE.EllipseCurve(0, 0, this.a, this.b, Math.max(this.a, this.b), 0, 2.0 * Math.PI, false, this.angle);
    var ellipsePath = new THREE.CurvePath();
    ellipsePath.add(ellipse);

    var ellipseGeometry = ellipsePath.createPointsGeometry(100);
    var line = new THREE.Line(ellipseGeometry, material);

    return line;
};
