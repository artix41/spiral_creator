export function getStarsPosition(params) {
    var t0 = performance.now();
    var positions = [];
    for (var iTraj = 0; iTraj < params.nbrEllipses.value; iTraj++) {
        var a = iTraj + 1;
        var b = params.e.value * (iTraj + 1);
        var angle = (iTraj / params.nbrEllipses.value) * Math.PI * 2;
        var X = _.range(params.nbrStarsInEllipse.value).map(() => generateStarOnEllipse(
            a,
            b,
            angle,
            params.radiusPerturbation.value,
            params.freqPerturbation.value,
            params.noise.value
        ));
        positions = positions.concat(X)
    }
    return positions;
}

function generateStarOnEllipse(a, b, angle, radiusPerturbation, freqPerturbation, noise) {
    var t = Math.random() * 2 * Math.PI;
    var noisyA = a + rnorm(0,noise);
    var noisyB = b + rnorm(0,noise);
    var position = getPosition(t, a, b, angle, radiusPerturbation, freqPerturbation);

    return {x: position.x, y: position.y, t: t, a: noisyA, b: noisyB, angle: angle,
            radiusPerturbation: radiusPerturbation, freqPerturbation: freqPerturbation};
}

export function Trajectory(t, a, b, angle, radiusPerturbation, freqPerturbation) {
    this.t = t;
    this.a = a;
    this.b = b;
    this.angle = angle;
    this.radiusPerturbation = radiusPerturbation;
    this.freqPerturbation = freqPerturbation;
}

function getPosition(t, a, b, angle, radiusPerturbation, freqPerturbation) {
    var X = [a * Math.cos(t), b * Math.sin(t)];
    var A = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];
    var position = numeric.dot(A,X);

    position[0] += radiusPerturbation * Math.cos(2 * freqPerturbation * t);
    position[1] += radiusPerturbation * Math.sin(2 * freqPerturbation * t);

    return {x: position[0], y: position[1]};
}

Trajectory.prototype.getPosition = function() {
    return getPosition(this.t, this.a, this.b, this.angle, this.radiusPerturbation, this.freqPerturbation);
}

Trajectory.prototype.update = function (speed) {
    this.t += speed;
    this.t %= 2 * Math.PI;
};
