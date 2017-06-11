export function getStarsPosition(params) {
    var t0 = performance.now();
    var positions = [];
    for (var iTraj = 0; iTraj < Math.round(params.nbrTrajectories.value); iTraj++) {
        var radius = iTraj + 1;
        var angle = (iTraj / params.nbrTrajectories.value) * Math.PI * 2;
        //var angle = Math.random() * 2 * Math.PI;
        var X = _.range(params.nbrStarsInTraj.value).map(() => generateStarOnTraj(
            radius,
            angle,
            params.radiusPerturbation.value * radius,
            Math.round(params.freqPerturbation.value),
            params.noise.value
        ));
        positions = positions.concat(X)
    }
    return positions;
}

function generateStarOnTraj(radius, angle, radiusPerturbation, freqPerturbation, noise) {
    var t = Math.random() * 2 * Math.PI;
    var noisyRadius = radius + rnorm(0,noise);
    var position = getPosition(t, radius, angle, radiusPerturbation, freqPerturbation);

    return {x: position.x, y: position.y, t: t, radius: noisyRadius, angle: angle,
            radiusPerturbation: radiusPerturbation, freqPerturbation: freqPerturbation};
}

export function Trajectory(t, radius, angle, radiusPerturbation, freqPerturbation) {
    this.t = t;
    this.radius = radius
    this.angle = angle;
    this.radiusPerturbation = radiusPerturbation;
    this.freqPerturbation = freqPerturbation;
}

function getPosition(t, radius, angle, radiusPerturbation, freqPerturbation) {
    var X = [radius * Math.cos(t), radius * Math.sin(t)];
    X[0] += radiusPerturbation * Math.cos(freqPerturbation * t);
    X[1] += radiusPerturbation * Math.sin(freqPerturbation * t);
    var A = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];

    var position = numeric.dot(A,X);

    return {x: position[0], y: position[1]};
}

Trajectory.prototype.getPosition = function() {
    return getPosition(this.t, this.radius, this.angle, this.radiusPerturbation, this.freqPerturbation);
}

Trajectory.prototype.update = function (speed) {
    this.t += speed;
    this.t %= 2 * Math.PI;
};
