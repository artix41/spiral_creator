export function getStarsPosition(params) {
    var nbrEllipses = 50;
    var x = [], y = [];
    for (var iTraj = 0; iTraj < nbrEllipses; iTraj++) {
        var a = 1 * (iTraj + 1);
        var b = 2 * (iTraj + 1);
        var angle = (iTraj / nbrEllipses) * Math.PI / 2;
        var X = _.range(150).map(() => getStarOnEllipse(a,b,angle));
        x = x.concat(X.map(pos => pos.x));
        y = y.concat(X.map(pos => pos.y));
    }
    console.log(x)
    return {x: x, y: y};
}

function getStarOnEllipse(a, b, angle) {
    var t = Math.random() * 2 * Math.PI;
    var X = [a * Math.cos(t), b * Math.sin(t)];
    var A = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];
    var position = numeric.dot(A,X);

    return {x: position[0], y: position[1]};
}