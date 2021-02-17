

$(document).ready(function(){

    var corners = {
        "A": [100, 500],
        "B": [500, 500],
        "C": [250, 250]
    };
    var angleSlices = {
        "A": false,
        "B": false,
        "C": false
    };
    function updateCoords(corner_a, corner_b, corner_c) {
        if (corner_a != corners.A) {
            corners.A = corner_a;
            $('#a-coords').text(corners.A);
        }
        if (corner_b != corners.B) {
            corners.B = corner_b;
            $('#b-coords').text(corners.B);
        }
        if (corner_c != corners.C) {
            corners.C = corner_c;
            $('#c-coords').text(corners.C)
        }
    }
    /*
    function addAngle(corner, angles) {
        var angle = Math.round(Math.abs(angles[0] - angles[1]));
        if (angle > 180) {
            angle -= 180;
        }
        console.log(corner, angle)
        var rectCorner = [corners[corner][0], corners[corner][1]];
        var height = 30;
        var width = 30;
        if (angle == 90) {
            $('canvas').removeLayer(corner + '_slice')
            .drawRect({
                name: corner + '_slice',
                layer: true,
                groups: ['triangle'],
                dragGroups: ['triangle'],
                strokeStyle: 'black',
                x: rectCorner[0], y: rectCorner[1],
                width: width, height: height,
                fromCenter: false
            }).drawLayers()
        } else {
            $('canvas').removeLayer(corner + '_slice')
            .drawSlice({
            name: corner + '_slice',
            layer: true,
            groups: ['triangle'],
            dragGroups: ['triangle'],
            strokeStyle: 'black',
            x: corners[corner][0], y: corners[corner][1],
            radius: 30,
            start: angles[0], end: angles[1]
        }).drawLayers()
        }
        
    }
    function calcNormAngle(rootCorner, corner) {
        var vector = [corner[0] -rootCorner[0], (corner[1] - rootCorner[1])*(-1)];
        var angle = Math.acos(vector[1]/Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2)))*180/Math.PI;
        if (vector[0] >= 0) {
            return angle;
        } else {
            return angle*(-1)
        }
    }
    
    
    */

    function calcVector(rootcorner, corner) {
        return [corner[0] - rootcorner[0], corner[1] - rootcorner[1]];
    }
    function calcNormAngle(rootcorner, corner) {
        var vector = calcVector(rootcorner, corner)
        var angle = Math.acos(vector[1]*(-1)/Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2)))*180/Math.PI;
        //console.log('vinkel: ', angle)
        if (vector[0] < 0) {
            return 360 - angle;
        } else {
            return angle;
        }
    }

    function drawAngle(rootcorner, corner1, corner2, name) {
        var angle1 = calcNormAngle(rootcorner, corner1);
        var angle2 = calcNormAngle(rootcorner, corner2);
        console.log(angle1, angle2)
        var vector1 = calcVector(rootcorner, corner1);
        var vector2 = calcVector(rootcorner, corner2);
        var sumVector = [vector1[0] + vector2[0], vector1[1] + vector2[1]];
        if (sumVector[0] > 0) {
            if (vector1[1] < vector2[1]) {
                var leftAngle = angle1;
                var rightAngle = angle2;
            } else {
                var leftAngle = angle2;
                var rightAngle = angle1;
            }
        } else if (sumVector[0] < 0) {
            if (vector1[1] > vector2[1]) {
                var leftAngle = angle1;
                var rightAngle = angle2;
            } else {
                var leftAngle = angle2;
                var rightAngle = angle1;
            }
        }
        $('canvas').removeLayer(name + '_arc')
        .drawArc({
            strokeStyle: 'black',
            strokeWidth: 2,
            radius: 20,
            draggable: true,
            groups: ['triangle'],
            dragGroups: ['triangle'],
            name: name + '_arc',
            x: rootcorner[0], y: rootcorner[1],
            start: leftAngle, end: rightAngle
        }).drawLayers();
    }
    function updateAngle(corner) {
        if (corner=='A') {
            if (angleSlices.A == false) {
                angleSlices.A = true;
                drawAngle(corners.A, corners.B, corners.C, 'A');
            } else {
                angleSlices.A = false;
                $('canvas').removeLayer('A_arc').drawLayers()
            }
        } else if (corner=='B') {
            if (angleSlices.B == false) {
                angleSlices.B = true;
                drawAngle(corners.B, corners.A, corners.C, 'B')
            } else {
                angleSlices.B = false;
                $('canvas').removeLayer('B_arc').drawLayers()
            }
        } else if (corner=='C') {
            if (angleSlices.C == false) {
                angleSlices.C = true;
                drawAngle(corners.C, corners.A, corners.B, 'C')
            } else {
                angleSlices.C = false;
                $('canvas').removeLayer('C_arc').drawLayers()
            }
        }
    }
    $('.angle').click(function() {
        var id = $(this).attr('id');
        if (id=='angle-a') {
            updateAngle('A');
        }   else if (id=='angle-b') {
            updateAngle('B');
        }   else if (id=='angle-c') {
            updateAngle('C');
        }
    });
    $('#create').click(function() {
        $('canvas').addLayer({
            type: 'line',
            groups: ['triangle'],
            dragGroups: ['triangle'],
            draggable: true,
            strokeStyle: 'black',
            strokeWidth: 2,
            x1: corners.A[0], y1: corners.A[1],
            x2: corners.B[0], y2: corners.B[1],
            x3: corners.C[0], y3: corners.C[1],
            closed: true,
            handle: {
                type: 'arc',
                fillStyle: 'black',
                strokeStyle: 'black',
                strokeWidth: 2,
                radius: 10
            },
            handlestop: function(layer) {
                updateCoords(
                    [layer.x1 + layer.x, layer.y1 + layer.y], 
                    [layer.x2 + layer.x, layer.y2 + layer.y], 
                    [layer.x3 + layer.x, layer.y3 + layer.y]
                    );
                for (slice in angleSlices) {
                    if (angleSlices[slice] == true) {
                        angleSlices[slice] = false;
                        updateAngle(slice);
                    }
                };
            },
            dragstop: function(layer) {
                updateCoords(
                    [layer.x1 + layer.x, layer.y1 + layer.y], 
                    [layer.x2 + layer.x, layer.y2 + layer.y], 
                    [layer.x3 + layer.x, layer.y3 + layer.y]
                    );
            }
       })
       .drawLayers();
   }) 
   $('#erase').click(function() {
        $('canvas').removeLayers().drawLayers();
   })
});