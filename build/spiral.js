(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.spiral = global.spiral || {})));
}(this, (function (exports) { 'use strict';

function getStarsPosition(params) {
    var t0 = performance.now();
    var positions = [];
    for (var iTraj = 0; iTraj < params.nbrEllipses.value; iTraj++) {
        var a = iTraj + 1;
        var b = params.e.value * (iTraj + 1);
        var angle = (iTraj / params.nbrEllipses.value) * Math.PI * 2;
        var X = _.range(params.nbrStarsInEllipse.value).map(() => generateStarOnEllipse(a, b, angle, params.noise.value));
        positions = positions.concat(X);
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

function Trajectory(t, a, b, angle) {
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
};

Trajectory.prototype.update = function (speed) {
    this.t += speed;
    this.t %= 2 * Math.PI;
};

function Slider(div, domain, callback, params) {
    // Code by Ben Frederickson in fmin
    params = params || {};
    var margin = params.margin || {right: 13, left: 10},
        height = params.height || 35,
        format = params.format || function(d) { return d + "*"; },
        width = params.width || div.nodes()[0].offsetWidth;

    var svg = div.append("svg")
        .attr("width", width)
        .attr("height", height);

    var x = (params.scale || d3.scaleLinear())
        .domain(domain)
        .range([0, width - margin.left - margin.right])
        .clamp(true);

    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + 10 + ")");


    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")

      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay");

      // ugh: stroke-width on safari of track-overlay seems messed. drag on whole svg
      // instead
      svg
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() {
                var value = x.invert(d3.event.x - margin.right - margin.left);
                handle.attr("cx", x(value));
                callback(value);
            }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(params.ticks || 5))
      .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(format);

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9)
        .attr("cx", x(params.initial || x.invert(0)));

    function move(value, duration) {
       handle.transition().duration(duration).attr("cx", x(value));
    }

    function change(value) {
        handle.attr("cx", x(value));
        callback(value);
    }

    return {'change': change, 'move': move};
}

function SpiralCreator2D(div) {
    this.div = d3.select(div);
    this.myGalaxyDiv = d3.select("#my-galaxy");
    this.params =   {
        e: {label: "Excentricity", value: 1.3, range:[0.1, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        noise: {label: "Noise", value: 0.5, range: [0.1, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        nbrStarsInEllipse: {label: "Number of stars per ellipse", value: 150, range: [50, 500], scale: d3.scaleLinear(), ticks: 5, decimals: 0},
        nbrEllipses: {label: "Number of ellipses", value: 40, range: [10, 100], scale: d3.scaleLinear(), ticks: 10, decimals: 0}
    };

    this.margin = 25;
    this.widthCurve = this.myGalaxyDiv.nodes()[0].offsetWidth;
    this.heightCurve = 400;
    this.colorPoint = "#DBE3EB";
    this.sizePoint = 15;
    this.bgColor = '#080810';

    this.canvas = this.myGalaxyDiv.append("canvas")
    .attr("width", this.widthCurve).attr("height", this.heightCurve)
    .attr("style", "background-color: " + this.bgColor);
    this.context = this.canvas.node().getContext("2d");

    this.displayParams();
    this.displayStars();
}

SpiralCreator2D.prototype.createGradientColor = function() {
    var colorToRgba = function(hex, opacity) {
        var rgbColor = "rgba(";
        rgbColor = rgbColor.concat(parseInt(hex.slice(1,3), 16), ",");
        rgbColor = rgbColor.concat(parseInt(hex.slice(3,5), 16), ",");
        rgbColor = rgbColor.concat(parseInt(hex.slice(5,7), 16), ",");
        rgbColor = rgbColor.concat(opacity, ")");

        return rgbColor
    };
    var gradient = this.context.createRadialGradient(this.sizePoint / 2, this.sizePoint / 2, 0, this.sizePoint / 2,this.sizePoint / 2,this.sizePoint/2);
    gradient.addColorStop(0, colorToRgba(this.colorPoint, 1));
    gradient.addColorStop(0.25,colorToRgba(this.colorPoint, 0.1));
    gradient.addColorStop(0.75,colorToRgba(this.colorPoint, 0.05));
    gradient.addColorStop(1,colorToRgba(this.colorPoint, 0));

    return gradient

};

SpiralCreator2D.prototype.createStarImage = function(gradient) {
    var starCanvas = document.createElement('canvas'); // offscreen canvas to create a star
    starCanvas.width = this.sizePoint * 2;
    starCanvas.height = this.sizePoint * 2;
    var starContext = starCanvas.getContext("2d");

    starContext.fillStyle = gradient;
    starContext.arc(this.sizePoint, this.sizePoint, this.sizePoint, 0, 2*Math.PI, true);
    starContext.fill();

    return starCanvas;
};

SpiralCreator2D.prototype.displayStars = function () {
    var data = getStarsPosition(this.params);

    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.width);

    var gradient = this.createGradientColor();
    var starImage = this.createStarImage(gradient);

    var xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
    .range([this.margin,this.widthCurve - this.margin]);

    var yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
    .range([this.margin,this.heightCurve - this.margin]);


    var obj = this;
    data.forEach(function(d) {
        obj.context.drawImage(starImage, xScale(d.x), yScale(d.y));
    });
    this.context.fill();

};

SpiralCreator2D.prototype.displayParams = function() {
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
                obj.displayStars();
            },
            {'format': d => d.toString(),
              'initial': obj.params[p].value,
              'scale': obj.params[p].scale,
              'ticks': obj.params[p].ticks
            }
        );

    });
};

var oc = function( THREE ) {
	/**
	 * @author qiao / https://github.com/qiao
	 * @author mrdoob / http://mrdoob.com
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author erich666 / http://erichaines.com
	 */

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finter swipe

	function OrbitControls( object, domElement ) {

		this.object = object;

		this.domElement = ( domElement !== undefined ) ? domElement : document;

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus, where the object orbits around
		this.target = new THREE.Vector3();

		// How far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.25;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

		// Set to false to disable use of the keys
		this.enableKeys = true;

		// The four arrow keys
		this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

		// Mouse buttons
		this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		//
		// public methods
		//

		this.getPolarAngle = function () {

			return spherical.phi;

		};

		this.getAzimuthalAngle = function () {

			return spherical.theta;

		};

		this.reset = function () {

			scope.target.copy( scope.target0 );
			scope.object.position.copy( scope.position0 );
			scope.object.zoom = scope.zoom0;

			scope.object.updateProjectionMatrix();
			scope.dispatchEvent( changeEvent );

			scope.update();

			state = STATE.NONE;

		};

		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function() {

			var offset = new THREE.Vector3();

			// so camera.up is the orbit axis
			var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
			var quatInverse = quat.clone().inverse();

			var lastPosition = new THREE.Vector3();
			var lastQuaternion = new THREE.Quaternion();

			return function update () {

				var position = scope.object.position;

				offset.copy( position ).sub( scope.target );

				// rotate offset to "y-axis-is-up" space
				offset.applyQuaternion( quat );

				// angle from z-axis around y-axis
				spherical.setFromVector3( offset );

				if ( scope.autoRotate && state === STATE.NONE ) {

					rotateLeft( getAutoRotationAngle() );

				}

				spherical.theta += sphericalDelta.theta;
				spherical.phi += sphericalDelta.phi;

				// restrict theta to be between desired limits
				spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );

				// restrict phi to be between desired limits
				spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

				spherical.makeSafe();


				spherical.radius *= scale;

				// restrict radius to be between desired limits
				spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

				// move target to panned location
				scope.target.add( panOffset );

				offset.setFromSpherical( spherical );

				// rotate offset back to "camera-up-vector-is-up" space
				offset.applyQuaternion( quatInverse );

				position.copy( scope.target ).add( offset );

				scope.object.lookAt( scope.target );

				if ( scope.enableDamping === true ) {

					sphericalDelta.theta *= ( 1 - scope.dampingFactor );
					sphericalDelta.phi *= ( 1 - scope.dampingFactor );

				} else {

					sphericalDelta.set( 0, 0, 0 );

				}

				scale = 1;
				panOffset.set( 0, 0, 0 );

				// update condition is:
				// min(camera displacement, camera rotation in radians)^2 > EPS
				// using small-angle approximation cos(x/2) = 1 - x^2 / 8

				if ( zoomChanged ||
					lastPosition.distanceToSquared( scope.object.position ) > EPS ||
					8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

					scope.dispatchEvent( changeEvent );

					lastPosition.copy( scope.object.position );
					lastQuaternion.copy( scope.object.quaternion );
					zoomChanged = false;

					return true;

				}

				return false;

			};

		}();

		this.dispose = function() {

			scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
			scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
			scope.domElement.removeEventListener( 'wheel', onMouseWheel, false );

			scope.domElement.removeEventListener( 'touchstart', onTouchStart, false );
			scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );
			scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			window.removeEventListener( 'keydown', onKeyDown, false );

			//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

		};

		//
		// internals
		//

		var scope = this;

		var changeEvent = { type: 'change' };
		var startEvent = { type: 'start' };
		var endEvent = { type: 'end' };

		var STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };

		var state = STATE.NONE;

		var EPS = 0.000001;

		// current position in spherical coordinates
		var spherical = new THREE.Spherical();
		var sphericalDelta = new THREE.Spherical();

		var scale = 1;
		var panOffset = new THREE.Vector3();
		var zoomChanged = false;

		var rotateStart = new THREE.Vector2();
		var rotateEnd = new THREE.Vector2();
		var rotateDelta = new THREE.Vector2();

		var panStart = new THREE.Vector2();
		var panEnd = new THREE.Vector2();
		var panDelta = new THREE.Vector2();

		var dollyStart = new THREE.Vector2();
		var dollyEnd = new THREE.Vector2();
		var dollyDelta = new THREE.Vector2();

		function getAutoRotationAngle() {

			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

		}

		function getZoomScale() {

			return Math.pow( 0.95, scope.zoomSpeed );

		}

		function rotateLeft( angle ) {

			sphericalDelta.theta -= angle;

		}

		function rotateUp( angle ) {

			sphericalDelta.phi -= angle;

		}

		var panLeft = function() {

			var v = new THREE.Vector3();

			return function panLeft( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
				v.multiplyScalar( - distance );

				panOffset.add( v );

			};

		}();

		var panUp = function() {

			var v = new THREE.Vector3();

			return function panUp( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 1 ); // get Y column of objectMatrix
				v.multiplyScalar( distance );

				panOffset.add( v );

			};

		}();

		// deltaX and deltaY are in pixels; right and down are positive
		var pan = function() {

			var offset = new THREE.Vector3();

			return function pan ( deltaX, deltaY ) {

				var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

				if ( scope.object instanceof THREE.PerspectiveCamera ) {

					// perspective
					var position = scope.object.position;
					offset.copy( position ).sub( scope.target );
					var targetDistance = offset.length();

					// half of the fov is center to top of screen
					targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

					// we actually don't use screenWidth, since perspective camera is fixed to screen height
					panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
					panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

				} else if ( scope.object instanceof THREE.OrthographicCamera ) {

					// orthographic
					panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
					panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

				} else {

					// camera neither orthographic nor perspective
					console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
					scope.enablePan = false;

				}

			};

		}();

		function dollyIn( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale /= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		function dollyOut( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale *= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		//
		// event callbacks - update the object state
		//

		function handleMouseDownRotate( event ) {

			//console.log( 'handleMouseDownRotate' );

			rotateStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownDolly( event ) {

			//console.log( 'handleMouseDownDolly' );

			dollyStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownPan( event ) {

			//console.log( 'handleMouseDownPan' );

			panStart.set( event.clientX, event.clientY );

		}

		function handleMouseMoveRotate( event ) {

			//console.log( 'handleMouseMoveRotate' );

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleMouseMoveDolly( event ) {

			//console.log( 'handleMouseMoveDolly' );

			dollyEnd.set( event.clientX, event.clientY );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyIn( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyOut( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleMouseMovePan( event ) {

			//console.log( 'handleMouseMovePan' );

			panEnd.set( event.clientX, event.clientY );

			panDelta.subVectors( panEnd, panStart );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleMouseUp( event ) {

			//console.log( 'handleMouseUp' );

		}

		function handleMouseWheel( event ) {

			//console.log( 'handleMouseWheel' );

			if ( event.deltaY < 0 ) {

				dollyOut( getZoomScale() );

			} else if ( event.deltaY > 0 ) {

				dollyIn( getZoomScale() );

			}

			scope.update();

		}

		function handleKeyDown( event ) {

			//console.log( 'handleKeyDown' );

			switch ( event.keyCode ) {

				case scope.keys.UP:
					pan( 0, scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.BOTTOM:
					pan( 0, - scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.LEFT:
					pan( scope.keyPanSpeed, 0 );
					scope.update();
					break;

				case scope.keys.RIGHT:
					pan( - scope.keyPanSpeed, 0 );
					scope.update();
					break;

			}

		}

		function handleTouchStartRotate( event ) {

			//console.log( 'handleTouchStartRotate' );

			rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		}

		function handleTouchStartDolly( event ) {

			//console.log( 'handleTouchStartDolly' );

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyStart.set( 0, distance );

		}

		function handleTouchStartPan( event ) {

			//console.log( 'handleTouchStartPan' );

			panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		}

		function handleTouchMoveRotate( event ) {

			//console.log( 'handleTouchMoveRotate' );

			rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleTouchMoveDolly( event ) {

			//console.log( 'handleTouchMoveDolly' );

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyEnd.set( 0, distance );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyOut( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyIn( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleTouchMovePan( event ) {

			//console.log( 'handleTouchMovePan' );

			panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

			panDelta.subVectors( panEnd, panStart );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleTouchEnd( event ) {

			//console.log( 'handleTouchEnd' );

		}

		//
		// event handlers - FSM: listen for events and reset state
		//

		function onMouseDown( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			if ( event.button === scope.mouseButtons.ORBIT ) {

				if ( scope.enableRotate === false ) return;

				handleMouseDownRotate( event );

				state = STATE.ROTATE;

			} else if ( event.button === scope.mouseButtons.ZOOM ) {

				if ( scope.enableZoom === false ) return;

				handleMouseDownDolly( event );

				state = STATE.DOLLY;

			} else if ( event.button === scope.mouseButtons.PAN ) {

				if ( scope.enablePan === false ) return;

				handleMouseDownPan( event );

				state = STATE.PAN;

			}

			if ( state !== STATE.NONE ) {

				document.addEventListener( 'mousemove', onMouseMove, false );
				document.addEventListener( 'mouseup', onMouseUp, false );

				scope.dispatchEvent( startEvent );

			}

		}

		function onMouseMove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			if ( state === STATE.ROTATE ) {

				if ( scope.enableRotate === false ) return;

				handleMouseMoveRotate( event );

			} else if ( state === STATE.DOLLY ) {

				if ( scope.enableZoom === false ) return;

				handleMouseMoveDolly( event );

			} else if ( state === STATE.PAN ) {

				if ( scope.enablePan === false ) return;

				handleMouseMovePan( event );

			}

		}

		function onMouseUp( event ) {

			if ( scope.enabled === false ) return;

			handleMouseUp( event );

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			scope.dispatchEvent( endEvent );

			state = STATE.NONE;

		}

		function onMouseWheel( event ) {

			if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

			event.preventDefault();
			event.stopPropagation();

			handleMouseWheel( event );

			scope.dispatchEvent( startEvent ); // not sure why these are here...
			scope.dispatchEvent( endEvent );

		}

		function onKeyDown( event ) {

			if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;

			handleKeyDown( event );

		}

		function onTouchStart( event ) {

			if ( scope.enabled === false ) return;

			switch ( event.touches.length ) {

				case 1:	// one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;

					handleTouchStartRotate( event );

					state = STATE.TOUCH_ROTATE;

					break;

				case 2:	// two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;

					handleTouchStartDolly( event );

					state = STATE.TOUCH_DOLLY;

					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;

					handleTouchStartPan( event );

					state = STATE.TOUCH_PAN;

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				scope.dispatchEvent( startEvent );

			}

		}

		function onTouchMove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();
			event.stopPropagation();

			switch ( event.touches.length ) {

				case 1: // one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;
					if ( state !== STATE.TOUCH_ROTATE ) return; // is this needed?...

					handleTouchMoveRotate( event );

					break;

				case 2: // two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;
					if ( state !== STATE.TOUCH_DOLLY ) return; // is this needed?...

					handleTouchMoveDolly( event );

					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;
					if ( state !== STATE.TOUCH_PAN ) return; // is this needed?...

					handleTouchMovePan( event );

					break;

				default:

					state = STATE.NONE;

			}

		}

		function onTouchEnd( event ) {

			if ( scope.enabled === false ) return;

			handleTouchEnd( event );

			scope.dispatchEvent( endEvent );

			state = STATE.NONE;

		}

		function onContextMenu( event ) {

			event.preventDefault();

		}

		//

		scope.domElement.addEventListener( 'contextmenu', onContextMenu, false );

		scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
		scope.domElement.addEventListener( 'wheel', onMouseWheel, false );

		scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
		scope.domElement.addEventListener( 'touchend', onTouchEnd, false );
		scope.domElement.addEventListener( 'touchmove', onTouchMove, false );

		window.addEventListener( 'keydown', onKeyDown, false );

		// force an update at start

		this.update();

	}

	OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
	OrbitControls.prototype.constructor = OrbitControls;

	Object.defineProperties( OrbitControls.prototype, {

		center: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .center has been renamed to .target' );
				return this.target;

			}

		},

		// backward compatibility

		noZoom: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				return ! this.enableZoom;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				this.enableZoom = ! value;

			}

		},

		noRotate: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				return ! this.enableRotate;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				this.enableRotate = ! value;

			}

		},

		noPan: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				return ! this.enablePan;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				this.enablePan = ! value;

			}

		},

		noKeys: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				return ! this.enableKeys;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				this.enableKeys = ! value;

			}

		},

		staticMoving : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				return ! this.enableDamping;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				this.enableDamping = ! value;

			}

		},

		dynamicDampingFactor : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				return this.dampingFactor;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				this.dampingFactor = value;

			}

		}

	} );

	return OrbitControls;
};

var OrbitControls = oc(THREE);

function SpiralCreator3D(div) {
    this.myGalaxyDiv = document.getElementById("my-galaxy");
    this.margin = 25;
    this.widthGalaxy = this.myGalaxyDiv.offsetWidth;
    this.heightGalaxy = 400;
    this.colorStar = "#DBE3EB";
    this.radiusStar = 5;
    this.speed = 0.01;

    this.params =   {
        e: {label: "Excentricity", value: 1.3, range:[0.1, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        noise: {label: "Noise", value: 0.8, range: [0.1, 10], scale: d3.scaleLog(), ticks: 2, decimals: 2},
        nbrStarsInEllipse: {label: "Number of stars per ellipse", value: 400, range: [50, 500], scale: d3.scaleLinear(), ticks: 5, decimals: 0},
        nbrEllipses: {label: "Number of ellipses", value: 100, range: [10, 100], scale: d3.scaleLinear(), ticks: 10, decimals: 0},
        speed: {label: "Speed", value: 0.02, range:[0.001, 0.1], scale: d3.scaleLog(), ticks: 2, decimals: 2},
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
};

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
        obj.stars.vertices[i].traj = new Trajectory(d.t, d.a, d.b, d.angle);
        obj.stars.vertices[i].traj = new Trajectory(d.t, d.a, d.b, d.angle);
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
};

exports.SpiralCreator2D = SpiralCreator2D;
exports.SpiralCreator3D = SpiralCreator3D;

Object.defineProperty(exports, '__esModule', { value: true });

})));
