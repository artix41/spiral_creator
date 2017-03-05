export function getStarsPosition(params) {
    var positions = [];
    for (var iTraj = 0; iTraj < params.nbrEllipses.value; iTraj++) {
        var a = iTraj + 1;
        var b = params.e.value * (iTraj + 1);
        var angle = (iTraj / params.nbrEllipses.value) * Math.PI * 2;
        var X = _.range(params.nbrStarsInEllipse.value).map(() => getStarOnEllipse(a, b, angle, params.noise.value));
        positions = positions.concat(X)
    }
    return positions;
}

function getStarOnEllipse(a, b, angle, noise) {
    var t = Math.random() * 2 * Math.PI;
    var X = [a * Math.cos(t), b * Math.sin(t)];
    var A = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];
    var position = numeric.dot(A,X);

    return {x: position[0] + rnorm(0,noise), y: position[1] + rnorm(0,noise)};
}
